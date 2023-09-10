import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

import { GameService } from '../../services/game/game.service';
import { GameEngineService } from '../../services/game/game.engine.service';


import Matter, { Engine, Runner, Bodies, Composite, Body } from 'matter-js';
import { setInterval } from 'timers';

@WebSocketGateway()
export class GameGateway {
  constructor(
    private gameService: GameService,
    private engineService: GameEngineService,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinGlobalGame')
  joinGlobalGame(client: any, authUserId: string) {
    client.join(authUserId);
  }

  @SubscribeMessage('leaveGlobalGame')
  leaveGlobalGame(client: any, authUserId: string) {
    client.leave(authUserId);
  }

  private matches = new Map<string, string[]>();
  private games: Map<string, Matter.Engine> = new Map();
  private gameInterval: Map<string, NodeJS.Timeout> = new Map();

  private friendsRadyToPlay = new Map<string, string[]>();

  private readyfriendsGame = new Map<string, string[]>();

  private offsetWidth = 600;
  private offsetHeight = 900;

  private THICCNESS = 60;
  private R_HEIGHT = 20;
  private R_WIDTH = 150;

  private isValidId(id: string) {
    const isNumberReg: RegExp = /^\d+$/;

    const isIdInvalid = !isNumberReg.test(id);
    const isNotInMatches = !this.matches.has(id);
    const isLengthTwo = this.matches.get(id).length === 2;

    return isIdInvalid || isNotInMatches || isLengthTwo;
  }

  private checkIfPlayerIsInMatch(client: any, id: string) {
    for (const [key, players] of this.matches) {
      if (players.includes(id)) {
        return true;
      }
    }

    return false;
  }

  getUserRoom(id: string) {
    for (const [key, players] of this.matches) {
      if (players.includes(id)) {
        return key;
      }
    }
    return '';
  }

  @SubscribeMessage('waiting_for_match')
  async handleMatching(client: any, payload: any) {
    const id: string = payload.authUserId;
    const playerInMatch = this.checkIfPlayerIsInMatch(client, id);

    if (playerInMatch) {
      const room = this.getUserRoom(id);
      client.join(room);

      const players = this.matches.get(room);

      if (players.length === 2) {
        const firstUserTheme = await this.gameService.getUserTheme(
          Number(players[0]),
        );

        const secondUserTheme = await this.gameService.getUserTheme(
          Number(players[1]),
        );

        const themes = {
          firstUserTheme,
          secondUserTheme,
        };

        this.server.to(room).emit(
          'match_found',
          room,
          {
            first: players[0],
            second: players[1],
          },
          themes,
        );
      }

      return;
    }

    let existingRoomKey: string = null;
    for (const [key, players] of this.matches) {
      if (
        players.length < 2 &&
        (await this.gameService.isPlayesBlockedEachOther(
          Number(id),
          Number(players[0]),
        )) === null
      ) {
        {
          existingRoomKey = key;
          break;
        }
      }
    }

    if (existingRoomKey) {
      this.matches.get(existingRoomKey).push(id);

      client.join(existingRoomKey);

      const players = {
        first: this.matches.get(existingRoomKey)[0],
        second: this.matches.get(existingRoomKey)[1],
      };

      const game = await this.gameService.createGame({
        firstPlayerId: Number(players.first),
        secondPlayerId: Number(players.second),
      });

      this.gameService.userInGame(game.firstPlayerId);
      this.gameService.userInGame(game.secondPlayerId);

      this.startGame(players, existingRoomKey, game.id);

      const firstUserTheme = await this.gameService.getUserTheme(
        Number(players.first),
      );

      const secondUserTheme = await this.gameService.getUserTheme(
        Number(players.second),
      );

      const themes = {
        firstUserTheme,
        secondUserTheme,
      };

      this.server
        .to(existingRoomKey)
        .emit('match_found', existingRoomKey, players, themes);
    } else {
      const roomKey = 'room_' + id;

      this.matches.set(roomKey, [id]);
      client.join(roomKey);
    }
  }

  @SubscribeMessage('cancel_match')
  handleCancelMatch(client: any, payload: any) {
    const id: string = payload.authUserId;
    const room = this.getUserRoom(id);

    if (room) {
      const players = this.matches.get(room);

      if (players.length === 1) {
        this.matches.delete(room);
        this.server.to(room).emit('match_cancelled', room);
      }
    }
  }

  @SubscribeMessage('game_finished')
  handleGameFinished(client: any, payload: any) {
    this.matches.delete(payload.roomKey);
  }

  private getBallDirection() {
    return {
      x: (Math.floor(Math.random() * 100) % 2 == 0 ? -1 : 1) * 10,
      y: (Math.floor(Math.random() * 100) % 2 == 0 ? -1 : 1) * 10,
    };
  }

  async startGame(
    players: { first: string; second: string },
    room: string,
    gameid: number,
  ) {
    const { first, second } = players;

    const engine = Engine.create({
      gravity: {
        x: 0,
        y: 0,
        scale: 0.001,
      },
    });

    const reactOptions = {
      isStatic: true,
      chamfer: { radius: 10 },
    };

    const middle: number = this.offsetWidth / 2;

    const boxA: Body = Bodies.rectangle(
      middle,
      20,
      this.R_WIDTH,
      this.R_HEIGHT,
      reactOptions,
    );

    const boxB: Body = Bodies.rectangle(
      middle,
      this.offsetHeight - this.R_HEIGHT,
      this.R_WIDTH,
      this.R_HEIGHT,
      {
        isStatic: true,
        chamfer: { radius: 10 },
      },
    );

    const ball: Body = Bodies.circle(
      this.offsetWidth / 2,
      this.offsetHeight / 2,
      20,
      {
        restitution: 1,
        friction: 0,
        frictionAir: 0,
        inertia: Infinity,
      },
    );

    boxA.label = 'boxA';
    boxB.label = 'boxB';
    ball.label = 'ball';

    Body.setVelocity(ball, { x: 10, y: 10 });

    const wallLeft: Body = Bodies.rectangle(
      0 - this.THICCNESS / 2,
      this.offsetHeight / 2,
      this.THICCNESS,
      this.offsetHeight,
      { isStatic: true },
    );

    const wallRight: Body = Bodies.rectangle(
      this.offsetWidth + this.THICCNESS / 2,
      this.offsetHeight / 2,
      this.THICCNESS,
      this.offsetHeight,
      { isStatic: true },
    );

    Composite.add(engine.world, [boxA, boxB, wallLeft, wallRight, ball]);

    const runner = Runner.create();
    Runner.run(runner, engine);

    this.games.set(room, engine);

    const interval = setInterval(async () => {
      const ball = engine.world.bodies.find((body) => body.label === 'ball');

      this.broadcastBallPosition(
        {
          x: ball.position.x,
          y: ball.position.y,
        },
        first,
        room,
      );

      if (ball.position.y < 0 || ball.position.y > this.offsetHeight) {
        const game = await this.gameService.updateGame({
          id: gameid,
          firstPlayerScore: ball.position.y < 0 ? 1 : 0,
          secondPlayerScore: ball.position.y > this.offsetHeight ? 1 : 0,
        });

        if (game) {
          if (game.firstPlayerScore === 10 || game.secondPlayerScore === 10) {
            this.server.to(room).emit('game_finshed', game);

            if (game.firstPlayerScore === 10) {
              this.gameService.userNewScore(game.firstPlayerId, 10);
              this.gameService.userNewScore(game.secondPlayerId, -10);
            } else {
              this.gameService.userNewScore(game.firstPlayerId, -10);
              this.gameService.userNewScore(game.secondPlayerId, 10);
            }

            this.games.delete(room);
            this.matches.delete(room);
            this.gameInterval.delete('interval' + game.firstPlayerId);
            this.gameInterval.delete('interval' + game.secondPlayerId);
            clearInterval(interval);

            if (this.readyfriendsGame.get(room)) {
                this.readyfriendsGame.delete(room);
            }

            await this.gameService.makeUserOnline(game.firstPlayerId);
            await this.gameService.makeUserOnline(game.secondPlayerId);

            return;
          }

          this.server.to(room).emit('result', game);
        }

        const { x, y } = this.getBallDirection();

        Body.setVelocity(ball, { x, y });
        Body.setPosition(ball, {
          x: this.offsetWidth / 2,
          y: this.offsetHeight / 2,
        });
      }
    }, 15);
  }

  startmoving = (
    box: Matter.Body,
    room: string,
    player: string,
    key: string,
    id: number,
    label: string,
    y: number,
  ) => {
    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      if (this.gameInterval.get('interval' + player))
        clearInterval(this.gameInterval.get('interval' + player));

      let speed = 10;
      if (key === 'ArrowLeft') speed *= -1;

      if (box.position.x + speed < 0) return;

      const interval: NodeJS.Timeout = setInterval(() => {
        if (
          box.position.x + speed < this.R_WIDTH / 2 ||
          box.position.x + speed > this.offsetWidth - this.R_WIDTH / 2
        )
          return;

        Body.setPosition(box, { x: box.position.x + speed, y: y });
      }, 15);
      this.gameInterval.set('interval' + player, interval);
    }
  };

