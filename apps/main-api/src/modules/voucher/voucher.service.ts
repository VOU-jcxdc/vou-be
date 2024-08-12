import { Inject, Injectable } from "@nestjs/common";
import { ClientOptions, ClientProxy, ClientProxyFactory } from "@nestjs/microservices";
import { UpdateVoucherDto, VOUCHER_SERVICE_PROVIDER_NAME } from "@types";

@Injectable()
export class VoucherService {
  private voucherClient: ClientProxy;
  constructor(@Inject(VOUCHER_SERVICE_PROVIDER_NAME) optionVoucher: ClientOptions) {
    this.voucherClient = ClientProxyFactory.create(optionVoucher);
  }

  async updateVoucherDetail(voucherId: string, data: UpdateVoucherDto) {
    return this.voucherClient.send({ method: "PUT", path: "vouchers/:voucherId" }, { voucherId, ...data });
  }
}
