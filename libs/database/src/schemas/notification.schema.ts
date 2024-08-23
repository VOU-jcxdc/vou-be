import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { INotification } from "@types";
import { Document } from "mongoose";

@Schema({
  collection: "notifications",
  versionKey: false,
  timestamps: {
    createdAt: "createdOn",
    updatedAt: "updatedOn",
  },
})
export class Notification extends Document implements INotification {
  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: String, required: true })
  accountId: string;

  @Prop({ type: String, required: true })
  notificationTokenId: string;

  @Prop({ type: Object, required: true })
  data: object;

  @Prop({ type: Boolean, required: true })
  isRead: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
