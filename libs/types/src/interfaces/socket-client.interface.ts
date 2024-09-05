import { Socket } from "socket.io";
import { ICurrentUser } from "./current_user.interface";

export interface ISocketClient extends Socket {
  id: string;
  player: ICurrentUser;
}
