import { Module } from "@nestjs/common";
import { MongoDatabaseModule } from "@database";
import { NotificationModelModule } from "../model/notification-model.module";
import { NotificationModule } from "../notification/notification.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), MongoDatabaseModule, NotificationModelModule, NotificationModule],
})
export class AppModule {}
