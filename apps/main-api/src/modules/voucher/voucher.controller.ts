import { Body, Controller, Delete, Param, Put, UseGuards } from "@nestjs/common";
import { VoucherService } from "./voucher.service";
import { JwtAuthGuard, RoleGuard } from "../../guard";
import { AccountRoleEnum, UpdateVoucherDto } from "@types";
import { Roles } from "../../decorators/roles.decorator";

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller("vouchers")
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Put(":voucherId")
  @Roles(AccountRoleEnum.BRAND)
  async updateVoucherDetail(@Param("voucherId") voucherId: string, @Body() data: UpdateVoucherDto) {
    return this.voucherService.updateVoucherDetail(voucherId, data);
  }
}
