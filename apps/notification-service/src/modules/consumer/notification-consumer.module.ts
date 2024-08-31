import { Module } from "@nestjs/common";
import { NotificationConsumerService } from "./notification-consumer.service";
import { NotificationModule } from "../notification/notification.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [NotificationModule, ConfigModule],
  providers: [NotificationConsumerService],
})
export class NotificationConsumerModule {}
