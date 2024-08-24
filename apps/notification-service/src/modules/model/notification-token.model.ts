import { ModelRepository } from "@database";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { NotificationToken } from "@database";
import { Model } from "mongoose";

@Injectable()
export class NotificationTokenModel extends ModelRepository<NotificationToken> {
  constructor(@InjectModel(NotificationToken.name) model: Model<NotificationToken>) {
    super(model);
  }
}
