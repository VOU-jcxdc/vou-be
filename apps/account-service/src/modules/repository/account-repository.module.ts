import { Module } from "@nestjs/common";
import { AccountRepository } from "./account.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Account } from "@database";
@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  providers: [AccountRepository],
  exports: [AccountRepository],
})
export class AccountRepositoryModule {}
