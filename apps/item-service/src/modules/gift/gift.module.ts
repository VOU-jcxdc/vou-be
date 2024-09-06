import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GiftService } from "./gift.service";
import { GiftRepositoryModule } from "../repository/gift-repository.module";
import { ItemModule } from "../item/item.module";
import { GiftController } from "./gift.controller";
import { GameConfigModule } from "../config/config.module";

@Module({
  imports: [GiftRepositoryModule, ItemModule, ConfigModule, GameConfigModule],
  controllers: [GiftController],
  providers: [GiftService],
})
export class GiftModule {}
