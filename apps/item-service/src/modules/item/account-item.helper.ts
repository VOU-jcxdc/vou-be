import { Injectable } from "@nestjs/common";
import { ItemRepository } from "../repository/item.repository";
import { AccountItem } from "@database";
import { pick } from "lodash";

@Injectable()
export class AccountItemHelper {
  constructor(private readonly itemRepository: ItemRepository) {}

  async buildResponse(origin: AccountItem) {
    const item = await this.itemRepository.findOne({
      where: { id: origin.itemId },
      select: ["id", "eventId", "imageId", "name", "type", "status"],
    });
    return {
      ...pick(origin, ["id", "status", "assignedDate", "quantity"]),
      item,
    };
  }
}
