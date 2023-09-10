import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { GoogleService } from './google.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { PermissionGuard } from '../strategy/protectUserGard';

@Controller('google')
@UseGuards(AuthGuard('authGuard'))
export class GoogleController {
  constructor(private googleSer: GoogleService) {}
  @Get('2fa')
  @UseGuards(PermissionGuard)
  async getGoogle() {
    return await this.googleSer.getGoogle();
  }
  @Get('tokenGen')
  @UseGuards(PermissionGuard)
  async generateToken(@Req() req: Request) {
    return await this.googleSer.generQrcode(req.user['id']);
  }
  @Post('passcode')
  @UseGuards(PermissionGuard)
  async matchedPasscode(
    @Body() obj: any,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const result = await this.googleSer.matchedPasscode(
      obj.secret,
      obj.token,
      parseInt(req.cookies.userId),
    );
    if (result) {
      res.clearCookie('passcode', {
        path: '/',
        expires: new Date(0),
      });
      return res.status(200).send('true');
    }
    return res.status(200).send('false');
  }
  @Get('deleteToken')
  @UseGuards(PermissionGuard)
  async deleteToken(@Req() req: Request) {
    return await this.googleSer.deleteToken(req.user['id']);
  }
}
