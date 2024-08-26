import { Module } from "@nestjs/common";
import { NotificationModelModule } from "../model/notification-model.module";
import { NotificationService } from "./notification.service";
import { NotificationController } from "./notification.controller";
import { MongoDatabaseModule } from "@database";

@Module({
  imports: [NotificationModelModule, MongoDatabaseModule],
  providers: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}
