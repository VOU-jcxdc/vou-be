import { Body, Controller, Get, Post } from "@nestjs/common";
import { AccountService } from "./account.service";
import { MessagePattern } from "@nestjs/microservices";
import { CreateAccountDto } from "@types";

@Controller("account")
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post("create-account")
  @MessagePattern({ method: "POST", path: "/account/create-account" })
  async createAccount(@Body() data: CreateAccountDto) {
    return this.accountService.createAccount(data);
  }

  @Post("verify-account")
  @MessagePattern({ method: "POST", path: "/account/verify-account" })
  async verifyAccount(@Body() data: { phone: string; password: string }) {
    return this.accountService.verifyAccount(data.phone, data.password);
  }
}
