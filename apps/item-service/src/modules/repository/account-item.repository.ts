import { BaseRepository, AccountItem } from "@database";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IAccountItem } from "@types";
import { Repository } from "typeorm";

@Injectable()
export class AccountItemRepository extends BaseRepository<AccountItem> {
  constructor(@InjectRepository(AccountItem) repository: Repository<AccountItem>) {
    super(repository);
  }

  async checkExisted(data: Partial<IAccountItem>) {
    const accountItem = await this.repository.findOne({ where: data });
    if (!accountItem) throw new NotFoundException("No item existed");
    return accountItem;
  }

  async checkAvailableStock(data: Partial<IAccountItem>, expectedQuantity: number) {
    const accountItem = await this.checkExisted(data);
    if (accountItem.quantity < expectedQuantity)
      throw new BadRequestException("Not enough quantity of the requested item");
    return accountItem;
  }
}
