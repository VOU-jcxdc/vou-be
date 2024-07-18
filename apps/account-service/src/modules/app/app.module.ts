import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";

import { PostgreDatabaseModule } from "@database";
import { AccountModule } from "../account/account.module";
import { ConfigModule } from "@nestjs/config";
import { AccountRepositoryModule } from "../repository/account-repository.module";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PostgreDatabaseModule, AccountRepositoryModule, AccountModule],
  controllers: [AppController],
})
export class AppModule {}
