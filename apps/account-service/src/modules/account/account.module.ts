import { Module } from "@nestjs/common";
import { AccountController } from "./account.controller";
import { AccountService } from "./account.service";
import { AccountRepositoryModule } from "../repository/account-repository.module";
import { AccountHelper } from "./account.helper";

@Module({
  imports: [AccountRepositoryModule],
  controllers: [AccountController],
  providers: [AccountService, AccountHelper],
})
export class AccountModule {}
