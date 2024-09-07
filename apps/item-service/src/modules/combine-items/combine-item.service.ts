import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { CombineItemTypeEnum, CreateCombineItemDto } from "@types";
import { CombineItemModel } from "../model/combine_item.model";
import { Types } from "mongoose";
import { AccountItemRepository } from "../repository/account-item.repository";

@Injectable()
export class CombineItemService {
  private readonly logger = new Logger(CombineItemService.name);

  constructor(
    private readonly combineItemsModel: CombineItemModel,
    private readonly accountItemRepository: AccountItemRepository,
    @Inject("RMQ_VOUCHER_SERVICE") private readonly voucherServiceClient: ClientProxy
  ) {}

  async combineItems(data: { userId: string } & CreateCombineItemDto) {
    try {
      const recipe = await this.combineItemsModel.findById(Types.ObjectId.createFromHexString(data.id));
      if (!recipe) throw new RpcException("Recipe not found");

      const accountItems = await Promise.all(
        recipe.itemRecipe.map(async (it) => {
          const item = await this.accountItemRepository.findOne({
            where: { accountId: data.userId, itemId: it.itemId },
          });

          if (!item) return false;
          return it.quantity <= item.quantity;
        })
      );

      // Check if all true
      if (accountItems.some((it) => it === false)) {
        throw new RpcException("Not enough quantity of the requested item");
      }

      // Deduct the quantity
      await Promise.all(
        recipe.itemRecipe.map(async (it) => {
          const item = await this.accountItemRepository.findOne({
            where: { accountId: data.userId, itemId: it.itemId },
          });
          item.quantity -= it.quantity;
          await item.save();
        })
      );

      // Add the new item if targetType is item
      if (recipe.targetType === CombineItemTypeEnum.ITEM) {
        const existedItem = await this.accountItemRepository.findOne({
          where: { accountId: data.userId, itemId: recipe.targetId },
        });
        if (existedItem) {
          existedItem.quantity++;
          await existedItem.save();
        } else {
          await this.accountItemRepository.save({
            accountId: data.userId,
            itemId: recipe.targetId,
            quantity: 1,
          });
        }
      }

      // Add the new item if targetType is voucher
      this.voucherServiceClient.emit(
        { method: "POST", path: "/vouchers/assigning" },
        {
          accountId: data.userId,
          eventVoucherId: recipe.targetId,
          quantity: 1,
        }
      );

      return "OK";
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }
}
