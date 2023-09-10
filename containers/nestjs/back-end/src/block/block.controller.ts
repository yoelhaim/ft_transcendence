import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BlockService } from './block.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { PermissionGuard } from 'src/connect/strategy/protectUserGard';

@Controller('block')
@UseGuards(AuthGuard('authGuard'))
export class BlockController {
  constructor(private readonly blockService: BlockService) {}
  @Get(':name')
  @UseGuards(PermissionGuard)
  async getBlockStatus(@Param('name') name: string, @Req() req: Request) {
    try {
      return await this.blockService.getBlockStatus(req.user['id'], name);
    } catch (error) {
      throw new Error(error);
    }
  }

  @Put(':receiverId')
  @UseGuards(PermissionGuard)
  async blockUser(
    @Param('receiverId') receiverId: string,
    @Req() req: Request,
  ) {
    try {
        return await this.blockService.blockUser(req.user['id'], receiverId);
    } catch (error) {
        throw new Error(error);
    }
  }
  @Post('deblock/')
  @UseGuards(PermissionGuard)
  async deblockUser(
    @Body('userId', new ParseIntPipe()) userId: number,
    @Body('deblockedId') deblockedId: number,
    @Req() req: Request,
  ) {
   try {
    userId;
    return await this.blockService.deblockUser(req.user['id'], deblockedId);
   } catch (error) {
    throw new Error(error);
   }
  }
}
