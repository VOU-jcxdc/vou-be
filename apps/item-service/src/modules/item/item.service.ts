import { Injectable, Logger } from "@nestjs/common";
import { ItemRepository } from "../repository/item.repository";
import { CreateItemDto, ItemTypeEnum, UpdateItemDto } from "@types";
import { RpcException } from "@nestjs/microservices";
import { AccountItemRepository } from "../repository/account-item.repository";
import { CombineItemModel } from "../model/combine_item.model";
import { CombineItemHelper } from "../combine-item/combine_item.helper";

import { AccountItemHelper } from "./account-item.helper";
import { ItemHelper } from "./item.helper";
@Injectable()
export class ItemService {
  private readonly logger: Logger = new Logger(ItemService.name);
  constructor(
    private readonly itemRepository: ItemRepository,
    private readonly accountItemRepository: AccountItemRepository,
    private readonly accountItemHelper: AccountItemHelper,
    private readonly itemHelper: ItemHelper,
    private readonly combineItemModel: CombineItemModel,
    private readonly combineItemHelper: CombineItemHelper
  ) {}

  async createItems({ items, eventId }: CreateItemDto & { eventId: string }) {
    try {
      const populatedItems = items.map((item) => {
        return {
          ...item,
          eventId,
        };
      });
      const savedItems = await this.itemRepository.saveMany(populatedItems);
      return savedItems;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async getItemsByEventId(eventId: string) {
    try {
      const items = await this.itemRepository.findAll({
        where: { eventId },
      });

      // Using Promise.all to wait for all async operations
      const mapped = await Promise.all(
        items.map(async (item) => {
          return this.itemHelper.buildResponseWithOriginalQuantity(item);
        })
      );

      console.log("Mapped", mapped);
      return mapped;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async getItemDetail(itemId: string) {
    try {
      const item = await this.itemRepository.findOne({ where: { id: itemId } });
      return this.itemHelper.buildResponseWithOriginalQuantity(item);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async updateItemDetail(itemId: string, data: UpdateItemDto) {
    try {
      return this.itemRepository.updateOne({ where: { id: itemId } }, data);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async deleteItemInEvent(itemId: string) {
    try {
      return this.itemRepository.delete({ id: itemId });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  private async createAccountItem(accountId: string, itemId: string, quantity: number) {
    try {
      const newAccountItem = {
        accountId,
        itemId,
        quantity,
      };
      return await this.accountItemRepository.save(newAccountItem);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  private async updateAccountItem(accountId: string, itemId: string, quantity: number) {
    try {
      return await this.accountItemRepository.updateOne(
        {
          where: {
            accountId,
            itemId,
          },
        },
        { quantity }
      );
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
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
      throw new RpcException(error);
    }
  }

  async getAccountItemByAccountId(accountId: string) {
    try {
      return this.accountItemRepository.findAll({
        where: { accountId },
        relations: {
          item: true,
        },
        select: ["id", "status", "assignedDate", "quantity"],
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async receiveItem(accountId: string, itemId: string, quantity: number) {
    try {
      await this.itemRepository.checkExisted({ id: itemId });
      const accountItem = await this.accountItemRepository.findOne({ where: { accountId, itemId } });
      if (accountItem) return this.updateAccountItem(accountId, itemId, accountItem.quantity + quantity);
      else return this.createAccountItem(accountId, itemId, quantity);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async loseItem(accountId: string, itemId: string, quantity: number) {
    try {
      const accountItem = await this.accountItemRepository.checkAvailableStock({ accountId, itemId }, quantity);
      return this.accountItemRepository.updateOne(
        { where: { accountId, itemId } },
        { quantity: accountItem.quantity - quantity }
      );
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async receiveItemFromSystem(accountId: string, eventId: string) {
    try {
      const stockItem = await this.itemRepository.getRandomItemByEventId(eventId);
      const receivedItem = await this.receiveItem(accountId, stockItem.id, 1);
      await this.updateItemDetail(stockItem.id, { quantity: stockItem.quantity - 1 });
      return this.accountItemHelper.buildResponse(receivedItem);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async getCraftableRecipesForItem(id: string) {
    try {
      const data = await this.combineItemModel.find({
        itemRecipe: { $elemMatch: { itemId: id } },
      });
      const responseData = data.map((it) => this.combineItemHelper.buildResponseData(it));
      return Promise.all(responseData);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async isConfigItem(itemId: string) {
    try {
      const item = await this.itemRepository.findOne({ where: { id: itemId } });
      return item.type === ItemTypeEnum.CONFIG;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }
}
