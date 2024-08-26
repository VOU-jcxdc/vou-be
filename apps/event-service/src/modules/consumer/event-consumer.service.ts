import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import amqp, { ChannelWrapper } from "amqp-connection-manager";
import { FavoriteEventService } from "../favorite-event/favorite_event.service";
import { ConfirmChannel } from "amqplib";
import { RabbitMqService } from "@shared-modules";

@Injectable()
export class EventConsumerService implements OnModuleInit {
  private channelWrapper: ChannelWrapper;
  private readonly logger = new Logger(EventConsumerService.name);

  constructor(
    private readonly favoriteEventService: FavoriteEventService,
    private readonly rabbitMqService: RabbitMqService
  ) {
    const connection = amqp.connect(["amqp://localhost:5672"]);
    this.channelWrapper = connection.createChannel();
  }

  public async onModuleInit() {
    try {
      await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
        await channel.assertQueue("eventNotificationQueue", { durable: true });
        await channel.consume("eventNotificationQueue", async (message) => {
          if (message) {
            const eventId = JSON.parse(message.content.toString());
            const data = await this.favoriteEventService.getFavoriteAccountIds(eventId);
            console.log("Event notification sent to accounts:", data);
            this.rabbitMqService.publishToQueue("notificationQueue", data);
            channel.ack(message);
          }
        });
      });
      this.logger.log("Consumer service started and listening for messages.");
    } catch (err) {
      this.logger.error("Error starting the consumer:", err);
    }
  }
}
