import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from "@nestjs/common";
import { VoucherService } from "./voucher.service";
import {
  AssignVoucherDto,
  CreateVoucherDto,
  DeleteVoucherDto,
  UpdateAsssignVoucherDto,
  UpdateVoucherDto,
} from "@types";

@Controller("vouchers")
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Get(":eventId")
  getVouchersByEventId(@Param("eventId") eventId: string) {
    return this.voucherService.getVouchersByEventId(eventId);
  }

  @Post()
  createVouchers(@Body() data: CreateVoucherDto) {
    return this.voucherService.createVouchers(data);
  }

  @Post(":voucherId/assign")
  assignVoucher(@Param("voucherId") voucherId: string, @Body() data: AssignVoucherDto) {
    return this.voucherService.asignVoucherToAccount(voucherId, data);
  }

  @Put(":voucherId")
  updateVoucherDetail(@Param("voucherId") voucherId: string, @Body() data: UpdateVoucherDto) {
    return this.voucherService.updateVoucherDetail(voucherId, data);
  }

  @Put("account/:accountVoucherId")
  updateAccountVoucherStatus(
    @Param("accountVoucherId") accountVoucherId: string,
    @Body() data: UpdateAsssignVoucherDto
  ) {
    return this.voucherService.updateAccountVoucherStatus(accountVoucherId, data);
  }

  @Delete()
  deleteVouchersInEvent(@Query("eventId") eventId: string, @Body() data: DeleteVoucherDto) {
    return this.voucherService.deleteVouchersInEvent(eventId, data.voucherIds);
  }
}
