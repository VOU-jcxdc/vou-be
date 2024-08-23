import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { INotificationToken } from "@types";
import { Document } from "mongoose";
import { UUID } from "typeorm/driver/mongodb/bson.typings";

@Schema({ collection: "notification_tokens", versionKey: false })
export class NotificationToken extends Document implements INotificationToken {
  @Prop({ type: UUID, required: true })
  accountId: string;

  @Prop({ type: String, required: true })
  token: string;

  @Prop({ type: Date, required: true, default: Date.now })
  createdOn: Date;

  @Prop({ type: Date, required: true, default: Date.now })
  updatedOn: Date;
}

export const NotificationTokenSchema = SchemaFactory.createForClass(NotificationToken);
