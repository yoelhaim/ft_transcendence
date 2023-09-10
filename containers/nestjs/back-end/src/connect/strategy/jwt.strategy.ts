import { Injectable, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class jwtstrategy extends PassportStrategy(Strategy, 'authGuard') {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([jwtstrategy.getCookie]),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }
  async checkexitsToken(token: string): Promise<boolean> {
    try {
      const checkIxitsToken = await this.prisma.tokenz.findFirst({
        where: { token },
      });
      if (checkIxitsToken) return false;
      return true;
    } catch (error) {
      throw error;
    }
  }
  private static getCookie(@Req() req: Request | any) {
    if (req.cookies) {
      return req.cookies.token;
    } else {
      const inputString = req.handshake.headers.cookie;
      const regex = /token=([^;]*)/;
      if (!regex || !inputString) return null;

      const match = inputString.match(regex);
      const token = match && match[1].trim();
      if (req.handshake.headers) return token;
    }
    return null;
  }

  async validate(payload: any, @Req() req: Request) {
    try {
      const res = await this.prisma.user.findFirst({
        where: { id: payload.id },
      });
      if (res) req.user = res;
      if (res.isOnline === 'offline')
        await this.prisma.user.update({
          where: { id: res.id },
          data: {
            isOnline: 'online',
          },
        });

      return res;
    } catch (error) {
      return error;
    }
  }
}
