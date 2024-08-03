import { Module } from "@nestjs/common";
import { FavoriteEventController } from "./favorite_event.controller";
import { FavoriteEventService } from "./favorite_event.service";
import { FavoriteEventRepositoryModule } from "../repository/favorite_event-repository.module";
import { EventRepositoryModule } from "../repository/event-repository.module";

@Module({
  imports: [FavoriteEventRepositoryModule, EventRepositoryModule],
  controllers: [FavoriteEventController],
  providers: [FavoriteEventService],
})
export class FavoriteEventModule {}
