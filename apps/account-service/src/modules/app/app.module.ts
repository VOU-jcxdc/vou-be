import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";

import { PostgreDatabaseModule } from "@database";
import { UserModule } from "../user/user.module";
import { ConfigModule } from "@nestjs/config";
import { UserRepositoryModule } from "../repository/user-repository.module";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PostgreDatabaseModule, UserRepositoryModule, UserModule],
  controllers: [AppController],
})
export class AppModule {}
