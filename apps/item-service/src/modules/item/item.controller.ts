import { Controller } from "@nestjs/common";
import { ItemService } from "./item.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CreateItemDto, ReceiveItemDto, UpdateItemDto } from "@types";
import { MessagePattern, Payload } from "@nestjs/microservices";

@Controller()
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @MessagePattern({ method: "GET", path: "/items/:id/recipes" })
  getCraftableRecipesForItem(@Payload() { id }: { id: string }) {
    return this.itemService.getCraftableRecipesForItem(id);
  }

  @MessagePattern({ method: "GET", path: "/items/:eventId" })
  getItemsByEventId(@Payload() { eventId }: { eventId: string }) {
    return this.itemService.getItemsByEventId(eventId);
  }

  @MessagePattern({ method: "POST", path: "/items" })
  createItems(@Payload() data: CreateItemDto & { eventId: string }) {
    return this.itemService.createItems(data);
  }

  @MessagePattern({ method: "PUT", path: "/items/:itemId" })
  updateItemDetail(@Payload() { itemId, ...data }: { itemId: string } & UpdateItemDto) {
    return this.itemService.updateItemDetail(itemId, data);
  }

  @MessagePattern({ method: "DELETE", path: "/items/:itemId" })
  deleteItemInEvent(@Payload() { itemId }: { itemId: string }) {
    return this.itemService.deleteItemInEvent(itemId);
  }

  @MessagePattern({ method: "POST", path: "/items/system" })
  receiveItem(@Payload() data: ReceiveItemDto) {
    const { accountId, eventId } = data;
    return this.itemService.receiveItemFromSystem(accountId, eventId);
  }

  @MessagePattern({ method: "GET", path: "/items/my-items" })
  getPlayerItems(@Payload("accountId") accountId: string) {
    return this.itemService.getAccountItemByAccountId(accountId);
  }
}
