import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaClientInitializationError } from '@prisma/client/runtime/binary';
import { PrismaService } from 'src/prisma/prisma.service';
import { joinRoomService } from '../joinroom/joinroom.service';
import { ChatroomService } from '../chatroom.service';

@Injectable()
export class UserRoomService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly rooms: joinRoomService,
    private readonly chat: ChatroomService,
  ) {}
  async searchUsersRoom(name: string, roomId: number) {
    try {
      if (name.trim() === '') throw new ForbiddenException('required');
      const result = await this.prisma.user.findMany({
        where: {
          UserName: {
            contains: name,
          },
        },
        include: {
          UsersRooms: {
            where: { roomId: roomId },
          },
        },
      });
      const arr = [];
      result.map((ele) => {
        if (ele.UsersRooms.length) arr.push(ele);
      });
      return arr;
    } catch (error) {
      if (error instanceof PrismaClientInitializationError)
        if (error.message === 'P2002')
          throw new ForbiddenException('error searching');
      throw error;
    }
  }
  async searchUsers(name: string, roomId: number, userId: number) {
    try {
      const checkExits = await this.prisma.usersRoom.findFirst({
        where: {
          AND: { userId: userId, roomId: roomId },
        },
      });
      if (!checkExits) throw new ForbiddenException('you dont have permission');
      if (name.trim() === '')
        throw new ForbiddenException('required input search');
      const findBlockedUser = await this.prisma.block.findMany({
        where: {
          OR: [{ userId }, { blockedUserId: userId }],
        },
        select: {
          blockedUserId: true,
          userId: true,
        },
      });
      const findFriendUser = await this.prisma.friend.findMany({
        where: {
          OR: [{ userId }, { friendId: userId }],
          status: 'accepted',
        },
        select: {
          friendId: true,
          userId: true,
        },
      });
      const blocked = findBlockedUser.map((element) =>
        element.userId === userId ? element.blockedUserId : element.userId,
      );
      const friend = findFriendUser.map((element) =>
        element.userId === userId ? element.friendId : element.userId,
      );
      const result = await this.prisma.user.findMany({
        where: {
          NOT: { id: { in: blocked } },
          id: { in: friend },
          UserName: {
            contains: name,
          },
        },
        include: {
          UsersRooms: {
            where: {
              roomId: roomId,
            },
          },
          BlockUsers: {
            where: {
              roomId: roomId,
            },
          },
          RoomChats: {
            select: {
              name: true,
            },
          },
        },
        take: 6,
      });

      return result;
    } catch (error) {
      if (error instanceof PrismaClientInitializationError)
        if (error.message === 'P2002')
          throw new ForbiddenException('error searching');
      throw error;
    }
  }

  async inviteUsersRoom(userId: number, roomId: number, admin: number) {
    try {
      //   const admin = await this.rooms.checkListAdmin(userId, roomId);
      const user = await this.rooms.checkListUser(userId, roomId);
      const block = await this.rooms.checkListBlock(userId, roomId);
      if (block) throw new ForbiddenException(`membes is blocked`);
      if (user) throw new ConflictException('elraedy exist in room ');
      const room = await this.prisma.roomChat.findUnique({
        where: { id: roomId },
      });
      const init = await this.chat.initailuser(
        userId,
        roomId,
        false,
        room.type === 'protected' ? true : false,
      );
      await this.rooms.sendNotification(admin, userId, 'member', roomId);
      return init;
    } catch (error) {
      if (error instanceof PrismaClientInitializationError)
        if (error.message === 'P2002')
          throw new ForbiddenException('error searching');
      throw error;
    }
  }
}
