import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(query: string, userId: number) {
    // get all users that block me or i block them

    const blockedUsers = await this.prisma.block.findMany({
      where: {
        OR: [{ userId: userId }, { blockedUserId: userId }],
      },
    });

    const blockedUsersIds = blockedUsers.map((user) =>
      userId === user.userId ? user.blockedUserId : user.userId,
    );
    blockedUsersIds.push(userId);
    const users = await this.prisma.user.findMany({
      where: {
        NOT: {
          AND: { id: { in: blockedUsersIds } },
        },
        UserName: {
          contains: query,
        },
      },
      select: {
        id: true,
        UserName: true,
        avatar: true,
      },
    });

    return users;
  }
}
