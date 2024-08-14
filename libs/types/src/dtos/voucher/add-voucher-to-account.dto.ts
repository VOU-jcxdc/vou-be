import { IsNumber, IsUUID } from "class-validator";

export class AddVoucherToAccountDto {
  @IsUUID(4, { message: "eventVoucherId must be a valid UUID" })
  eventVoucherId: string;

  @IsNumber({ allowInfinity: false }, { message: "quantity must be a number" })
  quantity: number;
}
