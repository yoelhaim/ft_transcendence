import { Module } from '@nestjs/common';
import { UserRoomController } from './userroom.controller';
import { UserRoomService } from './userroom.service';
import { joinRoomService } from '../joinroom/joinroom.service';
import { ChatroomService } from '../chatroom.service';
import { NotificationService } from 'src/notification/services/notification/notification.service';
import { NotificationsGateway } from 'src/notification/gateway/notifications/notifications.gateway';

@Module({
  controllers: [UserRoomController],
  providers: [
    UserRoomService,
    joinRoomService,
    NotificationService,
    NotificationsGateway,
    ChatroomService,
  ],
})
export class UserRoomModule {}
