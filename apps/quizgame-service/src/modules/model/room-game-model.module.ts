import { MongoDatabaseModule, RoomGame, RoomGameSchema } from "@database";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RoomGameModel } from "./room-game.model";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RoomGame.name,
        schema: RoomGameSchema,
      },
    ]),
    MongoDatabaseModule,
  ],
  providers: [RoomGameModel],
  exports: [RoomGameModel],
})
export class RoomGameModelModule {}
