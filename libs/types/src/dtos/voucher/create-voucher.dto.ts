import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsUUID, ValidateNested } from "class-validator";
import { VoucherType } from "../../enums";
import { Transform, Type } from "class-transformer";
import moment from "moment";

export class VoucherDetailDto {
  @IsNotEmpty({ message: "description is required" })
  description: string;

  @IsNotEmpty({ message: "name is required" })
  name: string;

  @IsNotEmpty({ message: "code is required" })
  code: string;

  @IsEnum(VoucherType, { message: "type must be either 'amount' or 'percent'" })
  type: VoucherType;

  @IsNumber({ allowInfinity: false }, { message: "value must be a number" })
  value: number;

  @Transform(({ value }) => {
    const date = moment.utc(value, "YYYY-MM-DD", true);
    if (!date.isValid()) {
      throw new Error("exp must be a date");
    }
    return date.toDate();
  })
  @IsDate({ message: "exp must be a date" })
  exp: Date;

  @IsNumber({ allowInfinity: false }, { message: "quantity must be a number" })
  quantity: number;
}

export class CreateVoucherDto {
  @IsUUID(4, { message: "eventId must be a valid UUID" })
  eventId: string;

  @ValidateNested({ each: true })
  @Type(() => VoucherDetailDto)
  vouchers: VoucherDetailDto[];
}
