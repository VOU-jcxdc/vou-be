import { BaseModel, Notification } from "@database";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class NotificationModel extends BaseModel<Notification> {
  constructor(@InjectModel(Notification.name) model: Model<Notification>) {
    super(model);
  }

  async findAllAccountNotifications(accountId: string) {
    return this.model.find({ accountId }).sort({ createdAt: -1 });
  }
}
