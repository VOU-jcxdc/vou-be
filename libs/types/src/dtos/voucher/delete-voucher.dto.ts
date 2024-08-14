import { IsUUID } from "class-validator";

export class DeleteVoucherDto {
  @IsUUID(4, { each: true, message: "voucherIds must be a valid UUID" })
  voucherIds: string[];
}
