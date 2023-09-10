import { NotFoundException } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';


import { Socket, Server } from 'socket.io';
import { BlockService } from 'src/block/block.service';
import { PrismaService } from 'src/prisma/prisma.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class privateChatservice {
  constructor(
    private prisma: PrismaService,
    private readonly blockService: BlockService,
  ) {}
  @WebSocketServer()
  server: Server;
  clients: Socket;
  async handleDisconnect(client: Socket) {
    client.removeAllListeners();
  }

  @SubscribeMessage('joinPrivate')
  async handleJoin(client: Socket, id: string) {
    client.join(id);
  }
  @SubscribeMessage('leavePrivte')
  async leave(client: Socket, id: string) {
    client.leave(id);
  }

  async addNewMessage(event: any) {
    try {
        event.receiverid = parseInt(event.receiverid);
      let isFirst = false;
      let availabe = await this.prisma.chat.findFirst({
        where: {
          OR: [
            { senderid: event.senderid, receiverid: event.receiverid },
            { senderid: event.receiverid, receiverid: event.senderid },
          ],
        },
        select: {
          id: true,
        },
      });
      const getUser = await this.prisma.user.findUnique({
        where: { id: event.receiverid },
      });
      await this.blockService.getBlockStatus(event.senderid, getUser.UserName);
      if (!availabe) {
        isFirst = true;
        availabe = await this.ifChatNotExist(event.senderid, event.receiverid);
      }
      const createMessage = await this.prisma.messageChat.create({
        data: {
          message: event.message,
          senderid: event.senderid,
          receiverid: event.receiverid,
          chatId: availabe.id,
          mychanellID: availabe.id,
          updatedAt: new Date(),
        },
      });
      await this.prisma.chat.update({
        where: { id: availabe.id },
        data: {
          updatedAt: new Date(),
        },
      });
      this.server
        .to(`user${createMessage.receiverid.toString()}`)
        .emit('onmessage', createMessage);
      this.server
        .to(createMessage.chatId.toString())
        .emit('privatechatMsg', createMessage);
      return { data: createMessage, isFirst: isFirst };
    } catch (error) {
      throw error;
    }
  }

  async listMessage(user1: number, user2: number, page: number) {
    const getUser = await this.prisma.user.findUnique({
      where: { id: user2 },
    });
    await this.blockService.getBlockStatus(user1, getUser.UserName);
    // if (page === undefined ||  page === 0) page = 1;
    const all = await this.prisma.chat.findMany({
      where: {
        OR: [
          { senderid: user1, receiverid: user2 },
          { senderid: user2, receiverid: user1 },
        ],
      },

      select: {
        id: true,
        channel: {
          skip: page * 10,
          take: 10,
          orderBy: { id: 'desc' },
        },
      },
    });
    return all;
  }
  async getLastMessage(chatId: number) {
    const lastMessage = await this.prisma.messageChat.findFirst({
      where: {
        chatId: chatId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      select: {
        message: true,
        senderid: true,
        receiverid: true,
        updatedAt: true,
      },
    });
    return lastMessage;
  }

  async getFriends(userId: number) {
    const conversations = await this.prisma.chat.findMany({
      where: {
        OR: [{ senderid: userId }, { receiverid: userId }],
      },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        chatBlock: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            updatedAt: true,
            isOnline: true,
          },
        },
        secondPlayer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            updatedAt: true,
            isOnline: true,
          },
        },
        channel: {
          orderBy: { updatedAt: 'desc' },
          take: 1,
          select: {
            message: true,
            id: true,
          },
        },
      },
    });
    //    return conversations;
    const usersWithConversations = conversations.map(
      ({ chatBlock, secondPlayer }, index: number) => {
        if (chatBlock.id === userId) {
          return {
            data: secondPlayer,
            message: conversations[index].channel[0],
          };
        } else {
          return { data: chatBlock, message: conversations[index].channel[0] };
        }
      },
    );

    return usersWithConversations;
  }
  async finIdByUsername(username: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        UserName: username,
      },
      select: {
        id: true,
      },
    });
    if (!user) throw new NotFoundException('user not found');
    return user.id;
  }

  async ifChatNotExist(senderid: number, receiverid: number) {
    try {
      return await this.prisma.chat.create({
        data: {
          senderid: senderid,
          receiverid: receiverid,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      throw error;
    }
  }
  async findMyFriend(userId: number, search: string) {
    try {
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
            contains: search,
          },
        },
      });
      return result;
    } catch (error) {}
  }
}
