import { Injectable } from "@nestjs/common";
import { NotificationTokenModel } from "../model/notification-token.model";

@Injectable()
export class AppService {
  constructor(private readonly notificationTokenModel: NotificationTokenModel) {}
  getData(): { message: string } {
    return { message: "Hello API" };
  }

  async addToken(token: string, accountId: string) {
    return this.notificationTokenModel.create({ token, accountId });
  }
}
