import { Injectable, Logger } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { CreateRecipeDto, GetAvaibleRecipesForItemsDto, ICurrentUser, UpdateRecipeDto } from "@types";
import { CombineItemModel } from "../model/combine_item.model";
import { Types } from "mongoose";
import { ItemHelper } from "./item.helper";
import { CombineItems } from "@database";

@Injectable()
export class ItemService {
  private readonly logger = new Logger(ItemService.name);

  constructor(private readonly combineItemsModel: CombineItemModel, private readonly itemHelper: ItemHelper) {}

  async createRecipe(dto: CreateRecipeDto) {
    try {
      const mappedDto = dto as CombineItems;
      const data = await this.combineItemsModel.save(mappedDto);
      return this.itemHelper.buildResponseData(data);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async updateRecipe(req: UpdateRecipeDto & { id: string }) {
    try {
      const { id, ...dto } = req;
      const data = await this.combineItemsModel.findByIdAndUpdate(Types.ObjectId.createFromHexString(id), dto);
      return this.itemHelper.buildResponseData(data);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async getRecipe(id: string) {
    try {
      const data = await this.combineItemsModel.findById(Types.ObjectId.createFromHexString(id));
      return this.itemHelper.buildResponseData(data);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async getRecipesInEvent(eventId: string) {
    try {
      const data = await this.combineItemsModel.find({
        eventId: eventId,
      });
      return data.map((it) => this.itemHelper.buildResponseData(it));
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async getAvaibleRecipesForItems(dto: GetAvaibleRecipesForItemsDto) {
    try {
      const data = await this.combineItemsModel.find({
        itemRecipe: { $elemMatch: { itemId: { $in: dto.items } } },
      });
      return data.map((it) => this.itemHelper.buildResponseData(it));
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async deleteRecipe(id: string) {
    try {
      const data = await this.combineItemsModel.findByIdAndDelete(Types.ObjectId.createFromHexString(id));
      return {
        affected: data ? 1 : 0,
      };
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }
}
