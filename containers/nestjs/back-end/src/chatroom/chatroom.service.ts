import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatRoomDto, UpdateRoomDto } from './chatroom.dto';
import { PrismaClientUnknownRequestError } from '@prisma/client/runtime/binary';
import * as argon2 from 'argon2';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChatroomService {
  constructor(
    private readonly prisma: PrismaService,
    private ConfigServ: ConfigService,
  ) {}

  //   async protectedUser(userId: number, reqId: number) {
  //     try {
  //       if (userId !== reqId)
  //         throw new ForbiddenException('user dont have permission');

  //       const checkTwoFactor = await this.prisma.user.findUnique({
  //         where: {
  //           id: userId,
  //         },
  //         select: {
  //           twofactor: true,
  //           isOnTwoFactor: true,
  //           firstTime: true,
  //           id: true,
  //           UserName: true,
  //         },
  //       });
  //       if (checkTwoFactor.isOnTwoFactor && checkTwoFactor.twofactor)
  //         throw new NotAcceptableException('required passcode');
  //       //   if (checkTwoFactor.firstTime) {
  //       //     throw new UnauthorizedException('invalid data');
  //       //   }
  //     } catch (error) {
  //       if (error instanceof PrismaClientUnknownRequestError) {
  //         if (error.message === 'P2002')
  //           throw new ForbiddenException('error create');
  //       }
  //       throw error;
  //     }
  //   }

  async checkIfexitsRoom(chatName: string): Promise<boolean> {
    try {
      const checkroom = await this.prisma.roomChat.findUnique({
        where: {
          name: chatName,
        },
      });
      return checkroom ? true : false;
    } catch (error) {
      if (error instanceof PrismaClientUnknownRequestError) {
        if (error.message === 'P2002')
          throw new ForbiddenException('error create');
      }
      throw error;
    }
  }
  async hashpassword(password: string) {
    try {
      if (!this.checkStringPass(password))
        throw new ForbiddenException('password is Low');

      const hash = await argon2.hash(password);
      return hash;
    } catch (error) {
      throw error;
    }
  }
  async addToDataBases(body: ChatRoomDto) {
    const passwordChecked =
      body.type === 'protected' ? await this.hashpassword(body.password) : null;
    const addnewRoom = await this.prisma.roomChat.create({
      data: {
        name: body.name,
        descreption: body.descreption,
        avatar: body.image,
        type: body.type,
        password: passwordChecked,
        ownerId: parseInt(body.ownerId),
        updatedAt: new Date(),
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
    await this.initailuser(parseInt(body.ownerId), addnewRoom.id, true);
    const getRooms = await this.prisma.usersRoom.findFirst({
      where: {
        AND: { userId: addnewRoom.ownerId, roomId: addnewRoom.id },
      },
      include: {
        chat: {
          select: {
            name: true,
            descreption: true,
            createAt: true,
            updatedAt: true,
            ownerId: true,
            avatar: true,
            id: true,
            type: true,
          },
        },
        userroom: {
          select: {
            UserName: true,
            id: true,
          },
        },
      },
    });
    return getRooms;
  }

  checkTypeRoom(type: string): boolean {
    const element: any = [
      { name: 'public' },
      { name: 'private' },
      { name: 'protected' },
    ];
    const findElement = element.filter((types) => types.name === type);
    return findElement.length > 0 ? true : false;
  }

  async initailuser(
    userId: number,
    roomId: number,
    isAdmin?: boolean,
    isLocked?: boolean,
  ) {
    try {
      const checkroom = await this.prisma.roomChat.findFirst({
        where: {
          id: roomId,
        },
      });
      if (!checkroom)
        throw new ForbiddenException('not found room');
      const createUser = await this.prisma.usersRoom.create({
        data: {
          userId: userId,
          roomId: roomId,
          isadmin: isAdmin,
          locked: isLocked,
          updatedAt: new Date(),
        },
        include: {
          chat: {
            select: {
              ownerId: true,
              name: true,
            },
          },
          userroom: {
            select: {
              UserName: true,
              id: true,
              avatar: true,
              isOnline: true,
            },
          },
        },
      });
      if (!createUser)
        throw new ForbiddenException('error create user');
      return createUser;
    } catch (error) {
      if (error instanceof PrismaClientUnknownRequestError) {
        if (error.message === 'P2002') {
          throw new ForbiddenException('cant create owner');
        }
      }
      throw error;
    }
  }
  checkStringPass(input: string) {
    const Symblos = /[^\w\s]/g;
    const upperCase = /[A-Z]/g;
    const lowerCase = /[a-z]/g;
    const numbers = /[0-9]/g;
    return input.match(Symblos) &&
      input.match(upperCase) &&
      input.match(lowerCase) &&
      input.match(numbers) &&
      input.length > 7
      ? true
      : false;
  }

  async createRoom(body: ChatRoomDto) {
    try {
      if (!this.checkTypeRoom(body.type)) {
        throw new ForbiddenException('type of room invalid!');
      }
      if (await this.checkIfexitsRoom(body.name))
        throw new ForbiddenException(`${body.name} already exists`);
      return this.addToDataBases(body);
    } catch (error) {
      if (error instanceof PrismaClientUnknownRequestError) {
        if (error.message === 'P2002')
          throw new ForbiddenException('error create');
      }
      throw error;
    }
  }

  async updateroom(body: UpdateRoomDto, id: number, userId: number) {
    try {
      const checkisInRoom = await this.prisma.usersRoom.findFirst({
        where: {
          AND: { userId: userId, roomId: id },
        },
      });
      if ((checkisInRoom && checkisInRoom.isadmin === false) || !checkisInRoom)
        throw new ForbiddenException('dont have permission');
      body.password =
        body.type === 'protected'
          ? await this.hashpassword(body.password)
          : null;
      const updateroom = await this.prisma.roomChat.update({
        where: {
          id,
        },
        data: {
          name: body.name,
          avatar: body.image,
          type: body.type,
          password: body.password,
          descreption: body.descreption,
        },
      });
      return updateroom;
    } catch (error) {
        throw error;
    }
  }

  async uploadImage(imageData: Buffer): Promise<string> {
    try {
      const base64Image = imageData.toString('base64');
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${this.ConfigServ.get('IMGBB')}`,
        {
          image: base64Image,
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      return response.data.data.image.url;
    } catch (error) {
        throw error;
    }
  }
  async findLatestRoom(userId: number) {
    try {
      const getRooms = await this.prisma.usersRoom.findMany({
        where: {
          userId: userId,
        },
        orderBy: { id: 'desc' },
        take: 30,
        include: {
          chat: {
            select: {
              name: true,
              descreption: true,
              createAt: true,
              updatedAt: true,
              ownerId: true,
              avatar: true,
              id: true,
              type: true,
            },
          },
          userroom: {
            select: {
              UserName: true,
              id: true,
            },
          },
        },
      });
      return getRooms;
    } catch (error) {
      if (error instanceof PrismaClientUnknownRequestError) {
        if (error.message === 'P2002')
          throw new ForbiddenException('Error message');
      }
      throw error;
    }
  }
  async findPublicProtectedRooms(id: number, page: number, search?: string) {
    try {
      if (!page) page = 0;
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          UsersRooms: {
            select: {
              chat: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });
      const userIds = user.UsersRooms.map((ele) => ele.chat.id);
      const data = await this.prisma.roomChat.findMany({
        where: {
          NOT: { id: { in: userIds } },
          type: { in: ['public', 'protected'] },
          name: {
            contains: search,
          },
        },
        orderBy: { id: 'desc' },
        select: {
          id: true,
          name: true,
          descreption: true,
          avatar: true,
          type: true,
        },
        take: 8,
        skip: page === -1 ? (page = 0) : page * 8,
      });

      return data;
    } catch (error) {
      throw error;
    }
  }
  async deleteRoom(userId: number, roomId: number) {
    try {
      const checkRommexist = await this.prisma.roomChat.findFirst({
        where: {
          AND: { id: roomId, ownerId: userId },
        },
        include: {
          userroomchat: true,
        },
      });
      if (checkRommexist) return checkRommexist;
    } catch (error) {
      if (error instanceof PrismaClientUnknownRequestError)
        if (error.message == 'P2002')
          throw new ForbiddenException('error delete');
      throw error;
    }
  }
  async getusersByroom(roomId: number, userId: number) {
    try {
      const checkIfExitsInRoom = await this.prisma.usersRoom.findFirst({
        where: {
          AND: { userId, roomId },
        },
      });
      if (!checkIfExitsInRoom)
        throw new ForbiddenException('permission denied this Rooms');
      const users = await this.prisma.usersRoom.findMany({
        where: {
          roomId: roomId,
        },
        orderBy: { id: 'asc' },
        include: {
          userroom: {
            select: {
              UserName: true,
              avatar: true,
              id: true,
              isOnline: true,
            },
          },
          chat: {
            select: {
              ownerId: true,
            },
          },
        },
      });

      return users;
    } catch (error) {
      if (error instanceof PrismaClientUnknownRequestError)
        if (error.message == 'P2002')
          throw new ForbiddenException('error delete');
      throw error;
    }
  }
  async getblockedUser(roomId: number) {
    try {
      const users = await this.prisma.blockUsers.findMany({
        where: {
          roomId: roomId,
        },
        orderBy: { id: 'asc' },
        include: {
          userroom: {
            select: {
              UserName: true,
              avatar: true,
              id: true,
              isOnline: true,
            },
          },
          chat: {
            select: {
              ownerId: true,
            },
          },
        },
      });

      return users;
    } catch (error) {
      if (error instanceof PrismaClientUnknownRequestError)
        if (error.message == 'P2002')
          throw new ForbiddenException('error delete');
      throw error;
    }
  }
}
