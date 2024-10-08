import { ItemStatusEnum, ItemTypeEnum } from "../enums";

export interface IItem {
  id: string;
  name: string;
  imageId: string;
  eventId: string;
  type: ItemTypeEnum;
  status: ItemStatusEnum;
  createdOn: Date;
  updatedOn: Date;
  quantity: number;
}
