import { HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { ClientOptions, ClientProxy, ClientProxyFactory } from "@nestjs/microservices";
import {
  AccountRoleEnum,
  IAccountVoucher,
  ICurrentUser,
  USER_SERVICE_PROVIDER_NAME,
  UdpateAccountDto,
  UpdateAccountByAdminDto,
  UpdateAsssignVoucherDto,
  VOUCHER_SERVICE_PROVIDER_NAME,
} from "@types";
import { catchError, lastValueFrom } from "rxjs";

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

  async getVouchers(user: ICurrentUser) {
    try {
      if (user.role === AccountRoleEnum.PLAYER) {
        const accountVouchers = await lastValueFrom(
          this.clientVoucher.send({ method: "GET", path: "/vouchers/player/:id/vouchers" }, { id: user.userId }).pipe(
            catchError((error) => {
              const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
              const message = error.message || "An error occurred";
              throw new HttpException(message, statusCode);
            })
          )
        );
        return Promise.all(
          accountVouchers.map(async (accountVoucher: IAccountVoucher) => {
            const { voucher } = accountVoucher;
            const brandUser = await lastValueFrom(await this.getUserInfo(voucher.brandId));
            /* eslint-disable @typescript-eslint/no-unused-vars */
            const { accountId, ...info } = brandUser.info;
            /* eslint-enable @typescript-eslint/no-unused-vars */
            return {
              ...accountVoucher,
              voucher: { ...voucher, brandInfo: { bucketId: brandUser.bucketId, ...info } },
            };
          })
        );
      } else {
        return this.clientVoucher.send({ method: "GET", path: "/vouchers/brand/:id/vouchers" }, { id: user.userId });
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
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
