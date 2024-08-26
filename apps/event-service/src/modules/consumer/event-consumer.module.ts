import { Module } from "@nestjs/common";
import { EventConsumerService } from "./event-consumer.service";
import { RabbitmqModule } from "@shared-modules";
import { FavoriteEventModule } from "../favorite-event/favorite_event.module";

@Module({
  imports: [RabbitmqModule, FavoriteEventModule],
  providers: [EventConsumerService],
})
export class EventConsumerModule {}
