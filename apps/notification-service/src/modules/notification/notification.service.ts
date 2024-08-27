import { Injectable } from "@nestjs/common";
import { NotificationTokenModel } from "../model/notification-token.model";
import { RpcException } from "@nestjs/microservices";
import { FirebaseMessagingService } from "@shared-modules";
import { NotificationModel } from "../model/notification.model";

@Injectable()
export class NotificationService {
  constructor(
    private notificationTokenModel: NotificationTokenModel,
    private notificationModel: NotificationModel,
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

  async sendNotificationToAccounts(accountIds: string[], title: string, body: string, topic?: string, data?: any) {
    try {
      const tokens = await this.notificationTokenModel.find({ accountId: { $in: accountIds } });
      const deviceTokens = tokens.map((token) => ({ token: token.token, _id: token._id, accountId: token.accountId }));
      for (const token of deviceTokens) {
        await this.firebaseMessagingService.pushNotification(token.token, null, { title, body }, data);
        this.notificationModel.create({
          title,
          content: body,
          accountId: token.accountId,
          notificationTokenId: token._id.toString(),
          data: data || {},
          isRead: false,
        });
      }
    } catch (error) {
      console.error(error);
      throw new RpcException(error);
    }
  }
}
