import { Injectable, Logger } from "@nestjs/common";
import { CombineItemModel } from "../model/combine_item.model";
import { RpcException } from "@nestjs/microservices";
import { CombineItemHelper } from "../combine-item/combine_item.helper";

@Injectable()
export class ItemService {
  private readonly logger = new Logger(ItemService.name);

  constructor(
    private readonly combineItemModel: CombineItemModel,
    private readonly combineItemHelper: CombineItemHelper
  ) {}

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
