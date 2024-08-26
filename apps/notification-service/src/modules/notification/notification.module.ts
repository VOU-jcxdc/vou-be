import { Module } from "@nestjs/common";
import { NotificationModelModule } from "../model/notification-model.module";
import { NotificationService } from "./notification.service";
import { NotificationController } from "./notification.controller";
import { MongoDatabaseModule } from "@database";
import { FirebaseModule } from "@shared-modules";

@Module({
  imports: [NotificationModelModule, MongoDatabaseModule, FirebaseModule],
  providers: [NotificationService],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}
