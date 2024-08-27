import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import amqp, { ChannelWrapper } from "amqp-connection-manager";
import { ConfirmChannel } from "amqplib";
import { NotificationService } from "../notification/notification.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class NotificationConsumerService implements OnModuleInit {
  private channelWrapper: ChannelWrapper;
  private readonly logger = new Logger(NotificationConsumerService.name);

  constructor(private readonly notificationService: NotificationService, configService: ConfigService) {
    const connection = amqp.connect([configService.get("RMQ_URLS")]);
    this.channelWrapper = connection.createChannel();
  }

  public async onModuleInit() {
    try {
      await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
        await channel.assertQueue("notificationQueue", { durable: true });
        await channel.consume("notificationQueue", async (message) => {
          if (message) {
            const data = JSON.parse(message.content.toString());
            const { accountIds, topic } = data;
            switch (topic) {
              case "event": {
                const { event } = data;
                await this.notificationService.sendNotificationToAccounts(
                  accountIds,
                  event.name,
                  event.description,
                  null,
                  {
                    eventId: event.id,
                  }
                );
                break;
              }
              default:
                break;
            }
            channel.ack(message);
          }
        });
      });
      this.logger.log("Consumer service started and listening for messages.");
    } catch (err) {
      this.logger.error("Error starting the consumer:", err);
      throw err;
    }
  }
}
