import { CombineItems } from "@database";
import { Injectable } from "@nestjs/common";
import { Document } from "mongoose";
import { ItemRepository } from "../repository/item.repository";

@Injectable()
export class CombineItemHelper {
  constructor(private readonly itemRepository: ItemRepository) {}
  async buildResponseData(rawData: Document<unknown, {}, CombineItems> & CombineItems & Required<{ _id: unknown }>) {
    const data = rawData.toObject();
    const { _id, updatedOn, createdOn, targetId, __v, ...restData } = data;

    const items = data.itemRecipe.map(async (it) => {
      const item = await this.itemRepository.findOne({ where: { id: it.itemId } });
      return {
        ...it,
        name: item.name,
        imageId: item.imageId,
      };
    });

    const target = await this.itemRepository.findOne({ where: { id: targetId } });

    return {
      id: _id,
      ...restData,
      itemRecipe: await Promise.all(items),
      target: {
        id: targetId,
        name: target.name,
        imageId: target.imageId,
      },
    };
  }
}