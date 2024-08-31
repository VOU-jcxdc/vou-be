import { Body, Controller, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
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

  @Get()
  async getAccountNotifications(@CurrentUser() user: ICurrentUser) {
    return this.notificationService.getAccountNotifications(user.userId);
  }

  @Put("/read")
  async markAsRead(@Body() data: { notificationIds: string[] }) {
    return this.notificationService.markManyNotificationsAsRead(data.notificationIds);
  }

  @Put("/:notificationId/read")
  async markNotificationAsRead(@Param("notificationId") notificationId: string) {
    return this.notificationService.markNotificationAsRead(notificationId);
  }
}
