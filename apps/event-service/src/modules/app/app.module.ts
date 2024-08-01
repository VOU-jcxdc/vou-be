import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EventModule } from "../event/event.module";
import { PostgreDatabaseModule } from "@database";
import { FavoriteEventModule } from "../favorite-event/favorite_event.module";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PostgreDatabaseModule, EventModule, FavoriteEventModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
