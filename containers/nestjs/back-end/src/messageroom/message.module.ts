import { Module } from '@nestjs/common';
import { MessageRoomController } from './message.controller';
import { MessageRoomService } from './message.service';
import { joinRoomService } from 'src/chatroom/joinroom/joinroom.service';
import { ChatroomService } from 'src/chatroom/chatroom.service';
import { NotificationService } from 'src/notification/services/notification/notification.service';
import { NotificationsGateway } from 'src/notification/gateway/notifications/notifications.gateway';

@Module({
  controllers: [MessageRoomController],
  providers: [
    MessageRoomService,
    NotificationService,
    NotificationsGateway,
    joinRoomService,
    ChatroomService,
  ],
})
export class MessageRoomModule {}
