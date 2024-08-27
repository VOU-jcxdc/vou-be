import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { AccountItemRepository } from "../repository/account-item.repository";
import { ItemService } from "../item/item.service";
import { ItemRepository } from "../repository/item.repository";

@Injectable()
export class AccountItemService {
  private readonly logger: Logger = new Logger(AccountItemService.name);
  constructor(
    private readonly accountItemRepository: AccountItemRepository,
    private readonly itemService: ItemService,
    private readonly itemRepository: ItemRepository
  ) {}

  async getAccountItems(accountId: string) {
    try {
      return this.accountItemRepository.findAll({
        where: { accountId },
        relations: {
          item: true,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async getAccountItemByItemId(accountId: string, itemId: string) {
    try {
      return this.accountItemRepository.findOne({
        where: { accountId, itemId },
        relations: {
          item: true,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async createAccountItem(accountId: string, itemId: string, quantity: number) {
    try {
      const item = await this.itemRepository.findOne({ where: { id: itemId } });
      if (!item) throw new NotFoundException("Item not existed");
      const newAccountItem = {
        accountId,
        itemId,
        quantity,
      };
      return await this.accountItemRepository.save(newAccountItem);
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async updateAccountItem(accountId: string, itemId: string, quantity: number) {
    try {
      const item = await this.itemRepository.findOne({ where: { id: itemId } });
      if (!item) throw new NotFoundException("Item not existed");
      const newAccountItem = {
        accountId,
        itemId,
        quantity,
      };
      return await this.accountItemRepository.updateOne(
        {
          where: {
            accountId,
            itemId,
          },
        },
        newAccountItem
      );
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async receiveItems(accountId: string, itemId: string, quantity: number) {
    try {
      const accountItem = await this.accountItemRepository.findOne({ where: { accountId, itemId } });
      if (accountItem) return this.updateAccountItem(accountId, itemId, quantity);
      else return this.createAccountItem(accountId, itemId, quantity);
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async loseItems(accountId: string, itemId: string, quantity: number) {
    try {
      const accountItem = await this.accountItemRepository.findOne({ where: { accountId, itemId } });
      if (!accountItem) throw new NotFoundException("This account doesn't have the item");
      if (accountItem.quantity < quantity) throw new BadRequestException("Not enough quantity of the requested item");
      return this.accountItemRepository.save({
        ...accountItem,
        quantity: accountItem.quantity - quantity,
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }
}
