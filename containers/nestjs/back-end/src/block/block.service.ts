import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BlockService {
  constructor(private readonly prisma: PrismaService) {}
  async getBlockStatus(senderId: number, name: string) {
    try {
      const receiverId = await this.prisma.user.findFirst({
        where: { UserName: name },
      });
      if (!receiverId)
        throw new ForbiddenException('error found user');

      const getStatusBlocked = await this.prisma.block.findFirst({
        where: {
          OR: [
            { userId: senderId, blockedUserId: receiverId.id },
            { userId: receiverId.id, blockedUserId: senderId },
          ],
        },
      });
      if (getStatusBlocked) throw new ForbiddenException(`${name} blocked`);
      return getStatusBlocked;
    } catch (error) {
      throw error;
    }
  }
  async deblockUser(userId: number, deblockedId: number) {
    try {
      const check = await this.prisma.block.findFirst({
        where: {
          AND: { blockedUserId: deblockedId, userId },
        },
      });
      if (userId === deblockedId)
        throw new ForbiddenException('permission denied ');
      if (!check)
        throw new NotFoundException('user does`t found to black list');
      await this.prisma.block.delete({
        where: { id: check.id },
      });
      return check;
    } catch (error) {
      throw error;
    }
  }

  async blockUser(senderId: number, name: string): Promise<any> {
    const receiverId = await this.prisma.user.findFirst({
      where: { UserName: name },
    });
    if (senderId === receiverId.id)
      throw new ForbiddenException('permission denied ');
    await this.getBlockStatus(senderId, name);
    let findUser = await this.prisma.user.findFirst({
      where: {
        id: receiverId.id,
      },
    });
    if (!findUser) return 'User not found.';
    findUser = await this.prisma.user.findFirst({
      where: {
        id: senderId,
      },
    });
    this.updateStatus(senderId, receiverId.id);
    return await this.prisma.block
      .create({
        data: {
          userId: senderId,
          blockedUserId: receiverId.id,
        },
      })
      .then(() => {
        return 'blocked';
      })
      .catch((error) => {
        console.error('Error blocking', error.message);
        return 'Error blocking';
      });
  }

  updateStatus = async (senderId: number, receiverId: number) => {
    const remove = await this.prisma.friend.deleteMany({
      where: {
        OR: [
          { userId: senderId, friendId: receiverId },
          { userId: receiverId, friendId: senderId },
        ],
      },
    });
    return remove;
  };
}
