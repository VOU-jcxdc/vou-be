import { BaseRepository, Item } from "@database";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class ItemRepository extends BaseRepository<Item> {
  constructor(@InjectRepository(Item) repository: Repository<Item>) {
    super(repository);
  }
}
