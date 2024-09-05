import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IRoomGame, RoomGameStatus } from "@types";
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

  // Hide timestamps
  @Prop({ type: Date, select: false })
  createdOn: Date;

  @Prop({ type: Date, select: false })
  updatedOn: Date;
}

export const RoomGameSchema = SchemaFactory.createForClass(RoomGame);