  broadcastBallPosition(
    ballPosition: { x: number; y: number },
    firstPlayer: string,
    room: string,
  ) {

    const engine = this.games.get(room);
    const boxA = engine.world.bodies.find((body) => body.label === 'boxA');
    const boxB = engine.world.bodies.find((body) => body.label === 'boxB');

    this.server
      .to(room)
      .emit(
        'ball_position',
        ballPosition,
        firstPlayer,
        boxA.position.x,
        boxB.position.x,
      );
  }

  @SubscribeMessage('key_pressed')
  move(
    client,
    data: { key: string; userId: number; room: string; speed: number },
  ) {
    let engine = this.games.get(data.room);
    let y: number;

    if (!engine) {
      return;
    }

    let plyaers = this.matches.get(data.room);
    if (!plyaers) return;

    let id: number = Number(data.userId);

    switch (id) {
      case Number(plyaers[0]):
        let boxB = engine.world.bodies.find((body) => body.label === 'boxB');
        this.startmoving(
          boxB,
          data.room,
          plyaers[0],
          data.key,
          id,
          'boxB',
          this.offsetHeight - this.R_HEIGHT,
        );
        return;

      case Number(plyaers[1]):
        let boxA = engine.world.bodies.find((body) => body.label === 'boxA');
        this.startmoving(boxA, data.room, plyaers[1], data.key, id, 'boxA', 20);
        return;
    }
  }

