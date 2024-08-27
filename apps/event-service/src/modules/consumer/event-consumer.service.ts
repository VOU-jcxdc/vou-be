import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import amqp, { ChannelWrapper } from "amqp-connection-manager";
import { ConfirmChannel } from "amqplib";
import { RabbitMqService } from "@shared-modules";
import { EventRepository } from "../repository/event.repository";
import moment from "moment";
import { FavoriteEventRepository } from "../repository/favorite_event.repository";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EventConsumerService implements OnModuleInit {
  private channelWrapper: ChannelWrapper;
  private readonly logger = new Logger(EventConsumerService.name);

  constructor(
    private readonly favoriteEventRepository: FavoriteEventRepository,
    private readonly eventRepository: EventRepository,
    private readonly rabbitMqService: RabbitMqService,
    configService: ConfigService
  ) {
    const connection = amqp.connect([configService.get("RMQ_URLS")]);
    this.channelWrapper = connection.createChannel();
  }

  public async onModuleInit() {
    try {
      await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
        await channel.assertQueue("eventNotificationQueue", { durable: true });
        await channel.consume("eventNotificationQueue", async (message) => {
          if (message) {
            const { eventId, beginDate } = JSON.parse(message.content.toString());
            const currentEvent = await this.eventRepository.findOne({ where: { id: eventId } });
            if (currentEvent && moment(currentEvent.beginDate).isSame(moment(beginDate))) {
              const favEvents = await this.favoriteEventRepository.findAll({ where: { eventId } });
              const event = await this.eventRepository.findOne({ where: { id: eventId } });
              const accountIds = favEvents.map((favEvent) => favEvent.accountId);
              const data = {
                accountIds,
                event: {
                  id: event.id,
                  name: event.name,
                  description: event.description,
                  beginDate: event.beginDate,
                },
              };
              this.rabbitMqService.publishToQueue("notificationQueue", { ...data, topic: "event" });
              channel.ack(message);
            }
          }
        });
      });
      this.logger.log("Consumer service started and listening for messages.");
    } catch (err) {
      this.logger.error("Error starting the consumer:", err);
    }
  }
}
