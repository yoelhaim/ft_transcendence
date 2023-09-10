import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';

import { ProfileService } from '../../services/profile/profile.service';
import { ChatroomService } from 'src/chatroom/chatroom.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { PermissionGuard } from 'src/connect/strategy/protectUserGard';

@Controller('profile')
@UseGuards(AuthGuard('authGuard'))
// @UseGuards(PermissionGuard)
export class ProfileController {
  constructor(
    private profileService: ProfileService,
    private readonly chatRooms: ChatroomService,
  ) {}
  @Get('')
  @UseGuards(PermissionGuard)
  async getUserByid(@Req() req: Request) {
    const userIdHeader = parseInt(req.cookies.userId as string);
    return this.profileService.fetchUserById(userIdHeader);
  }
  @Get(':login')
  @UseGuards(PermissionGuard)
  async getUser(@Param('login') login: string, @Req() req: Request) {
    const userIdHeader = parseInt(req.cookies.userId as string);
    return this.profileService.fetchUser(login, userIdHeader);
  }
  @Get('/id/:id')
  @UseGuards(PermissionGuard)
  fetchUserById(@Param('id') id: number) {
    return this.profileService.fetchUserById(Number(id));
  }
}
