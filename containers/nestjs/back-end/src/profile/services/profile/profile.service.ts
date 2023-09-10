import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { BlockService } from 'src/block/block.service';

@Injectable()
export class ProfileService {
  constructor(
    private prisma: PrismaService,
    private readonly blockService: BlockService,
  ) {}

  async fetchUser(login: string, userId: number) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { UserName: login },
      });
      await this.blockService.getBlockStatus(userId, login);

      return user;
    } catch (error) {
      throw error;
    }
  }
  async fetchUserById(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });
      await this.blockService.getBlockStatus(id, user.UserName);

      return user;
    } catch (error) {
      throw error;
    }
  }
}
