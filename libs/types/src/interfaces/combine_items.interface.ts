import { CombineItemTypeEnum } from "../enums";

export interface IItemRecipe {
  itemId: string;
  quantity: number;
}

export interface ICombineItems {
  eventId: string;
  itemRecipe: IItemRecipe[];
  targetType: CombineItemTypeEnum;
  targetId: string;
  createdOn: Date;
  updatedOn: Date;
}
