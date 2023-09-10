import {
  Body,
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { joinRoomService } from './joinroom.service';
import { BlockUserDto } from './joinRoom.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ChatroomService } from '../chatroom.service';
import { PermissionGuard } from 'src/connect/strategy/protectUserGard';
import { use } from 'passport';

@Controller('join')
@UseGuards(AuthGuard('authGuard'))
export class JoinRoomController {
  constructor(
    private readonly joinRooms: joinRoomService,
    private readonly room: ChatroomService,
  ) {}

  @Post('joined')
  @UseGuards(PermissionGuard)
  async joinRoom(
    @Body('roomId', new ParseIntPipe()) id: number,
    @Body('userId', new ParseIntPipe()) userId: number,
    @Body('password') password?: string,
    @Req() req?: Request,
  ) {
    return await this.joinRooms.joinRoom(id, req.user['id'], password);
  }
  @Post('block')
  @UseGuards(PermissionGuard)
  async blockUser(@Body() body: BlockUserDto) {
   try {
    return await this.joinRooms.blockUser(body);
   } catch (error) {
     throw error;
   }
  }
  @Post('unblock')
  @UseGuards(PermissionGuard)
  async unblockUser(
    @Body('userId', new ParseIntPipe()) userId: number,
    @Body('roomId', new ParseIntPipe()) roomId: number,
    @Body('adminId', new ParseIntPipe()) adminId: number,
    @Req() {user}: Request,
  ) {
    adminId = user['id'];
    return this.joinRooms.unblockUser(userId, roomId, adminId);
  }
  @Post('makeadmin')
  @UseGuards(PermissionGuard)
  async makeAdmin(
    @Body('userId', new ParseIntPipe()) userId: number,
    @Body('roomId', new ParseIntPipe()) roomId: number,
    @Body('ownerId', new ParseIntPipe()) ownerId: number,
    @Body('isAdmin', new ParseBoolPipe()) isAdmin: boolean,
    @Req() {user}: Request,
  ) {
    try {
        ownerId =  parseInt(user['id']);
        return this.joinRooms.makeAdmin(userId, roomId, ownerId, isAdmin);
    } catch (error) {
         throw error;
    }
  }
  @Post('leave')
  @UseGuards(PermissionGuard)
  async leaveRoom(
    @Body('userId', new ParseIntPipe()) userId: number,
    @Body('roomId', new ParseIntPipe()) roomId: number,
    @Req() req: Request,
  ) {
   try {
    userId;
    return this.joinRooms.leaveRoom(req.user['id'], roomId);
   } catch (error) {
     throw error;
   }
  }

  @Post('checkmute')
  @UseGuards(PermissionGuard)
  async checkMute(
    @Body('userId', new ParseIntPipe()) userId: number,
    @Body('roomId', new ParseIntPipe()) roomId: number,
    @Req() {user}: Request,
  ) {
    userId = user['id'];
    return this.joinRooms.chekMuted(userId, roomId);
  }
  @Get('info/room/:id')
  @UseGuards(PermissionGuard)
  async getInfoRoom(@Param('id', new ParseIntPipe()) id: any) {
    try {

        return this.joinRooms.getInfoRoom(id);
    } catch (error) {
         throw error;
    }
  }
}
