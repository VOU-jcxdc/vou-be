import { Module } from "@nestjs/common";
import { MongoDatabaseModule } from "@database";
import { NotificationModelModule } from "../model/notification-model.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [MongoDatabaseModule, NotificationModelModule, ConfigModule.forRoot({ isGlobal: true })],
})
export class AppModule {}
