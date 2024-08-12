import { Controller, Param } from "@nestjs/common";
import { VoucherService } from "./voucher.service";
import {
  AddVoucherToAccountDto,
  CreateVoucherDto,
  DeleteVoucherDto,
  UpdateAsssignVoucherDto,
  UpdateVoucherDto,
} from "@types";
import { MessagePattern, Payload } from "@nestjs/microservices";

@Controller("vouchers")
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @MessagePattern({ method: "GET", path: "vouchers/account/:id/vouchers" })
  getVouchersByAccountId(@Payload() data: { id: string }) {
    return this.voucherService.getAccountVouchers(data.id);
  }

  @MessagePattern({ method: "GET", path: "vouchers/:eventId" })
  getVouchersByEventId(@Param("eventId") eventId: string) {
    return this.voucherService.getVouchersByEventId(eventId);
  }

  @MessagePattern({ method: "POST", path: "vouchers" })
  createVouchers(@Payload() data: CreateVoucherDto) {
    return this.voucherService.createVouchers(data);
  }

  @MessagePattern({ method: "POST", path: "vouchers/assigning" })
  assignVoucher(@Payload() data: AddVoucherToAccountDto & { accountId: string }) {
    const { accountId, ...rest } = data;
    return this.voucherService.upsertAccountVoucher(accountId, rest);
  }

  @MessagePattern({ method: "PUT", path: "vouchers/:voucherId" })
  updateVoucherDetail(@Payload() data: UpdateVoucherDto & { voucherId: string }) {
    const { voucherId, ...rest } = data;
    return this.voucherService.updateVoucherDetail(voucherId, rest);
  }

  @MessagePattern({ method: "PUT", path: "vouchers/account/:accountVoucherId" })
  updateAccountVoucherStatus(
    @Payload() data: { accountVoucherId: string } & { accountId: string } & UpdateAsssignVoucherDto
  ) {
    const { accountVoucherId, accountId, ...rest } = data;
    return this.voucherService.updateAccountVoucherStatus(accountVoucherId, accountId, rest);
  }

  @MessagePattern({ method: "DELETE", path: "vouchers" })
  deleteVouchersInEvent(@Payload() data: { eventId: string } & DeleteVoucherDto) {
    const { eventId, voucherIds } = data;
    return this.voucherService.deleteVouchersInEvent(eventId, voucherIds);
  }
}
