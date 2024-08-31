import { IsNumber, IsUUID } from "class-validator";

export class CreateGiftRequestDto {
  @IsUUID("4", { message: "sender must be a valid UUID" })
  senderId: string;

  @IsUUID("4", { message: "receiver must be a valid UUID" })
  receiverId: string;

  @IsNumber({ allowInfinity: false }, { message: "Quantity must be an integer" })
  quantity: number;

  @IsUUID("4", { message: "item must be a valid UUID" })
  itemId: string;

  @IsUUID("4", { message: "item must be a valid UUID" })
  eventId: string;
}
