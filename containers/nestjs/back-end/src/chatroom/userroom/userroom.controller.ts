import {
  Body,
  Controller,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserRoomService } from './userroom.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { PermissionGuard } from 'src/connect/strategy/protectUserGard';

@Controller('userroom')
@UseGuards(AuthGuard('authGuard'))
export class UserRoomController {
  constructor(private readonly roomuser: UserRoomService) {}
  @Post()
  @UseGuards(PermissionGuard)
  async searchUsersRoom(
    @Body('name') name: string,
    @Body('roomId') roomId: number,
  ) {
    return this.roomuser.searchUsersRoom(name, roomId);
  }
  @Post('search')
  @UseGuards(PermissionGuard)
  async searchUsers(
    @Body('name') name: string,
    @Body('roomId', new ParseIntPipe()) roomId: number,
    @Body('userId', new ParseIntPipe()) userId: number,
  ) {
    return this.roomuser.searchUsers(name, roomId, userId);
  }
  @Post('invite')
  @UseGuards(PermissionGuard)
  async inviteUsersRoom(
    @Body('userId', new ParseIntPipe()) userId: number,
    @Body('roomId', new ParseIntPipe()) roomId: number,
    @Body('ownerId', new ParseIntPipe()) ownerId: number,
    @Req() req: Request,
  ) {
    const admin = parseInt(req.user['id']);
    return this.roomuser.inviteUsersRoom(userId, roomId, admin);
  }
}
