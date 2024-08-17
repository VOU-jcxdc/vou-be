import { Module } from "@nestjs/common";
import { FavoriteEventController } from "./favorite_event.controller";
import { FavoriteEventService } from "./favorite_event.service";
import { FavoriteEventRepositoryModule } from "../repository/favorite_event-repository.module";
import { EventRepositoryModule } from "../repository/event-repository.module";
import { EventHelper } from "../event/event.helper";
import { EventImageRepositoryModule } from "../repository/event-image-repository.module";

@Module({
  imports: [FavoriteEventRepositoryModule, EventRepositoryModule, EventImageRepositoryModule],
  controllers: [FavoriteEventController],
  providers: [FavoriteEventService, EventHelper],
})
export class FavoriteEventModule {}
