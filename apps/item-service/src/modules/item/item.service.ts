import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ItemRepository } from "../repository/item.repository";
import { CreateItemDto, UpdateItemDto } from "@types";
import { RpcException } from "@nestjs/microservices";
import { AccountItemRepository } from "../repository/account-item.repository";
import { CombineItemModel } from "../model/combine_item.model";
import { CombineItemHelper } from "../combine-item/combine_item.helper";

@Injectable()
export class ItemService {
  private readonly logger: Logger = new Logger(ItemService.name);
  constructor(
    private readonly itemRepository: ItemRepository,
    private readonly accountItemRepository: AccountItemRepository,
    private readonly combineItemModel: CombineItemModel,
    private readonly combineItemHelper: CombineItemHelper
  ) {}

  async createItems({ items }: CreateItemDto) {
    try {
      const savedItems = await this.itemRepository.saveMany(items);
      return savedItems;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async getItemsByEventId(eventId: string) {
    try {
      return this.itemRepository.findAll({
        where: { eventId },
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async getItemDetail(itemId: string) {
    try {
      return this.itemRepository.findOne({ where: { id: itemId } });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async updateItemDetail(itemId: string, data: UpdateItemDto) {
    try {
      return this.itemRepository.updateOne({ where: { id: itemId } }, data);
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async deleteItemInEvent(itemId: string) {
    try {
      return this.itemRepository.delete({ id: itemId });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  private async createAccountItem(accountId: string, itemId: string, quantity: number) {
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

  private async updateAccountItem(accountId: string, itemId: string, quantity: number) {
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

  async receiveItem(accountId: string, itemId: string, quantity: number) {
    try {
      const accountItem = await this.accountItemRepository.findOne({ where: { accountId, itemId } });
      if (accountItem) return this.updateAccountItem(accountId, itemId, quantity);
      else return this.createAccountItem(accountId, itemId, quantity);
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async loseItem(accountId: string, itemId: string, quantity: number) {
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

  async receiveItemFromSystem(accountId: string, itemId: string, quantity: number) {
    try {
      const stockItem = await this.itemRepository.findOne({ where: { id: itemId } });
      if (!stockItem || stockItem.quantity - quantity < 0) throw new BadRequestException("No item left");
      await this.updateItemDetail(itemId, { quantity: stockItem.quantity - quantity });
      return this.receiveItem(accountId, itemId, quantity);
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async getCraftableRecipesForItem(id: string) {
    try {
      const data = await this.combineItemModel.find({
        itemRecipe: { $elemMatch: { itemId: id } },
      });
      return data.map((it) => this.combineItemHelper.buildResponseData(it));
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }
}
