import { Inject, Injectable } from "@nestjs/common";
import { ClientOptions, ClientProxy, ClientProxyFactory } from "@nestjs/microservices";
import { AccountRoleEnum, UdpateAccountDto, UpdateAccountByAdminDto } from "@types";

@Injectable()
export class UserService {
  private client: ClientProxy;

  constructor(@Inject("USER_SERVICE") options: ClientOptions) {
    this.client = ClientProxyFactory.create(options);
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

  async updateAccountByAdmin(id: string, body: UpdateAccountByAdminDto) {
    return this.client.send({ method: "PUT", path: "admin/account/:id" }, { id, body });
  }

  async updateAccountByUser(id: string, body: UdpateAccountDto) {
    return this.client.send({ method: "PUT", path: "/account/:id" }, { id, body });
  }
}
