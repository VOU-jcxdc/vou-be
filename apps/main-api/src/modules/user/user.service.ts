import { Inject, Injectable } from "@nestjs/common";
import { ClientOptions, ClientProxy, ClientProxyFactory } from "@nestjs/microservices";
import {
  AccountRoleEnum,
  USER_SERVICE_PROVIDER_NAME,
  UdpateAccountDto,
  UpdateAccountByAdminDto,
  UpdateAsssignVoucherDto,
  VOUCHER_SERVICE_PROVIDER_NAME,
} from "@types";

@Injectable()
export class UserService {
  private client: ClientProxy;
  private clientVoucher: ClientProxy;

  constructor(
    @Inject(USER_SERVICE_PROVIDER_NAME) options: ClientOptions,
    @Inject(VOUCHER_SERVICE_PROVIDER_NAME) optionsVoucher: ClientOptions
  ) {
    this.client = ClientProxyFactory.create(options);
    this.clientVoucher = ClientProxyFactory.create(optionsVoucher);
  }

  async getUserInfoWithRole(id: string, role: AccountRoleEnum) {
    return this.client.send({ method: "GET", path: "/account/:id?role=${role}" }, { id, role });
  }

  async getUsers(offset: number, limit: number, role: AccountRoleEnum = undefined) {
    return this.client.send({ method: "GET", path: "/accounts" }, { offset, limit, role });
  }

  async getUserInfo(id: string) {
    return this.client.send({ method: "GET", path: "/account/:id" }, { id });
  }

  async getVouchers(id: string) {
    return this.clientVoucher.send({ method: "GET", path: "/vouchers/account/:id/vouchers" }, { id });
  }

  async updateAccountVoucherStatus(accountVoucherId: string, accountId: string, body: UpdateAsssignVoucherDto) {
    const { quantity, status } = body;
    return this.clientVoucher.send(
      { method: "PUT", path: "/vouchers/account/:accountVoucherId" },
      { accountVoucherId, accountId, quantity, status }
    );
  }

  async updateAccountByAdmin(id: string, body: UpdateAccountByAdminDto) {
    return this.client.send({ method: "PUT", path: "admin/account/:id" }, { id, body });
  }

  async updateAccountByUser(id: string, body: UdpateAccountDto) {
    return this.client.send({ method: "PUT", path: "/account/:id" }, { id, body });
  }
}
