import { IsDateString, IsString, IsUUID, ValidateNested } from "class-validator";
import { VoucherDetailDto } from "../voucher/create-voucher.dto";
import { Type } from "class-transformer";

export class CreateEventDto {
  @IsString()
  name: string;

  @IsUUID("4", { each: true })
  images: string[];

  @IsDateString()
  beginDate: Date;

  @IsDateString()
  endDate: Date;

  @IsString()
  description: string;

  @ValidateNested({ each: true })
  @Type(() => VoucherDetailDto)
  vouchers: VoucherDetailDto[];
}
