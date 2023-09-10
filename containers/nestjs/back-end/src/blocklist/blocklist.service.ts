import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BlocklistService {
  constructor(private readonly prisma: PrismaService) {}
  getAllBlocklist(id: number): any {
    return this.prisma.block
      .findMany({
        where: {
          userId: id,
        },
        select: {
          id: true,
          blockedUser: {
            select: {
              UserName: true,
              id: true,
            },
          },
        },
      })
      .then((data) => {
        if (data) return data;
        return {};
      })
      .catch(() => {
        return {};
      });
  }
}
