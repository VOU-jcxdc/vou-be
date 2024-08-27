import { Module } from "@nestjs/common";
import { CombineItemController } from "./combine_item.controller";
import { CombineItemService } from "./combine_item.service";
import { ClientProxyModule } from "@shared-modules";

@Module({
  imports: [ClientProxyModule],
  controllers: [CombineItemController],
  providers: [CombineItemService],
})
export class ItemModule {}
