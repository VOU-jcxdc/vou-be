import { ModelRepository, Notification } from "@database";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class NotificationModel extends ModelRepository<Notification> {
  constructor(@InjectModel(Notification.name) model: Model<Notification>) {
    super(model);
  }
}
