import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { privateChatservice } from './privateChat.service';
import { AuthGuard } from '@nestjs/passport';
import { ChatroomService } from 'src/chatroom/chatroom.service';
import { PermissionGuard } from 'src/connect/strategy/protectUserGard';
import { privateDirectMessageDto, privateMessageDto } from './privateDto';

@Controller('list')
@UseGuards(AuthGuard('authGuard'))
export class privateChatController {
  constructor(
    private service: privateChatservice,
    private readonly chatRooms: ChatroomService,
  ) {}
  @Get('/mesage/:user1/:user2/:page?')
  @UseGuards(PermissionGuard)
  async getMessage(
    @Param('user1') us1: string,
    @Param('user2') us2: string,
    @Param('page') page: string,
  ) {
    return await this.service.listMessage(
      parseInt(us1),
      parseInt(us2),
      parseInt(page),
    );
  }

  @Post('addMessages')
  @UseGuards(PermissionGuard)
  async addMessage(@Body() body: privateMessageDto) {
    return await this.service.addNewMessage(body);
  }
  @Post('send-direct-message')
  @UseGuards(PermissionGuard)
  async sendDirectMessage(@Body() body: privateDirectMessageDto) {
    try {
      const userId = await this.service.finIdByUsername(body.receiverid);
      body.receiverid = userId.toString();
      return await this.service.addNewMessage(body);
    } catch (error) {
      throw error;
    }
  }

  @Post('search')
  async serachMyFriend(@Body('search') search: string) {
    await this.service.findMyFriend(1, search);
  }
  @Get('/friends/:id')
  async getFriends(@Param('id') id: string) {
    const id1 = parseInt(id);
    return await this.service.getFriends(id1);
  }
}
