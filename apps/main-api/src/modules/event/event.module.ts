import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { EventController } from "./event.controller";
import { EventService } from "./event.service";
import { ClientOptions, Transport } from "@nestjs/microservices";
import { FavoriteEventController } from "./favorite_event.controller";
import { FavoriteEventService } from "./favorite_event.service";

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: "EVENT_SERVICE",
      useFactory: (configService: ConfigService): ClientOptions => ({
        transport: Transport.TCP,
        options: {
          host: configService.get("EVENT_SERVICE_HOST"),
          port: configService.get("EVENT_SERVICE_PORT"),
        },
      }),
      inject: [ConfigService],
    },
    EventService,
    FavoriteEventService,
  ],
  controllers: [FavoriteEventController, EventController],
})
export class EventModule {}
