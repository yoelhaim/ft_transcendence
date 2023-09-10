import { Controller, Get, Body, Patch, UseGuards, Req } from '@nestjs/common';
import { readNotificationDto } from '../../dtos/notification.dtos';

import { NotificationService } from '../../services/notification/notification.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('notifications')
@UseGuards(AuthGuard('authGuard'))
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  getNotification(@Req() { user }: Request) {
    return this.notificationService.getNotification(user['id']);
  }

  @Get('count')
  countNotification(@Req() { user }: Request) {
    return this.notificationService.countNotification(user['id']);
  }

  @Patch()
  markAsRead(
    @Body() notification: readNotificationDto,
    @Req() { user }: Request,
  ) {
    const { id } = notification;

    return this.notificationService.markAsRead(id, user['id']);
  }
}
