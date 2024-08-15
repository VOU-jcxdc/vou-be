import { Body, Controller } from "@nestjs/common";
import { AccountService } from "./account.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { AccountRoleEnum, CreateAccountDto, UdpateAccountDto, UpdateAccountByAdminDto } from "@types";

@Controller()
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @MessagePattern({ method: "POST", path: "/account/create-account" })
  async createAccount(@Body() data: CreateAccountDto) {
    return this.accountService.createAccount(data);
  }

  @MessagePattern({ method: "POST", path: "/account/verify-account" })
  async verifyAccount(@Body() data: { phone: string; password: string }) {
    return this.accountService.verifyAccount(data.phone, data.password);
  }

  @MessagePattern({ method: "GET", path: "/accounts" })
  async getAllAccounts(@Payload() data: { offset: number; limit: number; role?: AccountRoleEnum }) {
    const { offset, limit, role } = data;
    return this.accountService.getAllAccounts(offset, limit, role);
  }

  @MessagePattern({ method: "GET", path: "/account/:id?role=${role}" })
  async getAccountInfoWithRole(@Payload() data: any) {
    const { id, role } = data;
    return this.accountService.getAccountInfoWithRole(id, role);
  }

  @MessagePattern({ method: "GET", path: "/account/:id" })
  async getAccountInfo(@Payload() data: { id: string }) {
    return this.accountService.getAccountInfo(data.id);
  }

  @MessagePattern({ method: "PUT", path: "admin/account/:id" })
  async updateAccount(@Payload() data: { id: string; body: UpdateAccountByAdminDto }) {
    const { id, body } = data;
    return this.accountService.updateAccount(id, body);
  }

  @MessagePattern({ method: "PUT", path: "/account/:id" })
  async updateAccountByUser(@Payload() data: { id: string; body: UdpateAccountDto }) {
    const { id, body } = data;
    return this.accountService.updateAccount(id, body);
  }
}
