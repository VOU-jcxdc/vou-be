import { Injectable, Logger } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { CreateRecipeDto, ItemStatusEnum, UpdateRecipeDto } from "@types";
import { CombineItemModel } from "../model/combine_item.model";
import { Types } from "mongoose";
import { CombineItemHelper } from "./combine_item.helper";
import { CombineItems } from "@database";
import { ItemRepository } from "../repository/item.repository";

@Injectable()
export class CombineItemService {
  private readonly logger = new Logger(CombineItemService.name);

  constructor(
    private readonly combineItemsModel: CombineItemModel,
    private readonly combineItemHelper: CombineItemHelper,
    private readonly itemRepository: ItemRepository
  ) {}

  async isCraftable(itemId: string, quantity: number) {
    try {
      const data = await this.itemRepository.findOne({ where: { id: itemId } });
      if (!data) throw new RpcException("Item not found");
      if (data.status === ItemStatusEnum.ACTIVE && data.quantity < quantity) return false;
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async createRecipe(dto: CreateRecipeDto) {
    try {
      const mappedDto = dto as CombineItems;

      const isCraftableConstraint = mappedDto.itemRecipe.map(async (it) => {
        return this.isCraftable(it.itemId, it.quantity);
      });

      isCraftableConstraint.push(this.isCraftable(mappedDto.targetId, 1));

      const resolvedConstraints = await Promise.all(isCraftableConstraint);
      if (resolvedConstraints.some((it) => it === false)) {
        throw new RpcException("Item not craftable");
      }

      const data = await this.combineItemsModel.save(mappedDto);
      return this.combineItemHelper.buildResponseData(data);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async updateRecipe(req: UpdateRecipeDto & { id: string }) {
    try {
      const { id, ...dto } = req;
      const data = await this.combineItemsModel.findByIdAndUpdate(Types.ObjectId.createFromHexString(id), dto);
      return this.combineItemHelper.buildResponseData(data);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async getRecipe(id: string) {
    try {
      const data = await this.combineItemsModel.findById(Types.ObjectId.createFromHexString(id));
      return this.combineItemHelper.buildResponseData(data);
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
      const result = data.map((it) => this.combineItemHelper.buildResponseData(it));
      return Promise.all(result);
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