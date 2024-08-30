import { BaseRepository, Item } from "@database";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IItem } from "@types";
import { Repository } from "typeorm";

@Injectable()
export class ItemRepository extends BaseRepository<Item> {
  constructor(@InjectRepository(Item) repository: Repository<Item>) {
    super(repository);
  }

  async checkExisted(data: Partial<IItem>) {
    const item = await this.repository.findOne({ where: data });
    if (!item) throw new NotFoundException("No item existed");
    return item;
  }

  async checkAvailableStock(data: Partial<IItem>, expectedQuantity: number) {
    const item = await this.checkExisted(data);
    if (item.quantity < expectedQuantity) throw new BadRequestException("Not enough quantity of the requested item");
    return item;
  }
}
