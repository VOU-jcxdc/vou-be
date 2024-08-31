import { IsUUID } from "class-validator";

export class ReceiveItemDto {
  @IsUUID("4", { message: "Account must be a valid UUID" })
  accountId: string;

  @IsUUID("4", { message: "Item must be a valid UUID" })
  eventId: string;
}
