import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { PrismaClientInitializationError } from '@prisma/client/runtime/binary';
@Injectable({})
export class connectService {
  constructor(
    private prismas: PrismaService,
    private token: JwtService,
    private config: ConfigService,
  ) {}
  async CreatUser(obj: any) {
    const user = await this.prismas.user.create({
      data: {
        email: obj.email,
        firstName: obj.firstName,
        lastName: obj.lastName,
        avatar: '/images/profile.svg',
        UserName: obj.username,
        bio: obj.bio,
        cover: '/images/coverProfile.png',
        updatedAt: new Date(),
      },
      select: {
        UserName: true,
        firstName: true,
        lastName: true,
        id: true,
        avatar: true,
      },
    });
    this.generateToken({ id: user.id });

    return obj.avatar;
  }
  async UserExistance(obj: any) {
   try {
    const existance = await this.prismas.user.findUnique({
        where: {
          email: obj.email,
        },
      });
       
      return existance;
   } catch (error) {
     throw new ForbiddenException('error signup');
   }
  }
  async generateToken(obj: any) {
    const jw = await this.token.signAsync(obj, {
      expiresIn: '10d',
      secret: this.config.get('JWT_SECRET'),
    });
    return jw;
  }
  async updateFirstTime(body: any) {
    try {
      if (body.UserName.trim() === '')
        throw new NotFoundException('Error: UserName is Empty');
      const checkUser = await this.prismas.user.findUnique({
        where: { id: body.userId },
      });
      if (!checkUser.firstName)
        throw new ForbiddenException('already user updated info');
      const update = await this.prismas.user.update({
        where: { id: body.userId },
        data: {
          isOnTwoFactor: false,
          UserName: body.UserName,
        },
      });
      if (update && checkUser) return checkUser;
    } catch (error) {
      throw error;
    }
  }

  async finUserById(obj: any) {
    const user = await this.prismas.user.findUnique({
      where: {
        email: obj.email,
      },
      select: {
        id: true,
        isOnTwoFactor: true,
        twofactor: true,
        firstTime: true,
        lastName: true,
        firstName: true,
        avatar: true,
        UserName: true,
      },
    });
    return user;
  }
  async findusertwofactor(obj: any) {
    const user = await this.prismas.user.findUnique({
      where: {
        UserName: obj.username,
      },
      select: {
        id: true,
        twofactor: true,
      },
    });
    return user;
  }

  async logstatus(id: number, status: string, res: Response) {
    try {
       if (!id || id == undefined) throw new ForbiddenException('error logout or find user');
      const getIsOnTwoFactor = await this.prismas.user.findFirst({
        where: {
          id: id,
        },
        select: {
          isOnTwoFactor: true,
          twofactor: true,
        },
      });
      

    if (!getIsOnTwoFactor) throw new ForbiddenException('error logout or find user');
      await this.prismas.user.update({
        where: { id },
        data: {
          isOnline: status,
          isOnTwoFactor: getIsOnTwoFactor.twofactor ? true : false,
        },
      });
    } catch (error) {
        res.clearCookie('token');
        res.clearCookie('userId');
        res.clearCookie('passcode');
        res.clearCookie('firstTime');
        res.clearCookie('tmpAvatar');
     if (error instanceof PrismaClientInitializationError)
        throw new ForbiddenException('error logout ');
        {
            if (error instanceof PrismaClientInitializationError)
              throw new ForbiddenException('error logout ');
            if(error.message === 'P2002')
            throw new ForbiddenException('error logout ');
        }
      throw error;
    }
  }
  genereteToken(name: string, value: string | number, @Res() res: Response) {
    res.cookie(name, value, {
      httpOnly: true,
    });
  }
  destroyToken(name: string, @Res() res: Response) {
    res.clearCookie(name);
  }

  async insertToken(token: string) {
    try {
      const addToken = await this.prismas.tokenz.create({
        data: {
          token,
          updatedAt: new Date(),
        },
      });
      if (!addToken) throw new ForbiddenException('error logout ');
    } catch (error) {
      throw error;
    }
  }
}
