import { Module } from "@nestjs/common";
import { AccountRepository } from "./account.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Account, BrandInfo, PlayerInfo } from "@database";
import { BrandInfoRepository } from "./brand-info.repository";
import { PlayerInfoRepository } from "./player-info.repository";
@Module({
  imports: [TypeOrmModule.forFeature([Account, BrandInfo, PlayerInfo])],
  providers: [AccountRepository, BrandInfoRepository, PlayerInfoRepository],
  exports: [AccountRepository, BrandInfoRepository, PlayerInfoRepository],
})
export class AccountRepositoryModule {}
