import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CreateCombineItemDto } from "@types";
import { CombineItemService } from "./combine-item.service";

@Controller()
export class CombineItemController {
  constructor(private readonly combineItemService: CombineItemService) {}

  @MessagePattern({ method: "POST", path: "/items/combine-items" })
  combineItems(@Payload() data: { userId: string } & CreateCombineItemDto) {
    return this.combineItemService.combineItems(data);
  }
}
