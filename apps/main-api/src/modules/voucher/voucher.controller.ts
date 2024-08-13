import { Body, Controller, Delete, Param, Post, Put, UseGuards } from "@nestjs/common";
import { VoucherService } from "./voucher.service";
import { JwtAuthGuard, RoleGuard } from "../../guard";
import { AccountRoleEnum, CreateVoucherDto, DeleteVoucherDto, UpdateVoucherDto } from "@types";
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

  @Post()
  @Roles(AccountRoleEnum.BRAND)
  async createVouchers(@Body() data: CreateVoucherDto) {
    return this.voucherService.createVouchers(data);
  }

  @Delete()
  @Roles(AccountRoleEnum.BRAND)
  async deleteVouchers(@Body() data: DeleteVoucherDto & { eventId: string }) {
    return this.voucherService.deleteVouchers(data);
  }
}
