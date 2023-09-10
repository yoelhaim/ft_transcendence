import { Module } from '@nestjs/common';
import { BlocklistService } from './blocklist.service';
import { BlocklistController } from './blocklist.controller';
import { ChatroomService } from 'src/chatroom/chatroom.service';

@Module({
  providers: [BlocklistService, ChatroomService],
  controllers: [BlocklistController],
})
export class BlocklistModule {}
