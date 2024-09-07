import { Injectable } from "@nestjs/common";
import { Item } from "@database";
import { AccountItemRepository } from "../repository/account-item.repository";

@Injectable()
export class ItemHelper {
  constructor(private readonly accountItemRepository: AccountItemRepository) {}

  async buildResponseWithOriginalQuantity(origin: Item) {
    const total = await this.accountItemRepository.countTotalItems(origin.id);
    return {
      ...origin,
      originalQuantity: total + origin.quantity,
    };
  }
}
