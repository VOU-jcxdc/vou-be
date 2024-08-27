import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ItemRepository } from "../repository/item.repository";
import { CreateItemDto, UpdateItemDto } from "@types";
import { RpcException } from "@nestjs/microservices";
import { CombineItemModel } from "../model/combine_item.model";
import { CombineItemHelper } from "../combine-item/combine_item.helper";

@Injectable()
export class ItemService {
  private readonly logger: Logger = new Logger(ItemService.name);
  constructor(
    private readonly itemRepository: ItemRepository,

    private readonly combineItemModel: CombineItemModel,
    private readonly combineItemHelper: CombineItemHelper
  ) {}

  async createItem(value: CreateItemDto) {
    try {
      const savedItem = await this.itemRepository.save(value);
      return savedItem;
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

  async updateItemDetail(itemId: string, data: UpdateItemDto) {
    try {
      return this.itemRepository.updateOne({ where: { id: itemId } }, data);
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async deleteItemsInEvent(eventId: string, itemIds: string[]) {
    try {
      return this.itemRepository.deleteItemsInEvent(eventId, itemIds);
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
