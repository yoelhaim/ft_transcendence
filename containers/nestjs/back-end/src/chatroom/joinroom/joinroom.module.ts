import { Module } from '@nestjs/common';
import { NotificationService } from 'src/notification/services/notification/notification.service';
import { JoinRoomController } from './joinroom.controller';
import { joinRoomService } from './joinroom.service';
import { ChatroomService } from '../chatroom.service';
import { NotificationsGateway } from 'src/notification/gateway/notifications/notifications.gateway';

@Module({
  controllers: [JoinRoomController],
  providers: [
    joinRoomService,
    ChatroomService,
    NotificationService,
    NotificationsGateway,
  ],
})
export class JoinRoomModule {}
