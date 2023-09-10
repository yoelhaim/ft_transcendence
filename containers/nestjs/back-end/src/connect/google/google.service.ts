import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';

@Injectable()
export class GoogleService {
  constructor(private prisma: PrismaService) {}
  async getGoogle() {
    return 'google';
  }

  async generQrcode(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        UserName: true,
        token: true,
        twofactor: true,
      },
    });

    if (user.token === 'empty') {
      const secretkey = speakeasy.generateSecret({ length: 20 }).base32;
      const link = await this.generateQrCodeUrl(user.UserName, secretkey);
      await this.prisma.user.update({
        where: {
          UserName: user.UserName,
        },
        data: {
          token: secretkey,
          twofactor: true,
        },
      });
      return { link };
    }
    const link = await this.generateQrCodeUrl(user.UserName, user.token);
    return { link };
  }
  async generateQrCodeUrl(accountName: string, secret: string) {
    const link = speakeasy.otpauthURL({
      secret: secret,
      encoding: 'base32',
      label: accountName,
      issuer: 'pongster',
    });

    try {
      const qrCodeUrl = await qrcode.toDataURL(link);
      return qrCodeUrl;
    } catch (err) {
      return '';
    }
  }

  async matchedPasscode(secret: string, token: string, id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          token: true,
        },
      });
      secret;
      const verified = speakeasy.totp.verify({
        secret: user.token,
        encoding: 'base32',
        token: token,
      });

      if (verified) {
        await this.prisma.user.update({
          where: {
            id,
          },
          data: {
            isOnTwoFactor: false,
          },
        });
      }
      return verified;
    } catch (error) {
      throw error;
    }
  }
  async deleteToken(id: number) {
    const user = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        token: 'empty',
        twofactor: false,
      },
      select: {
        UserName: true,
        twofactor: true,
        firstName: true,
        lastName: true,
        id: true,
      },
    });
    return user;
  }
}
