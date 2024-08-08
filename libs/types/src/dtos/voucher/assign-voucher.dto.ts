import { IsNumber, IsUUID } from "class-validator";

export class AssignVoucherDto {
  @IsUUID(4, { message: "voucherId must be a valid UUID" })
  accountId: string;

  @IsUUID(4, { message: "eventId must be a valid UUID" })
  eventId: string;

  @IsNumber({ allowInfinity: false }, { message: "quantity must be a number" })
  quantity: number;
}
