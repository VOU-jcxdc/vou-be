import { IsNumber, IsUUID } from "class-validator";

export class ReceiveItemDto {
  @IsUUID("4", { message: "Account must be a valid UUID" })
  accountId: string;

  @IsUUID("4", { message: "Item must be a valid UUID" })
  itemId: string;

  @IsNumber({ allowInfinity: false }, { message: "Quantity must be an integer" })
  quantity: number;
}
