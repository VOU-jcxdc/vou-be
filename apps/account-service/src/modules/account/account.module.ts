import { Module } from "@nestjs/common";
import { AccountController } from "./account.controller";
import { AccountService } from "./account.service";
import { AccountRepositoryModule } from "../repository/account-repository.module";
import { AccountHelper } from "./account.helper";
import { ConfigModule } from "@nestjs/config";
import { GameConfigModule } from "../config/config.module";

@Module({
  imports: [AccountRepositoryModule, ConfigModule, GameConfigModule],
  controllers: [AccountController],
  providers: [AccountService, AccountHelper],
})
export class AccountModule {}
