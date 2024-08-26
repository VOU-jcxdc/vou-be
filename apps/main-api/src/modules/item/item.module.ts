import { Module } from "@nestjs/common";
import { ItemController } from "./item.controller";
import { ItemService } from "./item.service";
import { ClientProxyModule } from "@shared-modules";

@Module({
  imports: [ClientProxyModule],
  controllers: [ItemController],
  providers: [ItemService],
})
export class ItemModule {}
