import { Module } from "@nestjs/common";
import { MongoDatabaseModule } from "@database";
import { NotificationModelModule } from "../model/notification-model.module";
import { NotificationModule } from "../notification/notification.module";
import { ConfigModule } from "@nestjs/config";
import { FirebaseModule } from "@shared-modules";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [MongoDatabaseModule, NotificationModelModule],
})
export class AppModule {}
