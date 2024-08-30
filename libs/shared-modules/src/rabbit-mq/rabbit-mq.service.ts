import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DELAY_MESSAGE_EXCHANGE_NAME, EVENT_NOTIFICATION_ROUTING_KEY } from "@types";
import { Channel } from "amqplib";
import amqp, { ChannelWrapper } from "amqp-connection-manager";

@Injectable()
export class RabbitMqService implements OnModuleInit, OnModuleDestroy {
  private channel: ChannelWrapper;
  private configService: ConfigService;
  constructor(configService: ConfigService) {
    this.configService = configService;
  }

  async onModuleInit() {
    try {
      const connection = amqp.connect([this.configService.get("RMQ_URLS") as string]);
      this.channel = connection.createChannel({
        json: true,
        setup: async (channel: Channel) => {
          await channel.assertQueue("eventNotificationQueue", { durable: true });
          await channel.assertQueue("notificationQueue", { durable: true });
          await channel.assertExchange(DELAY_MESSAGE_EXCHANGE_NAME, "x-delayed-message", {
            arguments: { "x-delayed-type": "direct" },
          });
          await channel.bindQueue(
            "eventNotificationQueue",
            DELAY_MESSAGE_EXCHANGE_NAME,
            EVENT_NOTIFICATION_ROUTING_KEY
          );
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  async onModuleDestroy() {
    try {
      await this.channel.close();
    } catch (error) {
      console.error(error);
    }
  }

  publishWithDelay(exchange: string, routingKey: string, message: any, timeSchedule: number) {
    try {
      this.channel.publish(exchange, routingKey, message, {
        headers: { "x-delay": timeSchedule },
        persistent: true,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  publishToQueue(queue: string, message: any) {
    try {
      this.channel.sendToQueue(queue, message, { persistent: true });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
