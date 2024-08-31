import { BadRequestException, Inject, Injectable, Logger } from "@nestjs/common";
import { ClientOptions, ClientProxy, ClientProxyFactory } from "@nestjs/microservices";
import { NOTIFICATION_SERVICE_PROVIDER_NAME } from "@types";

@Injectable()
export class NotificationService {
  private notiClient: ClientProxy;
  private readonly logger = new Logger(NotificationService.name);
  constructor(@Inject(NOTIFICATION_SERVICE_PROVIDER_NAME) notiOptions: ClientOptions) {
    this.notiClient = ClientProxyFactory.create(notiOptions);
  }

  async upsertAccountToken(accountId: string, token: string) {
    try {
      return this.notiClient.send({ method: "POST", path: "/notifications/fcm-token" }, { accountId, token });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException();
    }
  }

  async getAccountNotifications(accountId: string) {
    try {
      return this.notiClient.send({ method: "GET", path: "/notifications" }, { accountId });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException();
    }
  }

  async markManyNotificationsAsRead(notificationIds: string[]) {
    try {
      return this.notiClient.send({ method: "PUT", path: "/notifications/read" }, { notificationIds });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException();
    }
  }

  async markNotificationAsRead(notificationId: string) {
    try {
      return this.notiClient.send(
        { method: "PUT", path: `/notifications/read` },
        { notificationIds: [notificationId] }
      );
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException();
    }
  }
}
