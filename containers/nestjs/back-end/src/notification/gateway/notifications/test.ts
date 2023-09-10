// import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';

// @WebSocketGateway()
// export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   @WebSocketServer()
//   server: Server;

//   private userConnections: Map<string, Socket> = new Map();

//   handleConnection(socket: Socket) {

//     const authToken: string = socket.handshake?.query?.authToken;
//     if (authToken) {
//       const userId: string = getUserIdFromAuthToken(authToken);
//       this.userConnections.set(userId, socket);
//     }
//   }

//   handleDisconnect(socket: Socket) {

//     const userId: string | undefined = getUserIdFromSocket(socket);
//     if (userId) {
//       this.userConnections.delete(userId);
//     }
//   }

//   emitEventToUser(userId: string, eventName: string, eventData: any) {
//     const socket: Socket | undefined = this.userConnections.get(userId);
//     if (socket) {
//       socket.emit(eventName, eventData);
//     }
//   }

//   private getUserIdFromSocket(socket: Socket): string | undefined {
//     return socket.userId;
//   }

//   private getUserIdFromAuthToken(authToken: string): string {

//     return authToken.userId;
//   }
// }
