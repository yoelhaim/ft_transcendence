
import Matter, { Engine, Runner, Bodies, Composite, Body } from 'matter-js';
import { setInterval } from "timers";
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io';
import { GameService } from "./game.service";

@WebSocketGateway()
export class GameEngineService {

    constructor(private gameService: GameService) { }

    @WebSocketServer()
    server: Server;

    // private games: Map<string, Matter.Engine> = new Map();

    // private getBallDirection() {

    //     return {
    //         x: (Math.floor(Math.random() * 100) % 2 == 0 ? -1 : 1) * 10,
    //         y: (Math.floor(Math.random() * 100) % 2 == 0 ? -1 : 1) * 10
    //     }

    // }

    // async startGame(players: { first: string, second: string }, room: string, gameid: number) {

    //     console.log('Game started');

    //     console.log('roommm ', room);
    //     const { first, second } = players;

    //     const offsetWidth = 600;
    //     const offsetHeight = 900;

    //     const THICCNESS = 60;
    //     const R_HEIGHT = 20;

    //     let engine = Engine.create(
    //         {
    //             gravity: {
    //                 x: 0,
    //                 y: 0,
    //                 scale: 0.001
    //             }
    //         }
    //     );

    //     let reactOptions = {
    //         isStatic: true,
    //         chamfer: { radius: 10 }
    //     }

    //     let middle: number = offsetWidth / 2;

    //     let boxA: Body = Bodies.rectangle(middle, 20, 150, R_HEIGHT, reactOptions);

    //     boxA.label = 'boxA';
    //     let boxB: Body = Bodies.rectangle(middle, offsetHeight - R_HEIGHT, 150, R_HEIGHT,
    //         {
    //             isStatic: true,
    //             chamfer: { radius: 10 }
    //         }
    //     );

    //     let ball: Body = Bodies.circle(offsetWidth / 2, offsetHeight / 2, 20, {
    //         restitution: 1,
    //         friction: 0,
    //         frictionAir: 0,
    //         inertia: Infinity
    //     });

    //     ball.label = 'ball';

    //     Body.setVelocity(ball, { x: 10, y: 10 })

    //     let wallLeft: Body = Bodies.rectangle(
    //         0 - THICCNESS / 2,
    //         offsetHeight / 2,
    //         THICCNESS,
    //         offsetHeight,
    //         { isStatic: true }
    //     );

    //     let wallRight: Body = Bodies.rectangle(
    //         offsetWidth + THICCNESS / 2,
    //         offsetHeight / 2,
    //         THICCNESS, offsetHeight,
    //         { isStatic: true }
    //     );

    //     Composite.add(engine.world, [boxA, boxB, wallLeft, wallRight, ball]);

    //     let runner = Runner.create();
    //     Runner.run(runner, engine);

    //     this.games.set("room_1", engine);

    //     const interval = setInterval(async () => {

    //         const offsetWidth = 600;
    //         const offsetHeight = 900;

    //         const THICCNESS = 60;
    //         const R_HEIGHT = 20;

    //         let ball = engine.world.bodies.find(body => body.label === 'ball');

    //         this.broadcastBallPosition({
    //             'x': ball.position.x,
    //             'y': ball.position.y,
    //         });

    //         if (ball.position.y < 0 || ball.position.y > offsetHeight) {

    //             const game = await this.gameService.updateGame({
    //                 id: gameid,
    //                 firstPlayerScore: ball.position.y < 0 ? 1 : 0,
    //                 secondPlayerScore: ball.position.y > offsetHeight ? 1 : 0
    //             });

    //             if (game) {

    //                 if (game.firstPlayerScore === 20 || game.secondPlayerScore === 20) {

    //                     this.server.to(room).emit('game_finshed', game);

    //                     this.games.delete(room);
    //                     clearInterval(interval);
    //                     return;
    //                 }

    //                 this.server.to(room).emit('result', game);
    //             }

    //             let { x, y } = this.getBallDirection();

    //             Body.setVelocity(ball, { x, y });
    //             Body.setPosition(ball, { x: offsetWidth / 2, y: offsetHeight / 2 });

    //         }

    //     }, 15);

    // }

    // broadcastBallPosition(ballPosition: { x: number; y: number }) {
    //     this.server.emit('ball_position', ballPosition);
    // }

    // @SubscribeMessage('move')
    // move(client, data: { x: number, y: number, userId: number , room: string }) {

    //     let engine = this.games.get(data.room);

    //     if (!engine) {
    //         return;
    //     }

    //     let boxA = engine.world.bodies.find(body => body.label === 'boxA');

    //     if (boxA) {
    //         Body.setPosition(boxA, { x: data.x, y: data.y });
    //     }

    // }

}