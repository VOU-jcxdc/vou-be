import { PartialType } from "@nestjs/mapped-types";
import { VoucherDetailDto } from "./create-voucher.dto";

export class UpdateVoucherDto extends PartialType(VoucherDetailDto) {}
