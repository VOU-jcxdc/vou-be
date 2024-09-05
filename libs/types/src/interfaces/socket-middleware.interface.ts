import { Socket } from "socket.io";
export interface ISocketMiddleware {
  (socket: Socket, next: (err?: Error) => void): void;
}
