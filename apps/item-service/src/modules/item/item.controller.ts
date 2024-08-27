import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ItemService } from "./item.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CreateItemDto, DeleteItemsDto, UpdateItemDto } from "@types";

@Controller("items")
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @MessagePattern({ method: "GET", path: "/items/:id/recipes" })
  getCraftableRecipesForItem(@Payload() { id }: { id: string }) {
    return this.itemService.getCraftableRecipesForItem(id);
  }

  @Get()
  getItemsByEventId(@Body() { eventId }: { eventId: string }) {
    return this.itemService.getItemsByEventId(eventId);
  }

  @Post()
  createItem(@Body() data: CreateItemDto) {
    return this.itemService.createItem(data);
  }

  @Put(":itemId")
  updateItemDetail(@Param() itemId: string, @Body() data: UpdateItemDto) {
    return this.itemService.updateItemDetail(itemId, data);
  }

  @Delete()
  deleteItemsInEvent(@Body() data: { eventId: string } & DeleteItemsDto) {
    const { eventId, itemIds } = data;
    return this.itemService.deleteItemsInEvent(eventId, itemIds);
  }
}
