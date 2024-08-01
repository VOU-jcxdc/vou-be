import { ItemStatusEnum, ItemTypeEnum } from "../enums";

export interface IItem {
  name: string;
  imageId: string;
  gameId: string;
  type: ItemTypeEnum;
  status: ItemStatusEnum;
  createdOn: Date;
  updatedOn: Date;
}
