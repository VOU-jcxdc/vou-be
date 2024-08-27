import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ItemService } from "./item.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CreateItemDto, ReceiveItemDto, UpdateItemDto } from "@types";

@Controller("items")
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @MessagePattern({ method: "GET", path: "/items/:id/recipes" })
  getCraftableRecipesForItem(@Payload() { id }: { id: string }) {
    return this.itemService.getCraftableRecipesForItem(id);
  }

  @Get(":eventId")
  getItemsByEventId(@Param() { eventId }: { eventId: string }) {
    return this.itemService.getItemsByEventId(eventId);
  }

  @Post()
  createItems(@Body() data: CreateItemDto) {
    return this.itemService.createItems(data);
  }

  @Put(":itemId")
  updateItemDetail(@Param() { itemId }: { itemId: string }, @Body() data: UpdateItemDto) {
    return this.itemService.updateItemDetail(itemId, data);
  }

  @Delete(":itemId")
  deleteItemsInEvent(@Param() { itemId }: { itemId: string }) {
    return this.itemService.deleteItemInEvent(itemId);
  }

  @Post("system")
  receiveItem(@Body() data: ReceiveItemDto) {
    const { accountId, itemId, quantity } = data;
    return this.itemService.receiveItemFromSystem(accountId, itemId, quantity);
  }
}
