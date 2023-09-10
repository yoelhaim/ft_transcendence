import { Module } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ChatContoller } from './chatroom.controller';
import { UserRoomModule } from './userroom/userroom.module';

@Module({
  imports: [UserRoomModule],
  controllers: [ChatContoller],
  providers: [ChatroomService],
})
export class ChatroomModule {}
