import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { ItemService } from "./item.service";

@Controller()
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @MessagePattern({ method: "GET", path: "/items/:id/recipes" })
  getCraftableRecipesForItem(@Payload() { id }: { id: string }) {
    return this.itemService.getCraftableRecipesForItem(id);
  }
}
