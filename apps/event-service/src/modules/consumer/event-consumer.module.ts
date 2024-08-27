import { Module } from "@nestjs/common";
import { EventConsumerService } from "./event-consumer.service";
import { RabbitmqModule } from "@shared-modules";
import { EventRepositoryModule } from "../repository/event-repository.module";
import { FavoriteEventRepositoryModule } from "../repository/favorite_event-repository.module";

@Module({
  imports: [RabbitmqModule, EventRepositoryModule, FavoriteEventRepositoryModule],
  providers: [EventConsumerService],
})
export class EventConsumerModule {}
