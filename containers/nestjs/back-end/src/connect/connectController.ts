import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Injectable,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { connectService } from './connectService';
import e, { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { PermissionGuard } from './strategy/protectUserGard';

@Controller('42')
@Injectable()
export class connectController {
  constructor(
    private readonly connect: connectService,
    private configs: ConfigService,
  ) {}

  async signup(@Body() obj: any, res) {
   try {
    const status = await this.connect.UserExistance(obj);
    if (!status) {
      const data = await this.connect.CreatUser(obj);
      res.cookie('tmpAvatar', data);
    }
    const j = await this.connect.finUserById(obj);
    await this.connect.logstatus((await j).id, 'onligne', res);
    const token = await this.connect.generateToken({ id: j.id });
    return { token: token, id: j.id, user: j };
   } catch (error) {

    res.end('error authentification');
    throw error;
   }
  }

  @Get('oauth')
  @UseGuards(AuthGuard('42'))
  async fortyTwoOAuth(
    @Req() req: Request,
    @Res() res: Response,
  ) {
  try {
    const obj = req.user;
    const data = await this.signup(obj, res);
    await this.connect.findusertwofactor(obj);

    this.connect.genereteToken('token', data.token, res);
    this.connect.genereteToken('userId', data.id, res);

    //check two Factor
    if (data.user.twofactor && data.user.isOnTwoFactor)
      this.connect.genereteToken('passcode', 'true', res);
    if (data.user.firstTime)
      this.connect.genereteToken('firstTime', 'true', res);

    res.redirect(this.configs.get('REDIRECT_URL'));
    
  } catch (error) {
     throw error;
  }
  }

  @Get('logout/goodbye')
  @UseGuards(AuthGuard('authGuard'))
  async logout(@Req() req: Request, @Res() res: Response) {
    await this.connect.logstatus(req.user['id'], 'offline', res);
    await this.connect.insertToken(req.cookies.token);
    this.connect.destroyToken('userId', res);
    this.connect.destroyToken('token', res);
    return res.status(200).send('logout successfully');
  }
}
