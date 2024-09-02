import { BaseModel, RoomGame } from "@database";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class RoomGameModel extends BaseModel<RoomGame> {
  constructor(@InjectModel(RoomGame.name) model: Model<RoomGame>) {
    super(model);
  }
}
