import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from '@prisma/client/runtime/binary';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageRoomDto, } from './message.dto';
import { joinRoomService } from 'src/chatroom/joinroom/joinroom.service';
import {
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomMakeUser, RoomSocketDto } from 'src/chatroom/chatroom.dto';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class MessageRoomService implements OnGatewayDisconnect {
  constructor(
    private readonly prisma: PrismaService,
    private readonly joinRooms: joinRoomService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleDisconnect(client: Socket) {
    client.removeAllListeners();
    const inputString = client.handshake.headers.cookie;
    const regex = /userId=([^;]*)/;
    if (!regex || !inputString) return;

    const match = inputString?.match(regex);
    const userID = match && match[1].trim();
    if (!userID) return;
    client.leave(`user${userID}`);
    await this.updateStatus(parseInt(userID), 'offline');
  }

  async handleConnection(client: Socket) {
     Socket.setMaxListeners(Infinity);
    }

  @SubscribeMessage('typing')
  @UseGuards(AuthGuard('authGuard'))
  async isTyping(client: Socket, payload: any) {
    if (
      (await this.joinRooms.chekMuted(
        parseInt(payload.userId),
        parseInt(payload.roomId),
      )) !== 0
    )
      return;
     
    this.server.to(payload?.nameroom).emit('totyping', client.id, payload);
  }

  @SubscribeMessage('join')
  @UseGuards(AuthGuard('authGuard'))
  async handleEvent(client: Socket, payload: any) {
    
    client.join(payload.nameroom);
  }
  @SubscribeMessage('leaveRoom')
  @UseGuards(AuthGuard('authGuard'))
  async leaveRoom(client: Socket, name: string) {
   
    client.leave(name);
  }

  @SubscribeMessage('joinGlobal')
  @UseGuards(AuthGuard('authGuard'))
  async joinGlobal(client: Socket, user: number) {
    try {
        
      client.join(`user${user.toString()}`);
      await this.updateStatus(user, 'online');
    } catch (error) {
      throw error;
    }
  }


  @SubscribeMessage('setUser')
  @UseGuards(AuthGuard('authGuard'))
  async JoinUser(client: Socket, payload: RoomSocketDto) {
    client;
   
    this.server.to(payload?.chat?.name).emit('notify', payload);
  }
  @SubscribeMessage('setRoom')
  @UseGuards(AuthGuard('authGuard'))
  async setRoom(client: Socket, payload: RoomSocketDto) {
    client;
   
    this.server
      .to(`user${payload?.userId.toString()}`)
      .emit(
        'getRoom',
        await this.getLastRoomAdd(payload?.userId, payload?.roomId),
      );
  }

  @SubscribeMessage('makeAdmin')
  @UseGuards(AuthGuard('authGuard'))
  async makeAdmin(client: Socket, payload: RoomMakeUser) {
    client;
    
    this.server.to(payload?.name).emit('addedAdmin', payload);
  }
  @SubscribeMessage('removeUser')
  @UseGuards(AuthGuard('authGuard'))
  async removeUser(client: Socket, payload: any) {
   
    this.server.to(payload.chat.name).emit('removedUser', payload);
    this.server
      .to(`user${payload?.userId.toString()}`)
      .emit('removeRoom', payload);
  }
  @SubscribeMessage('muteUser')
  @UseGuards(AuthGuard('authGuard'))
  async isMute(client: Socket, payload: RoomSocketDto) {
   
    this.server.to(payload?.chat.name).emit('isMuted', payload);
  }

  private async getLastRoomAdd(userId: number, roomId: number) {
    try {
      const getRooms = await this.prisma.usersRoom.findFirst({
        where: {
          AND: {
            userId: userId,
            roomId: roomId,
          },
        },
        orderBy: { id: 'desc' },
        take: 5,
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
              avatar: true,
            },
          },
        },
      });
      if (!getRooms) throw new ForbiddenException('not found room');
      return getRooms;
    } catch (error) {
      if (error instanceof PrismaClientUnknownRequestError) {
        if (error.message === 'P2002')
          throw new ForbiddenException('Error message');
      }
      throw error;
    }
  }
  async gardRoom(userId: number, roomId: number) {
    try {
      if (await this.joinRooms.chekMuted(userId, roomId))
        throw new NotFoundException('you are muted');
      return this.gardMessage(userId, roomId);
    } catch (error) {
      throw error;
    }
  }
  async gardMessage(userId: number, roomId: number) {
    try {
      const findRoom = await this.prisma.roomChat.findUnique({
        where: { id: roomId },
      });

      const checkListUser = await this.joinRooms.checkListUser(userId, roomId);

      if (checkListUser && checkListUser.locked)
        throw new ForbiddenException('required password');

      if (!checkListUser)
        throw new ForbiddenException(
          `you are not member a this room`,
        );

      const checkListBlock = await this.joinRooms.checkListBlock(
        userId,
        roomId,
      );
      if (checkListBlock)
        throw new ForbiddenException('you are blocked in this room');
    } catch (error) {
      throw error;
    }
  }

  async getMessages(body) {
    try {
      const getMessage = await this.prisma.messageRoom.findFirst({
        where: {
          AND: {
            roomId: body.roomId,
            userId: body.userId,
            id: body.id,
          },
        },
        include: {
          usermsg: {
            select: {
                UserName: true,
                avatar: true,
                firstName: true,
                lastName: true,
                isOnline: true,
                id: true,
            },
          },
          messageref: {
            select: {
              name: true,
              updatedAt: true,
              id: true,
            },
          },
        },
      });
      return getMessage;
    } catch (error) {}
  }

  async addMessage(body: MessageRoomDto): Promise<MessageRoomDto> {
    try {
      const checkValidRoom = await this.prisma.roomChat.findFirst({
        where: {
          id: body.roomId,
        },
      });
      if (!checkValidRoom) throw new ForbiddenException('cant find room!');
      await this.gardMessage(body.userId, body.roomId);

      if ((await this.joinRooms.chekMuted(body.userId, body.roomId)) !== 0)
        throw new ForbiddenException('you are now muted!');
      const inseertMessage = await this.prisma.messageRoom.create({
        data: {
          roomId: body.roomId,
          userId: body.userId,
          message: body.message,
          updatedAt: new Date(),
        },
      });
      if (!inseertMessage)
        throw new ForbiddenException('error get messages');

        const getMsg = await this.getMessages(inseertMessage);
        this.server.to(checkValidRoom.name).emit('messages', 0 ,getMsg);

      return getMsg;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.message === 'P2002')
          throw new ForbiddenException('error add');
      }
      throw error;
    }
  }

  async getAllMessage(roomId: number, userId: number, page: number) {
    try {
      if (!page) page = 0;
      await this.gardMessage(userId, roomId);
      const roomMessages = this.prisma.roomChat.findUnique({
        where: { id: roomId },
        select: {
          name: true,
          avatar: true,
          id: true,
          ownerId: true,
          createAt: true,
          MessageRooms: {
            select: {
              message: true,
              userId: true,
              createAt: true,
              usermsg: {
                select: {
                  UserName: true,
                  avatar: true,
                },
              },
            },
            orderBy: { createAt: 'desc' },
            skip: page === -1 ? (page = 0) : page * 20,
            take: 20,
          },
        },
      });
      return roomMessages;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.message === 'P2002')
          throw new ForbiddenException('error response data');
      }
      throw error;
      
    }
  }
  async updateStatus(id: number, isOnline: string) {
    try {
      if (!id) return;
      const finduser = await this.prisma.user.findUnique({
        where: { id },
      });
      if (!finduser) return 'user doasn`t found ';
      if (finduser.isOnline === 'in game') return;
      const update = await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          isOnline: isOnline,
        },
      });
      if (!update) throw new ForbiddenException('forbiden access to  data ');
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        if (error.message == 'P2002')
          throw new ForbiddenException('forbiden access data');
      throw error;
    }
  }
}
