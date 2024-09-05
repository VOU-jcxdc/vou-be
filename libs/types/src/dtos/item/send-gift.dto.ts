import { IsUUID } from "class-validator";
export class SendGiftGatewayDto {
  @IsUUID("4", { message: "receiver must be a valid UUID" })
  receiverId: string;

  @IsUUID("4", { message: "item must be a valid UUID" })
  itemId: string;

  @IsUUID("4", { message: "event must be a valid UUID" })
  eventId: string;
}

export class SendGiftDto extends SendGiftGatewayDto {
  @IsUUID("4", { message: "sender must be a valid UUID" })
  senderId: string;
}
