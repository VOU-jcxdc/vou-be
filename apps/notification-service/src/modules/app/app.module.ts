import { Module } from "@nestjs/common";
import { MongoDatabaseModule } from "@database";
import { NotificationModelModule } from "../model/notification-model.module";

@Module({
  imports: [MongoDatabaseModule, NotificationModelModule],
})
export class AppModule {}
