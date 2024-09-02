import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IQAOption, IQAs, IRoomGame, RoomGameStatus } from "@types";
import { Document } from "mongoose";

@Schema({
  collection: "rooms_games",
  versionKey: false,
  timestamps: {
    createdAt: "createdOn",
    updatedAt: "updatedOn",
  },
})
export class RoomGame extends Document implements IRoomGame {
  @Prop({ type: Array, required: true })
  QAs: string[];

  @Prop({ type: Array, required: true })
  players: string[];

  @Prop({ type: String, enum: RoomGameStatus, required: true })
  status: RoomGameStatus;

  @Prop({ type: String, required: true })
  eventId: string;
}

export const RoomGameSchema = SchemaFactory.createForClass(RoomGame);
