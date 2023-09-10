import { io } from 'socket.io-client';
const baseURL = process.env.SOCKET_URL || 'ws://localhost:8000/';

const socket = io(baseURL, {
  transports: ['websocket', 'polling', 'flashsocket'],
  autoConnect: true,
    withCredentials: true,

});
export default socket;
