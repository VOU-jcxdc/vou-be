import { Module } from "@nestjs/common";
import { EventRepositoryModule } from "../repository/event-repository.module";
import { EventController } from "./event.controller";
import { EventService } from "./event.service";
import { EventImageRepositoryModule } from "../repository/event-image-repository.module";
import { EventHelper } from "./event.helper";
import { FavoriteEventRepositoryModule } from "../repository/favorite_event-repository.module";
import { RabbitmqModule } from "@shared-modules";

@Module({
  imports: [EventRepositoryModule, EventImageRepositoryModule, FavoriteEventRepositoryModule, RabbitmqModule],
  controllers: [EventController],
  providers: [EventService, EventHelper],
})
export class EventModule {}
