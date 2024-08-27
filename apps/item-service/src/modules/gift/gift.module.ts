import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GiftService } from "./gift.service";
import { GiftRepositoryModule } from "../repository/gift-repository.module";
import { ItemModule } from "../item/item.module";
import { GiftController } from "./gift.controller";

@Module({
  imports: [GiftRepositoryModule, ItemModule, ConfigModule],
  controllers: [GiftController],
  providers: [GiftService],
})
export class GiftModule {}
