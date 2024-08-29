import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EventController } from "./event.controller";
import { EventService } from "./event.service";
import { FavoriteEventController } from "./favorite_event.controller";
import { FavoriteEventService } from "./favorite_event.service";
import { ClientProxyModule } from "@shared-modules";
import { EventHelper } from "./event.helper";
import { GameInSystemController } from "./game-in-system.controller";
import { GameInSystemService } from "./game-in-system.service";

@Module({
  imports: [ConfigModule, ClientProxyModule],
  providers: [EventService, FavoriteEventService, EventHelper, GameInSystemService],
  controllers: [FavoriteEventController, EventController, GameInSystemController],
})
export class EventModule {}
