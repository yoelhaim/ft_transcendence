import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';

import {
  CreateGameDto,
  UpdateGameDto,
} from '../../../game/dtos/CreateGame.dtos';

import { GameService } from '../../services/game/game.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Get('/friends')
  @UseGuards(AuthGuard('authGuard'))
  async fetchFriends(@Req() req: Request) {
    return await this.gameService.fetchFriends(req.user['id']);
  }

  @Get('/score')
  @UseGuards(AuthGuard('authGuard'))
  async userScore(@Req() req: Request) {
    return await this.gameService.userScore(req.user['id']);
  }

  @Get('/friends/:username')
  @UseGuards(AuthGuard('authGuard'))
  async searchForFriend(
    @Param('username') username: string,
    @Req() req: Request,
  ) {
    return await this.gameService.searchForFriend(req.user['id'], username);
  }

  @Get(':id')
  getGames(@Param('id') login: string) {
    return this.gameService.fetchUserGames(login);
  }

  @Post('create')
  createGame(@Body() createGameDto: CreateGameDto) {
    return this.gameService.createGame(createGameDto);
  }

  @Post('update')
  updateGame(@Body() updateGameDto: UpdateGameDto) {
    return this.gameService.updateGame(updateGameDto);
  }

  @Get('/history/:login/:offset')
  async getHistory(
    @Param('login') login: string,
    @Param('offset') offset: number,
  ) {
    let offsetNumber = Number(offset);
    const numberOfGamesAtSinglePage = 10;

    if (isNaN(offsetNumber)) {
      offsetNumber = 0;
    }

    const games = await this.gameService.getHistory(
      login,
      offsetNumber,
      numberOfGamesAtSinglePage,
    );
    const numberOfGames = await this.gameService.getUserGamesCount(login);

    const numberOfpages = Math.ceil(numberOfGames / numberOfGamesAtSinglePage);

   

    return { games, numberOfpages };
  }

  @Get('/match/player')
  @UseGuards(AuthGuard('authGuard'))
  async getMatchmaking(@Req() req: Request) {
    return req.user;
  }

  @Get('/user/:id')
  async fetchUserById(@Param('id') id: string) {
    const userId = Number(id);
    return await this.gameService.fetchUserById(userId);
  }
}
