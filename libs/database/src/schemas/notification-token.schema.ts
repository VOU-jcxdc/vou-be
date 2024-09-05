import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { INotificationToken } from "@types";
import { Document } from "mongoose";

@Schema({
  collection: "notification_tokens",
  versionKey: false,
  timestamps: {
    createdAt: "createdOn",
    updatedAt: "updatedOn",
  },
})
export class NotificationToken extends Document implements INotificationToken {
  @Prop({ type: String, required: true })
  accountId: string;

  @Prop({ type: String, required: true })
  token: string;

  // Hide timestamps
  @Prop({ type: Date, select: false })
  createdOn: Date;

  @Prop({ type: Date, select: false })
  updatedOn: Date;
}

export const NotificationTokenSchema = SchemaFactory.createForClass(NotificationToken);
