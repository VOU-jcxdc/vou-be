import { Body, ClassSerializerInterceptor, Controller, Post, UseInterceptors } from "@nestjs/common";
import { AccountService } from "./account.service";
import { MessagePattern } from "@nestjs/microservices";
import { CreateAccountDto } from "@types";

@Controller("account")
export class AccountController {
  constructor(private readonly userService: AccountService) {}

  @Post("sign-up")
  @MessagePattern({ cmd: "create_new_account" })
  async createAccount(@Body() data: CreateAccountDto) {
    return this.userService.createAccount(data);
  }

  @Post("sign-in")
  @MessagePattern({ cmd: "verify_account" })
  async verifyAccount(@Body() data: { phone: string; password: string }) {
    return this.userService.verifyAccount(data.phone, data.password);
  }
}
