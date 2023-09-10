import { Injectable } from '@nestjs/common';
import {
  CreateGameDto,
  UpdateGameDto,
} from '../../../game/dtos/CreateGame.dtos';
import { PrismaService } from '../../../prisma/prisma.service';

// import Matter from 'matter-js';
// const Matter = require('matter-js')

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  getUser(login: string) {
    return this.prisma.user.findFirst({
      where: { UserName: login },
    });
  }

  async fetchUserById(id: number) {
    const user = await this.prisma.user.findFirst({
      where: { id: id },
    });

    return user;
  }

  async fetchUserGamesLimited(
    login: string,
    limit: number,
    offset: number = 0,
  ) {
    const { id } = await this.getUser(login);

    const games = await this.prisma.game.findMany({
      where: {
        OR: [
          {
            firstPlayer: {
              id,
            },
          },
          {
            secondPlayer: {
              id,
            },
          },
        ],
      },
      orderBy: { id: 'desc' },
      select: {
        id: true,
        firstPlayerScore: true,
        secondPlayerScore: true,
        createdAt: true,
        firstPlayer: {
          select: {
            UserName: true,
            id: true,
          },
        },
        secondPlayer: {
          select: {
            UserName: true,
            id: true,
          },
        },
      },
      skip: offset * limit,
      take: limit,
    });

    return games;
  }

  async fetchUserGames(login: string) {
    return this.fetchUserGamesLimited(login, 5);
  }

  async updateGame(updateGameDto: UpdateGameDto) {
    const game = await this.prisma.game.update({
      where: { id: updateGameDto.id },
      data: {
        firstPlayerScore: {
          increment: updateGameDto.firstPlayerScore,
        },
        secondPlayerScore: {
          increment: updateGameDto.secondPlayerScore,
        },
      },
    });

    return game;
  }

  async makeUserOnline(id: number) {

    try {
        const getUser = await this.prisma.user.findFirst({
          where: { id: id },
        });
    
        if (getUser.isOnline === 'offline') return;
    
        const user = await this.prisma.user.update({
          where: { id: id },
          data: {
            isOnline: 'online',
          },
        });
    } catch (error) {
        throw error;
    }

  }

  async getUserGamesCount(login: string) {
    const { id } = await this.getUser(login);

    const count = await this.prisma.game.count({
      where: {
        OR: [
          {
            firstPlayer: {
              id: id,
            },
          },
          {
            secondPlayer: {
              id: id,
            },
          },
        ],
      },
    });

    return count;
  }

  async getHistory(login: string, offset: number, limit: number) {
    return this.fetchUserGamesLimited(login, limit, offset);
  }

  async createGame(createGameDto: CreateGameDto) {
    try {
      const game = await this.prisma.game.create({
        data: {
          firstPlayerId: createGameDto.firstPlayerId,
          secondPlayerId: createGameDto.secondPlayerId,
          firstPlayerScore: 0,
          secondPlayerScore: 0,
        },
      });

      return game;
    } catch (e) {
      return null;
    }
  }

  async fetchFriends(userid: string) {
    const id = Number(userid);

    try {
      const friends = await this.prisma.friend.findMany({
        where: {
          OR: [
            {
              userId: id,
            },
            {
              friendId: id,
            },
          ],
          status: 'accepted',
        },

        include: {
          user: {
            select: {
              id: true,
              avatar: true,
              UserName: true,
            },
          },
          friend: {
            select: {
              id: true,
              avatar: true,
              UserName: true,
            },
          },
        },
      });

      const friendsList = friends.map((friend) => {
        if (friend.userId === id) return friend.friend;
        return friend.user;
      });

      return friendsList;
    } catch (e) {
      return null;
    }
  }

  async searchForFriend(id: number, username: string) {
    try {
      const friends = await this.prisma.friend.findMany({
        where: {
          OR: [
            {
              userId: id,
              friend: {
                UserName: {
                  contains: username,
                },
              },
            },
            {
              friendId: id,
              user: {
                UserName: {
                  contains: username,
                },
              },
            },
          ],
          status: 'accepted',
        },

        include: {
          user: true,
          friend: true,
        },
      });

      const friendsList = friends.map((friend) => {
        if (friend.userId === id) return friend.friend;
        return friend.user;
      });

      return friendsList;
    } catch (e) {
      return null;
    }
  }

  async checkifTwoUsersAreFriends(id1: number, id2: number) {
    try {
      const friend = await this.prisma.friend.findFirst({
        where: {
          OR: [
            {
              userId: id1,
              friendId: id2,
              status: 'accepted',
            },
            {
              userId: id2,
              friendId: id1,
              status: 'accepted',
            },
          ],
        },
      });

      if (friend) return true;
      return false;
    } catch (e) {
      return null;
    }
  }

  async userNewScore(id: number, score: number) {
    try {
      const user = await this.prisma.user.update({
        where: { id: id },
        data: {
          score: {
            increment: score,
          },
        },
      });

      return user;
    } catch (e) {
      return null;
    }
  }

  async userScore(id: number) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { id: id },
        select: {
          score: true,
        },
      });

      return user;
    } catch (e) {
      return null;
    }
  }

  async userInGame(id: number) {
    try {
      const checkUser = this.prisma.user.findFirst({
        where: {
          id: id,
        },
      });

      if (checkUser) {
        await this.prisma.user.update({
          where: {
            id: id,
          },
          data: {
            isOnline: 'in game',
          },
        });
      }
    } catch (e) {
      throw e;
    }
  }

  async getUserTheme(id: number) {
    try {
      const theme = await this.prisma.userTheme.findFirst({
        where: {
          userId: id,
        },
        include: {
          theme: true,
        },
      });

      if (theme) return theme.theme;

      return await this.prisma.themes.findFirst({
        where: {
          name: 'default',
        },
      });
    } catch (e) {
      throw e;
    }
  }

  async isPlayesBlockedEachOther(first: number, second: number) {

    try {
      const findBlocks = await this.prisma.block.findFirst({
        where: {
          OR: [
            {
              userId: first,
              blockedUserId: second,
            },
            {
              userId: second,
              blockedUserId: first,
            },
          ],
        },
      });

      return findBlocks;
    } catch (error) {
      throw error;
    }
  }
}
