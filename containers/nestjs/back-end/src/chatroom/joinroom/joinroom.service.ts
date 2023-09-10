import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientUnknownRequestError } from '@prisma/client/runtime/binary';
import * as argon2 from 'argon2';
import { BlockUserDto } from './joinRoom.dto';
import { ChatroomService } from '../chatroom.service';
import { NotificationService } from 'src/notification/services/notification/notification.service';

@Injectable()
export class joinRoomService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly chatRoom: ChatroomService,
    private notif: NotificationService,
  ) {}

  async checkListBlock(userId: number, roomId: number) {
    try {
      const checkisBlock = await this.prisma.blockUsers.findFirst({
        where: {
          AND: { userId: userId, roomId: roomId },
        },
      });
      return checkisBlock;
    } catch (error) {
      if (error instanceof PrismaClientUnknownRequestError)
        if (error.message === 'P2002')
          throw new ForbiddenException('error join room!');
      return error;
    }
  }

  async checkListUser(userId: number, roomId: number) {
    try {
      const checkusers = await this.prisma.usersRoom.findFirst({
        where: {
          AND: { userId: userId, roomId: roomId },
        },
      });
      return checkusers;
    } catch (error) {
      if (error instanceof PrismaClientUnknownRequestError)
        if (error.message === 'P2002')
          throw new ForbiddenException('error join room!');
      return error;
    }
  }

  async joinRoom(id: number, userId: number, password?: string) {
    try {
      const findRoom = await this.prisma.roomChat.findFirst({
        where: {
          id: id,
        },
      });
      if (!findRoom || findRoom.type === 'private')
        throw new ForbiddenException('cant find room');
      if (findRoom.type === 'protected') {
        if (password === '' || !password)
          throw new ForbiddenException('required password!');
        const verifyPassword = await argon2.verify(findRoom.password, password);
        if (!verifyPassword) {
          throw new ForbiddenException('Password incorrect !');
        }
      }
      if (await this.checkListBlock(userId, id)) {
        throw new ForbiddenException('you are blocked in this room by admin !');
      }
      const checkIfexitsUser = await this.prisma.usersRoom.findFirst({
        where: { AND: { userId: userId, roomId: id } },
      });
      if (checkIfexitsUser)
        return await this.prisma.usersRoom.update({
          where: { id: checkIfexitsUser.id },
          data: {
            locked: false,
          },
        });

      await this.chatRoom.initailuser(userId, id);
      return this.getResultatUser(userId, id);
    } catch (error) {
      if (error instanceof PrismaClientUnknownRequestError)
        if (error.message === 'P2002') throw new ForbiddenException('error');
      throw error;
    }
  }

  async findRoomById(id: number) {
    try {
      return await this.prisma.roomChat.findUnique({
        where: { id: id },
        select: {
          name: true,
          avatar: true,
          type: true,
          createAt: true,
          ownerId: true,
          UsersRooms: {
            select: {
              id: true,
              userId: true,
              isadmin: true,
              timermute: true,
            },
          },
          BlockUsers: {
            select: {
              id: true,
              userId: true,
            },
          },
          MessageRooms: {
            select: {
              id: true,
              message: true,
              userId: true,
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }
  async getResultatUser(userId: number, roomId: number) {
    try {
      return await this.prisma.usersRoom.findFirst({
        where: {
          roomId: roomId,
          userId: userId,
        },
        select: {
          id: true,
          createAt: true,
          updatedAt: true,
          userId: true,
          roomId: true,
          locked: true,
          isadmin: true,
          timermute: true,
          userroom: {
            select: {
              UserName: true,
              avatar: true,
              isOnline: true,
              id: true,
            },
          },
          chat: {
            select: {
              ownerId: true,
              name: true,
              id: true,
              avatar: true,
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async sendNotification(
    from: number,
    to: number,
    type: string,
    roomId: number,
  ) {
    const getFrom = await this.prisma.user.findUnique({
      where: { id: from },
    });
    const getRoom = await this.prisma.roomChat.findUnique({
      where: { id: roomId },
    });

    let message = `${getFrom.UserName} add you as admin to room ${getRoom.name}`;
    if (type === 'member')
      message = `${getFrom.UserName} add you as member to room ${getRoom.name}`;

    await this.notif.roomNotification({
      from: from,
      to: to,
      message: message,
    });
  }

  async makeAdmin(
    userId: number,
    roomId: number,
    adminId: number,
    isAdmin: boolean,
  ) {
    try {
      const find = await this.findRoomById(roomId);
      if (!find) throw new NotFoundException('can`t find this room try again!');

      await this.checkedRole(userId, adminId, roomId);

      const checkIfInRoom = await this.checkListUser(userId, roomId);
      if (!checkIfInRoom)
        throw new NotFoundException(`user not members in ${find.name}`);

      await this.prisma.usersRoom.update({
        where: { id: checkIfInRoom.id },
        data: { isadmin: isAdmin },
      });
      if (isAdmin) {
        await this.sendNotification(adminId, userId, 'admin', roomId);
      }
      return this.getResultatUser(userId, roomId);
    } catch (error) {
      throw error;
    }
  }
  async setAdminApply(newOwner: number, roomId: number, lastOwner: number) {
    try {
      await this.prisma.usersRoom.updateMany({
        where: { userId: newOwner, roomId: roomId },
        data: {
          isadmin: true,
        },
      });
      await this.prisma.roomChat.update({
        where: { id: roomId },
        data: {
          ownerId: newOwner,
        },
      });
      await this.prisma.usersRoom.deleteMany({
        where: {
          AND: { userId: lastOwner, roomId: roomId },
        },
      });
      //   TODO emit notification
      await this.sendNotification(lastOwner, newOwner, 'admin', roomId);
    } catch (error) {
      throw error;
    }
  }

  async signOwner(userId: number, roomId: number) {
    try {
      const findFirstAdmin = await this.prisma.usersRoom.findFirst({
        where: {
          NOT: { userId: userId },
          AND: { roomId: roomId, isadmin: true },
        },
      });
      if (findFirstAdmin)
        return await this.setAdminApply(findFirstAdmin.userId, roomId, userId);

      const findFirstuser = await this.prisma.usersRoom.findFirst({
        where: {
          NOT: { userId: userId },
          AND: { roomId: roomId, isadmin: false },
        },
      });

      if (findFirstuser)
        return await this.setAdminApply(findFirstuser.userId, roomId, userId);

      await this.prisma.messageRoom.deleteMany({
        where: { AND: { roomId } },
      });

      await this.prisma.usersRoom.deleteMany({
        where: { AND: { roomId} },
      });

      await this.prisma.blockUsers.deleteMany({
        where: { AND: { roomId} },
      });


       await this.prisma.messageRoom.deleteMany({
        where: { roomId   },
      });

      return await this.prisma.roomChat.delete({
        where: {
          id: roomId,
        },
      });
    } catch (error) {
      throw error;
    }
  }
  async leaveRoom(userId: number, roomId: number) {
    try {
      const checkStatusUser = await this.getResultatUser(userId, roomId);

      const room = await this.findRoomById(roomId);
      if (!room) throw new NotFoundException('room not exists');

      if (checkStatusUser && room.ownerId === userId) {
        await this.signOwner(userId, roomId);
      } else
        await this.prisma.usersRoom.delete({
          where: {
            id: checkStatusUser.id,
          },
        });

      return checkStatusUser;
    } catch (error) {
      throw error;
    }
  }
  private async blockedUser(userId: number, roomId: number) {
    try {
      const block = await this.prisma.blockUsers.create({
        data: {
          userId: userId,
          roomId: roomId,
          updatedAt: new Date(),
        },
      });
      return block;
    } catch (error) {
      if (error instanceof PrismaClientUnknownRequestError)
        if (error.message === 'P2002')
          throw new ForbiddenException('error join room!');
      throw error;
    }
  }

  private async mutedUser(userId: number, roomId: number, timerMuted: number) {
    try {
      const rt = timerMuted * 60;
      const timer = Math.floor(Date.now() / 1000) + rt;

      const userIxist = await this.checkListUser(userId, roomId);
      if (!userIxist)
        throw new ForbiddenException('user doesn`t exist');

      const mutedUpdate = await this.prisma.usersRoom.update({
        where: { id: userIxist.id },
        data: { timermute: timer.toString() },
      });
      return mutedUpdate;
    } catch (error) {
      if (error instanceof PrismaClientUnknownRequestError)
        if (error.message === 'P2002')
          throw new ForbiddenException('error join room!');
      throw error;
    }
  }
  async getInfoRoom(id: number) {
    try {
      const room = await this.prisma.roomChat.findFirst({
        where: {
          id: id,
        },
        select: {
          id: true,
          createAt: true,
          updatedAt: true,
          name: true,
          descreption: true,
          avatar: true,
          type: true,
          ownerId: true,
        },
      });
      if (!room) throw new ForbiddenException('not found room');
      return room;
    } catch (error) {
      throw error;
    }
  }
  async chekMuted(userId: number, roomId: number) {
    try {
      const checkMuted = await this.prisma.usersRoom.findFirst({
        where: {
          AND: { userId: userId, roomId: roomId },
        },
      });
      if (!checkMuted) return;
      const countDowntimer =
        parseInt(checkMuted.timermute) - Math.floor(Date.now() / 1000);

      if (countDowntimer < 0) {
        const userIxist = await this.checkListUser(userId, roomId);
        if (!userIxist)
          throw new ForbiddenException('user doesn`t exist');
        await this.prisma.usersRoom.update({
          where: { id: userIxist.id },
          data: {
            timermute: '0',
          },
        });
      }
      return countDowntimer < 0 ? 0 : countDowntimer;
    } catch (error) {
      throw error;
    }
  }
  private async checkedRole(userId: number, adminId: number, roomId: number) {
    try {
      // check is elrady blocked
      if (await this.checkListBlock(userId, roomId))
        throw new ForbiddenException('user is blocked !');

      const checkAdmin = await this.checkListUser(adminId, roomId);
      if (checkAdmin && !checkAdmin.isadmin)
        throw new NotFoundException('you are not admin!');

      const checklist = await this.checkListUser(userId, roomId);
      if (!checklist)
        throw new NotFoundException('user not found in this room !');

      // admin doesn't remove
      const room = await this.prisma.roomChat.findFirst({
        where: { id: roomId },
      });

      if (room.ownerId === userId)
        throw new ForbiddenException(
          ' imposible [banned, kick, mute,] admin or owner',
        );
    } catch (error) {
      throw error;
    }
  }

  async blockUser(body: BlockUserDto) {
    try {
      const { userId, roomId, adminId, type, timer } = body;
      //check  if  admin
      await this.checkedRole(userId, adminId, roomId);

      const info = await this.getResultatUser(userId, roomId);

      //add to list block
      let checkTypeOfleave;

      if (type === 'block')
        checkTypeOfleave = await this.blockedUser(userId, roomId);
      else if (type === 'mute') {
        await this.mutedUser(userId, roomId, timer);
        return await this.getResultatUser(userId, roomId);
      } else if (type === 'kick') checkTypeOfleave = true;
      else throw new ForbiddenException('not selected type of leave');
      if (checkTypeOfleave || type === 'kick') {
        await this.leaveRoom(userId, roomId);
        return info;
      }
      return info;
    } catch (error) {
      throw error;
    }
  }
  async unblockUser(userIdBlock, roomId, adminId) {
    const checkIfUserBlock = await this.checkListBlock(userIdBlock, roomId);
    if (!checkIfUserBlock)
      throw new ForbiddenException(
        'user is not in list blocked !',
      );
    if (userIdBlock === adminId)
      throw new ForbiddenException('permission denied remove admin !');

    const block = await this.prisma.blockUsers.delete({
      where: {
        id: checkIfUserBlock.id,
      },
      include: {
        chat: true,
        userroom: {
          select: {
            avatar: true,
            id: true,
            UserName: true,
          },
        },
      },
    });
    if (block) return block;
  }
  catch(error) {
    throw error;
  }
}
