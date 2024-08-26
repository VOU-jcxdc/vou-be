import { Module } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { NotificationController } from "./notification.controller";
import { ClientProxyModule } from "@shared-modules";

@Module({
  imports: [ClientProxyModule],
  providers: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}
