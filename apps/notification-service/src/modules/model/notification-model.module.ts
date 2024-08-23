import { Module } from "@nestjs/common";
import { NotificationTokenModel } from "./notification-token.model";
import { MongooseModule } from "@nestjs/mongoose";
import { NotificationToken, NotificationTokenSchema } from "@database";

@Module({
  imports: [MongooseModule.forFeature([{ name: NotificationToken.name, schema: NotificationTokenSchema }])],
  providers: [NotificationTokenModel],
  exports: [NotificationTokenModel],
})
export class NotificationModelModule {}
