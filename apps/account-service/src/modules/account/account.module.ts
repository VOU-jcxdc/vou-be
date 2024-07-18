import { Module } from "@nestjs/common";
import { AccountController } from "./account.controller";
import { AccountService } from "./account.service";
import { AccountRepositoryModule } from "../repository/account-repository.module";

@Module({
  imports: [AccountRepositoryModule],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
