
import { io, Socket } from 'socket.io-client';

class SocketClient {
  private socket: Socket;

  constructor(url: string) {
    this.socket = io(url, {
        path: '/socket/game',
        transports: ['websocket'], // Указываем, что используем только WebSocket
    });
  }

  send<T>(eventName: string, payload: T): void {
    this.socket.emit(eventName, payload);
  }

  listenToEvent<T>(eventName: string, cb: (payload: T) => void): void {
    this.socket.on(eventName, (payload: T) => {
      cb(payload);
    });
  }
}

export const socketClient = new SocketClient(import.meta.env.VITE_APP_SOCKET_URL)