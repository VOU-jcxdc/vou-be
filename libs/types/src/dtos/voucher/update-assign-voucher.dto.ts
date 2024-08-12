import { IsEnum, IsNumber, IsOptional, ValidateIf } from "class-validator";
import { VoucherStatus } from "../../enums";
import { isNil } from "lodash";

export class UpdateAsssignVoucherDto {
  @IsOptional()
  @ValidateIf((data) => !isNil(data.quantity))
  @IsNumber({ allowInfinity: false }, { message: "quantity must be a number" })
  quantity: number;

  @IsOptional()
  @ValidateIf((data) => !isNil(data.status))
  @IsEnum(VoucherStatus, { message: "status must be either 'active', 'inactive', or 'expired'" })
  status: VoucherStatus;
}
