import { Module } from "@nestjs/common";
import { MongoDatabaseModule } from "@database";
import { NotificationModelModule } from "../model/notification-model.module";
import { ConfigModule } from "@nestjs/config";
import { NotificationConsumerModule } from "../consumer/notification-consumer.module";
import { NotificationModule } from "../notification/notification.module";

@Module({
  imports: [
    MongoDatabaseModule,
    NotificationModelModule,
    ConfigModule.forRoot({ isGlobal: true }),
    NotificationConsumerModule,
    NotificationModule,
  ],
})
export class AppModule {}
