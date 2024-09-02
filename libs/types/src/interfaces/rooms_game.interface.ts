import { RoomGameStatus } from "../enums";

export interface IRoomGame {
  QAs: string[];
  players: string[];
  status: RoomGameStatus;
  eventId: string;
  updatedOn: Date;
  createdOn: Date;
}
