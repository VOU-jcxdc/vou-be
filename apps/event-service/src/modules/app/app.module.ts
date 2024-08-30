import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EventModule } from "../event/event.module";
import { PostgreDatabaseModule } from "@database";
import { FavoriteEventModule } from "../favorite-event/favorite_event.module";
import { GameInSystemModule } from "../games-in-system/game-in-system.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PostgreDatabaseModule,
    EventModule,
    FavoriteEventModule,
    GameInSystemModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
