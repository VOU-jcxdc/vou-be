import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import amqp, { ChannelWrapper } from "amqp-connection-manager";
import { ConfirmChannel } from "amqplib";
import { NotificationService } from "../notification/notification.service";

@Injectable()
export class NotificationConsumerService implements OnModuleInit {
  private channelWrapper: ChannelWrapper;
  private readonly logger = new Logger(NotificationConsumerService.name);

  constructor(private readonly notificationService: NotificationService) {
    const connection = amqp.connect(["amqp://localhost:5672"]);
    this.channelWrapper = connection.createChannel();
  }

  public async onModuleInit() {
    try {
      await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
        await channel.assertQueue("notificationQueue", { durable: true });
        await channel.consume("notificationQueue", async (message) => {
          if (message) {
            const { accountIds, event } = JSON.parse(message.content.toString());
            //await this.notificationService.sendNotificationToAccounts(accountIds, event.name, event.description);
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
