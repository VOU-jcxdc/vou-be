import { Module } from "@nestjs/common";
import { FavoriteEventController } from "./favorite_event.controller";
import { FavoriteEventService } from "./favorite_event.service";
import { FavoriteEventRepositoryModule } from "../repository/favorite_event-repository.module";

@Module({
  imports: [FavoriteEventRepositoryModule],
  controllers: [FavoriteEventController],
  providers: [FavoriteEventService],
})
export class FavoriteEventModule {}
