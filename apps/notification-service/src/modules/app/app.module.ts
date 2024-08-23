import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongoDatabaseModule } from "@database";
import { NotificationModelModule } from "../model/notification-model.module";

@Module({
  imports: [MongoDatabaseModule, NotificationModelModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
