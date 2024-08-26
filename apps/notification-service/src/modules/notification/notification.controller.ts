import { Controller } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { MessagePattern, Payload } from "@nestjs/microservices";

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern({ method: "POST", path: "/notifications/fcm-token" })
  async upsertAccountToken(@Payload() data: { accountId: string; token: string }) {
    return this.notificationService.upsertAccountToken(data.accountId, data.token);
  }
}
