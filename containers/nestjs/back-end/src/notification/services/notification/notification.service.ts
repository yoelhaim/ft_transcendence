import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma/prisma.service';

import { CreateNotificationDto } from '../../dtos/notification.dtos';

import { NotificationsGateway } from 'src/notification/gateway/notifications/notifications.gateway';

import { NotFoundException } from '@nestjs/common';

@Injectable()
export class NotificationService {
  constructor(
    private prisma: PrismaService,
    private notificationGateway: NotificationsGateway,
  ) {}

  async createNotiofication(to: number, from: number, type: string) {
    try {
      const notification = await this.prisma.notification.create({
        data: {
          userId: to,
          senderUserId: from,
          type: type,
        },
      });

      return notification;
    } catch (error) {
      throw error;
    }
  }

  async roomNotification(data: CreateNotificationDto) {
    const type = 'roomNotification';

    const notification = await this.createNotiofication(
      data.to,
      data.from,
      type,
    );

    const roomNotification = await this.prisma.roomNotification.create({
      data: {
        notificationId: notification.id,
        message: data.message,
      },
    });

    this.notificationGateway.emitNewNotivication(data.to);
    return roomNotification;
  }

  async createFriendrequestNotification(data: CreateNotificationDto) {
    const type = 'friendRequestNotification';

    const notification = await this.createNotiofication(
      data.to,
      data.from,
      type,
    );

    this.notificationGateway.emitNewNotivication(data.to);

    return notification;
  }

  async getNotification(userId: number) {
    const notification = await this.prisma.notification.findMany({
      where: {
        userId: userId,
      },
      orderBy: [
        {
          read: 'asc',
        },
        {
          createdAt: 'desc',
        },
      ],

      select: {
        id: true,
        read: true,
        createdAt: true,
        type: true,
        sender: {
          select: {
            UserName: true,
            avatar: true,
          },
        },
        roomRotification: true,
      },
    });

    // this.emitNotification();

    return notification;
  }

  async countNotification(userId: number) {
    const count = await this.prisma.notification.count({
      where: {
        read: false,
        userId: userId,
      },
    });
    return count;
  }

  async markAsRead(id: number, userId: number) {
    try {
      const noti = await this.prisma.notification.findFirst({
        where: {
          AND: [{ id: id }, { userId: userId }],
        },
      });

      if (!noti) {
        throw new NotFoundException(`Notification not found`);
      }

      if (noti.type == 'roomNotification') {
        await this.prisma.roomNotification.deleteMany({
          where: {
            notificationId: id,
          },
        });

        const notification = await this.prisma.notification.delete({
          where: {
            id: id,
          },
        });

        return notification;
      }

      if (noti.type == 'friendRequestNotification') {
        const notification = await this.prisma.notification.update({
          where: {
            id: id,
          },
          data: {
            read: true,
          },
        });

        return notification;
      }
    } catch (error) {
      throw error;
    }
  }
}
