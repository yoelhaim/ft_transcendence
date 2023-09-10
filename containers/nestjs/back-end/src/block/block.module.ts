import { Module } from '@nestjs/common';
import { BlockController } from './block.controller';
import { BlockService } from './block.service';
import { ChatroomService } from 'src/chatroom/chatroom.service';

@Module({
  controllers: [BlockController],
  providers: [BlockService, ChatroomService],
})
export class BlockModule {}
