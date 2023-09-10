import {
    Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChatroomService } from 'src/chatroom/chatroom.service';
import { AuthGuard } from '@nestjs/passport';
import { MessageRoomService } from './message.service';
import { PermissionGuard } from 'src/connect/strategy/protectUserGard';
import { MessageRoomDto } from './message.dto';
import { Request } from 'express';
import { parse } from 'path';

@Controller('chatroom')
@UseGuards(AuthGuard('authGuard'))
export class MessageRoomController {
  constructor(
    private readonly messageRoom: MessageRoomService,
    private readonly room: ChatroomService,
  ) {}
  @Get('gaurdRoom/:roomId/:userId')
  @UseGuards(PermissionGuard)
  async gaurdRooms(
    @Param('roomId', new ParseIntPipe()) roomId: number,
    @Param('userId', new ParseIntPipe()) userId: number,
  ) {
    return this.messageRoom.gardRoom(userId, roomId);
  }
  @Post('addMessage')
   async addMessage(@Body() body: MessageRoomDto,@Req() req: Request) {
     try {
        body.userId = parseInt(req.user['id'])  ;
        return this.messageRoom.addMessage(body);
        
     } catch (error) {
        throw error;
     }
   }

  @Get('conversation/:roomId/:userId/:page?')
  @UseGuards(PermissionGuard)
  async getAllMessages(
    @Param('roomId', new ParseIntPipe()) roomId: number,
    @Param('userId', new ParseIntPipe()) userId: number,
    @Param('page') page?: number,
  ) {
    return this.messageRoom.getAllMessage(roomId, userId, page);
  }
  @Patch('disconnect/:userId')
  @UseGuards(PermissionGuard)
  async DiscounnectUser(@Param('userId') userId: string) {
    return await this.messageRoom.updateStatus(parseInt(userId), 'offline');
  }
}
