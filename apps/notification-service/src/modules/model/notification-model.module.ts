import { Module } from "@nestjs/common";
import { NotificationTokenModel } from "./notification-token.model";
import { MongooseModule } from "@nestjs/mongoose";
import { NotificationSchema, NotificationToken, NotificationTokenSchema, Notification } from "@database";
import { NotificationModel } from "./notification.model";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NotificationToken.name, schema: NotificationTokenSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  providers: [NotificationTokenModel, NotificationModel],
  exports: [NotificationTokenModel, NotificationModel],
})
export class NotificationModelModule {}
