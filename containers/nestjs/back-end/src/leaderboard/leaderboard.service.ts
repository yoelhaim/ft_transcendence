import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { error } from 'console';
import { parse } from 'path';

@Injectable()
export class LeaderboardService {
  constructor(private prisma: PrismaService) {}

  getScore(league: string): [number, number] {
    if (league == 'Bronze') return [-10000000, 100];
    else if (league == 'Silver') return [101, 200];
    else return [201, 1000000];
  }
  validateQuery(relation: string, league: string, page: number): boolean {
    if (isNaN(page) || page < 0) return false;
    if (relation != 'Friends' && relation != 'Global') return false;
    if (league != 'Bronze' && league != 'Silver' && league != 'Crystal')
      return false;
    return true;
  }
  getLeague(score: number): string {
    if (score <= 100) return 'Bronze';
    else if (score <= 200) return 'Silver';
    else return 'Crystal';
  }

  async getLeaderboards(
    relation: string,
    league: string,
    page: number,
    userId: number,
  ) {
    try {
      const score: any = {
        gte: this.getScore(league)[0],
      };

      let friendsIds: any;

      if (score.gte < 201) score.lte = this.getScore(league)[1];
      if (relation == 'Friends') {
        const friends = await this.prisma.friend.findMany({
          where: {
            OR: [{ userId }, { friendId: userId }],
            status: 'accepted',
          },
          select: {
            friendId: true,
            userId: true,
          },
        });
        friendsIds = friends.map((friend) =>
          friend.friendId !== userId ? friend.friendId : friend.userId,
        );
      }
      const user = await this.prisma.user.findMany({
        where: {
          OR: {
            score,
            AND: { score, id: { in: friendsIds } },
          },
        },

        select: {
          id: true,
          UserName: true,
          score: true,
          avatar: true,
        },
        skip: page * 10,
        take: 10,
        orderBy: {
          score: 'desc',
        },
      });

      const count = await this.prisma.user.count({
        where: {
          OR: {
            score,
            AND: { score, id: { in: friendsIds } },
          },
        },
      });

      return { user, count: Math.ceil(count / 10) };
    } catch (error) {
      throw error;
    }
  }

  async getCardForUser(id: number) {
    try {
      const games = await this.prisma.game.findMany({
        where: {
          OR: [
            {
              firstPlayerId: id,
            },
            {
              secondPlayerId: id,
            },
          ],
          //   isFinished: true,
        },
        select: {
          firstPlayerId: true,
          secondPlayerId: true,
          firstPlayerScore: true,
          secondPlayerScore: true,
          firstPlayer: true,
          secondPlayer: true,
        },
      });
      let wins = 0;
      let losses = 0;
      games.forEach((game) => {
        if (game.firstPlayerId == id) {
          wins += game.firstPlayerScore > game.secondPlayerScore ? 1 : 0;
          losses += game.firstPlayerScore < game.secondPlayerScore ? 1 : 0;
        } else {
          wins += game.firstPlayerScore < game.secondPlayerScore ? 1 : 0;
          losses += game.firstPlayerScore > game.secondPlayerScore ? 1 : 0;
        }
      });
      return await this.prisma.user
        .findUnique({
          where: {
            id: id,
          },
          select: {
            score: true,
            avatar: true,
            UserName: true,
          },
        })
        .then((user) => {
          return {
            score: user.score,
            avatar: user.avatar,
            UserName: user.UserName,
            wins: wins,
            losses: losses,
          };
        });
    } catch (e) {
      throw error(e);
    }
  }

  async getStaticLeaderboards(userId: number) {
    {
      try {
        const user = await this.prisma.user.findUnique({
          where: {
            id: userId,
          },
          select: {
            score: true,
          },
        });
        const league = this.getLeague(user.score);
        const score: any = {
          gte: this.getScore(league)[0],
        };
        if (score.gte < 201) score.lte = this.getScore(league)[1];
        const total = await this.prisma.user.count({
          where: {
            score: score,
          },
        });
        return { league: league, total: total };
      } catch (error) {
        throw error;
      }
    }
  }
}
