import { ForbiddenException, Injectable } from '@nestjs/common';
import { BlockService } from 'src/block/block.service';
import { NotificationService } from 'src/notification/services/notification/notification.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfileServiceYouss {
  constructor(
    private readonly prisma: PrismaService,
    private readonly blockService: BlockService,
    private readonly notif: NotificationService,
  ) {}
  async getFriendStatus(senderId: number, name: string): Promise<any> {
    const receiverId = await this.prisma.user.findFirst({
      where: { UserName: name },
    });
    let findUser = await this.prisma.user.findFirst({
      where: {
        id: receiverId.id,
      },
    });
    if (!findUser) return 'User not found.';
    findUser = await this.prisma.user.findFirst({
      where: {
        id: senderId,
      },
    });
    if (!findUser) return 'User not found.';
    return await this.prisma.friend
      .findFirst({
        where: {
          OR: [
            { userId: senderId, friendId: receiverId.id },
            { userId: receiverId.id, friendId: senderId },
          ],
        },
      })
      .then((data) => {
        if (data.userId === senderId && data.status == 'pending')
          return 'pendingacc';
        if (data) return data.status;
        return 'not friends';
      })
      .catch((err) => {
        err;
        return 'not friends';
      });
  }

  async addFriend(senderId: number, name: string): Promise<any> {
    const receiverId = await this.prisma.user.findFirst({
      where: { UserName: name },
    });

    let findUser = await this.prisma.user.findFirst({
      where: {
        id: receiverId.id,
      },
    });
    if (!findUser) return 'User not found.';

    findUser = await this.prisma.user.findFirst({
      where: {
        id: senderId,
      },
    });
    if (!findUser) return 'User not found.';
    const findFriend = await this.prisma.block.findFirst({
      where: {
        OR: [
          { userId: senderId, blockedUserId: receiverId.id },
          { blockedUserId: senderId, userId: receiverId.id },
        ],
      },
    });
    if (findFriend) throw new ForbiddenException('Friend request not added.');
    const existingEntry = await this.prisma.friend.findFirst({
      where: {
        OR: [
          { userId: senderId, friendId: receiverId.id },
          { userId: receiverId.id, friendId: senderId },
        ],
      },
    });
    if (existingEntry)
      return this.updateStatus(existingEntry, senderId, receiverId.UserName);
    return await this.prisma.friend
      .create({
        data: {
          userId: senderId,
          friendId: receiverId.id,
        },
      })
      .then(async () => {
        await this.notif.createFriendrequestNotification({
          from: senderId,
          to: receiverId.id,
        });
        return 'Friend request added.';
      })
      .catch((error) => {
        console.error('Error adding friend request:', error.message);
        return 'Friend request not added.';
      });
  }
  updateStatus = async (existingEntry: any, senderId: number, name: string) => {
    const receiverId = await this.prisma.user.findFirst({
      where: { UserName: name },
    });
    if (
      existingEntry.status == 'accepted' ||
      (existingEntry.status == 'pending' && existingEntry.userId == senderId)
    ) {
      await this.prisma.friend.delete({
        where: {
          id: existingEntry.id,
        },
      });

   
      await this.removeNotification(senderId, receiverId.id);
      return 'FREIND REQUEST DELETED';
    } else if (
      existingEntry.status == 'pending' &&
      existingEntry.userId == receiverId.id
    )
      existingEntry.status = 'accepted';
    await this.prisma.friend.update({
      where: {
        id: existingEntry.id,
      },
      data: {
        status: existingEntry.status,
      },
    });
    return 'FREIND REQUEST ACCEPTED';
  };

  async updateProfilePicture(
    avatar: string,
    type: string,
    id: number,
  ): Promise<string> {
    try {
      let update;
      if (type === 'profile') {
        update = await this.prisma.user.update({
          where: { id },
          data: {
            avatar,
          },
        });
      } else {
        update = await this.prisma.user.update({
          where: { id },
          data: {
            cover: avatar,
          },
        });
      }
      if (!update) throw new ForbiddenException('avatar not updated try again');
      return avatar;
    } catch (error) {
      throw error;
    }
  }



  async acceptFriend(userName: string, receiverId: number) {
    try {
      const senderId = await this.prisma.user.findFirst({
        where: { UserName: userName },
        select: {
          UserName: true,
          id: true,
        },
      });

      const user = await this.prisma.user.findFirst({
        where: { id: receiverId },
        select: {
          UserName: true,
          id: true,
        },
      });

      const findFriend = await this.prisma.friend.findFirst({
        where: {
          OR: [
            { userId: senderId.id, friendId: receiverId },
            { userId: receiverId, friendId: senderId.id },
          ],
        },
      });

      if (findFriend && findFriend.status === 'pending') {
        await this.prisma.friend.update({
          where: {
            id: findFriend.id,
          },
          data: {
            status: 'accepted',
          },
        });

        await this.notif.roomNotification({
          to: senderId.id,
          from: receiverId,
          message: `${user.UserName} accepted your friend request`,
        });
        await this.removeNotification(senderId.id, receiverId);
        return 'friend request accepted';
      }
      return 'accepted';
    } catch (error) {
      throw error;
    }
  }

  async rejectFriend(userName: string, receiverId: number) {
    try {
      const senderId = await this.prisma.user.findFirst({
        where: { UserName: userName },
        select: {
          UserName: true,
          id: true,
        },
      });

      const findFriend = await this.prisma.friend.findFirst({
        where: {
          OR: [
            { userId: senderId.id, friendId: receiverId },
            { userId: receiverId, friendId: senderId.id },
          ],
        },
      });

      if (findFriend && findFriend.status === 'pending') {
        await this.prisma.friend.delete({
          where: {
            id: findFriend.id,
          },
        });

        await this.removeNotification(senderId.id, receiverId);
        return 'friend request rejected';
      }
      return 'rejected';
    } catch (error) {
      throw error;
    }
  }

  //   ?? REMOVE NOTIFICATION

  async removeNotification(senderId: number, receiverId: number) {
    try {
      const findNotif = await this.prisma.notification.findFirst({
        where: {
          OR: [
            { userId: senderId, senderUserId: receiverId },
            { senderUserId: senderId, userId: receiverId },
          ],
          type: 'friendRequestNotification',
        },
      });
      if (findNotif)
        await this.prisma.notification.delete({
          where: {
            id: findNotif.id,
          },
        });
    } catch (error) {
      throw error;
    }
  }
}
