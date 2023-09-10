import { Module } from '@nestjs/common';

import { privateChatController } from './privateChat.controller';
import { privateChatservice } from './privateChat.service';
import { BlockService } from 'src/block/block.service';
import { ChatroomService } from 'src/chatroom/chatroom.service';

@Module({
  imports: [],
  controllers: [privateChatController],
  providers: [privateChatservice, BlockService, ChatroomService],
})
export class privateChatModule {}
