import {
  Body,
  Controller,
  ForbiddenException,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/binary';
import { Request, Response } from 'express';

import { PrismaService } from 'src/prisma/prisma.service';
import { connectService } from './connectService';
import { PermissionGuard } from './strategy/protectUserGard';

@Controller('user')
@UseGuards(AuthGuard('authGuard'))
export class userController {
  constructor(
    private prismas: PrismaService,
    private readonly user: connectService,
  ) {}

  @Post('update')
  @UseGuards(AuthGuard('authGuard'))
  @UseGuards(PermissionGuard)
  async UpdateInfoFirs(@Body() body: any) {
    await this.user.updateFirstTime(body);
  }
  @Post()
  @UseGuards(PermissionGuard)
  async getAll(@Req() req: Request, @Res() res: Response) {
    try {
      if (!req.cookies.userId || !req.cookies.token)
        throw new ForbiddenException('id not Found');

      const checkToken = await this.prismas.tokenz.findFirst({
        where: { token: req.cookies.token },
      });
      if (checkToken) {
        this.user.destroyToken('token', res);
        this.user.destroyToken('userId', res);
        throw new UnauthorizedException('token expired');
      }

      const user = await this.prismas.user.findUnique({
        where: {
          id: parseInt(req.cookies.userId),
        },
        select: {
          UserName: true,
          twofactor: true,
          firstName: true,
          lastName: true,
          id: true,
          isOnline: true,
          email: true,
          updatedAt: true,
          createAt: true,
          bio: true,
          avatar: true,
          cover: true,
          score: true,
        },
      });
      return res.send(user);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        if (error.message === 'P2002') throw new UnauthorizedException('error');
      throw error;
    }
  }
}
