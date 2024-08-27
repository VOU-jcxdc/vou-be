import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GiftService } from "./gift.service";
import { GiftRepositoryModule } from "../repository/gift-repository.module";
import { AccountItemService } from "../account-item/account-item.service";
// import { ItemController } from "./item.controller";

@Module({
  imports: [GiftRepositoryModule, AccountItemService, ConfigModule],
  //   controllers: [ItemController],
  providers: [GiftService],
})
export class GiftModule {}
