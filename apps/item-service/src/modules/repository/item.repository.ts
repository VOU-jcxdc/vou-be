import { BaseRepository, Item } from "@database";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class ItemRepository extends BaseRepository<Item> {
  constructor(@InjectRepository(Item) repository: Repository<Item>) {
    super(repository);
  }

  async deleteItemsInEvent(eventId: string, itemIds: string[]) {
    try {
      return this.repository
        .createQueryBuilder("items")
        .delete()
        .where("items.event_id = :eventId", { eventId })
        .andWhere("items.id IN (:...itemIds)", { itemIds })
        .execute();
    } catch (error) {
      throw error;
    }
  }
}
