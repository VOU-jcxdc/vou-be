import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { ICurrentUser, UpsertFcmTokenDto } from "@types";
import { JwtAuthGuard } from "../../guard";
import { CurrentUser } from "../../decorators";

@UseGuards(JwtAuthGuard)
@Controller("notifications")
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
  @Post("fcm-token")
  async upsertAccountToken(@CurrentUser() user: ICurrentUser, @Body() data: UpsertFcmTokenDto) {
    return this.notificationService.upsertAccountToken(user.userId, data.token);
  }
}
