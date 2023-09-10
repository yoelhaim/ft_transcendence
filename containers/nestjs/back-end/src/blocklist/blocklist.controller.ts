import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { BlocklistService } from './blocklist.service';
import { AuthGuard } from '@nestjs/passport';
import { ChatroomService } from 'src/chatroom/chatroom.service';
import { PermissionGuard } from 'src/connect/strategy/protectUserGard';

@Controller('blocklist')
@UseGuards(AuthGuard('authGuard'))
export class BlocklistController {
  constructor(
    private readonly blocklistService: BlocklistService,
    private readonly chatRooms: ChatroomService,
  ) {}
  @UseGuards(PermissionGuard)
  @Get(':id')
  async getAllBlocklist(@Param('id') id: string) {
    return this.blocklistService
      .getAllBlocklist(+id)
      .then((data) => {
        return data;
      })
      .catch(() => {
        return {};
      });
  }
}
