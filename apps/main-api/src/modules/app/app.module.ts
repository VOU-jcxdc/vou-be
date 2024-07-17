import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { RabbitmqModule, RedisModule } from "@shared-modules";
import { PostgreDatabaseModule } from "@database";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), RabbitmqModule, RedisModule, PostgreDatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