  @SubscribeMessage('key_released')
  stopMoving(client, data: { key: string; userId: number; room: string }) {
    let plyaers = this.matches.get(data.room);
    if (!plyaers) {
      return;
    }

    let id: number = Number(data.userId);
    switch (id) {
      case Number(plyaers[0]):
        if (this.gameInterval.get('interval' + plyaers[0]))
          clearInterval(this.gameInterval.get('interval' + plyaers[0]));
        return;

      case Number(plyaers[1]):
        if (this.gameInterval.get('interval' + plyaers[1]))
          clearInterval(this.gameInterval.get('interval' + plyaers[1]));
        return;
    }
  }

  @SubscribeMessage('invite')
  async inviteToGame(client: any, data: any) {



    const user =  await this.gameService.fetchUserById(data.authUser);
    const checkedUser =  await this.gameService.fetchUserById(data.checked);

    if (user.isOnline == 'in game' || checkedUser.isOnline == 'in game') {
        this.server.to('user' + data.authUser.toString()).emit('friend_not_invited');
        return;
    }

    const userRomm = this.getUserRoom(data.authUser);
    if (userRomm.length) {
        return ;
    }

    const room = 'friendroom' + data.authUser;
    client.join(room);

    

    setTimeout(() => {
      if (!this.matches.get(room)) {
        this.server
          .to('user' + data.authUser.toString())
          .emit('friend_game_timeout', data);
        return;
      }
    }, 10000);

    this.server
      .to('user' + data.checked.toString())
      .emit('friend_invite', data.authUser);
  }

  @SubscribeMessage('acceptInvite')
  async acceptInvite(client: any, data: any) {
    const room = 'friendroom' + data.friend;

    client.join(room);
    this.matches.set(room, [data.friend, data.authUser]);

    this.server.to(room).emit('start_friend_game', {
      ...data,
      room,
    });
  }


  @SubscribeMessage('redy_for_friend_game')
  async redyForFriendGame(client: any, data: any) {

    const room = this.getUserRoom(data.authUser);

    if (!room.length) {
        client.join('user' + data.authUser.toString());
        this.server.to('user' + data.authUser.toString()).emit('friend_not_invited');
        return;
    }

    client.join(room);
    const players = this.readyfriendsGame.get(room);


    if (players == undefined) {
        this.readyfriendsGame.set(room, [data.authUser]);
        return;
    }

    if (players.length == 2) {

          const firstUserTheme = await this.gameService.getUserTheme(
            Number(players[0]),
          );
      
          const secondUserTheme = await this.gameService.getUserTheme(
            Number(players[1]),
          );
      
          const theme = {
            firstUserTheme,
            secondUserTheme,
          };

          this.server
            .to(room)
            .emit('froent_friend_game_players', players, theme);

        return ;
    }

    if (players.length == 1 && players[0] != data.authUser.toString()) {

      const players = this.matches.get(room);

      this.readyfriendsGame.delete(room);
      this.readyfriendsGame.set(room, [players[0], players[1]]);

      const game = await this.gameService.createGame({
        firstPlayerId: Number(players[0]),
        secondPlayerId: Number(players[1]),
      });

      this.startGame(
        {
          first: players[0],
          second: players[1],
        },
        room,
        game.id,
      );

      this.gameService.userInGame(game.firstPlayerId);
      this.gameService.userInGame(game.secondPlayerId);

      const firstUserTheme = await this.gameService.getUserTheme(
        Number(players[0]),
      );

      const secondUserTheme = await this.gameService.getUserTheme(
        Number(players[1]),
      );
  
      const theme = {
        firstUserTheme,
        secondUserTheme,
      };

      this.server
            .to(room)
            .emit('froent_friend_game_players', players, theme);
    }
  }
}
