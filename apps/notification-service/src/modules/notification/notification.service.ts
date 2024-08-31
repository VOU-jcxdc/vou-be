import { Injectable } from "@nestjs/common";
import { NotificationTokenModel } from "../model/notification-token.model";
import { RpcException } from "@nestjs/microservices";

@Injectable()
export class NotificationService {
  constructor(private notificationTokeModel: NotificationTokenModel) {}

  async upsertAccountToken(accountId: string, token: string) {
    try {
      const existingToken = await this.notificationTokeModel.findOne({ accountId });
      existingToken
        ? await this.notificationTokeModel.update({ accountId }, { token })
        : await this.notificationTokeModel.create({ accountId, token });
      return "OK";
    } catch (error) {
      console.error(error);
      throw new RpcException(error);
    }
  }
}
