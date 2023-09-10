import {
  Controller,
  ForbiddenException,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { LeaderboardService } from './leaderboard.service';
import { AuthGuard } from '@nestjs/passport';
import { PermissionGuard } from 'src/connect/strategy/protectUserGard';

@Controller('leaderboard')
@UseGuards(AuthGuard('authGuard'))
export class LeaderboardController {
  constructor(private service: LeaderboardService) {}
  @Get()
  @UseGuards(PermissionGuard)
  async getLeaderboards(@Req() req: Request) {
    try {
      const obj = {
        league: req.query.league as string,
        relation: req.query.relation as string,
        page: parseInt(req.query.page as string),
      };
      const userId = parseInt(req.cookies.userId);
      if (!this.service.validateQuery(obj.relation, obj.league, obj.page))
        throw new ForbiddenException('Invalid Query');
      return await this.service.getLeaderboards(
        obj.relation,
        obj.league,
        obj.page,
        userId,
      );
    } catch (error) {
      throw error;
    }
  }

  @Get('/getCard')
  @UseGuards(PermissionGuard)
  async getCardForUser(@Req() req: Request) {
    const userId = parseInt(req.user['id']);
    return await this.service.getCardForUser(userId);
  }
  @Get('/user/static')
  async getStaticLeaderboards(@Req() req: Request) {
    const userId = parseInt(req.user['id']);
    return await this.service.getStaticLeaderboards(userId);
  }
}
