import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server } from 'socket.io';
import { EventEmitter } from 'stream';

process.setMaxListeners(0);
const emitter = new EventEmitter();
emitter.setMaxListeners(0);


@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message-notification')
  handleMessage(client: any, payload: any) {
    client;
    payload;
    this.server.to('user' + payload.toString()).emit('notification-readed');
  }

  emitNewNotivication(id: number) {
    this.server.to('user' + id.toString()).emit('new-notification');
  }

}
