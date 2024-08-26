import { Injectable } from "@nestjs/common";
import { NotificationTokenModel } from "../model/notification-token.model";
import { RpcException } from "@nestjs/microservices";
import { FirebaseMessagingService } from "@shared-modules";

@Injectable()
export class NotificationService {
  constructor(
    private notificationTokenModel: NotificationTokenModel,
    private readonly firebaseMessagingService: FirebaseMessagingService
  ) {}

  async upsertAccountToken(accountId: string, token: string) {
    try {
      const existingToken = await this.notificationTokenModel.findOne({ accountId });
      existingToken
        ? await this.notificationTokenModel.update({ accountId }, { token })
        : await this.notificationTokenModel.create({ accountId, token });
      return "OK";
    } catch (error) {
      console.error(error);
      throw new RpcException(error);
    }
  }

  async sendNotificationToAccounts(accountIds: string[], title: string, body: string) {
    try {
      const tokens = await this.notificationTokenModel.find({ accountId: { $in: accountIds } });
      const deviceTokens = tokens.map((token) => token.token);
      for (const token of deviceTokens) {
        await this.firebaseMessagingService.pushNotification(token, { title, body });
      }
    } catch (error) {
      console.error(error);
      throw new RpcException(error);
    }
  }
}
