import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
// const prisma = new PrismaClient()

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          // url: 'postgresql://bloto:123@postgresql:5432/postgres?schema=public'

          url: config.get('DATABASE_URLC'),
        },
      },
    });
  }
}
