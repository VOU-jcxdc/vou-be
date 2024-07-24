import { Body, ClassSerializerInterceptor, Controller, Post, UseInterceptors } from "@nestjs/common";
import { AccountService } from "./account.service";
import { MessagePattern } from "@nestjs/microservices";
import { CreateAccountDto } from "@types";

@Controller("account")
export class AccountController {
  constructor(private readonly userService: AccountService) {}

  @Post()
  @MessagePattern({ cmd: "create_new_account" })
  async createAccount(@Body() data: CreateAccountDto) {
    return this.userService.createAccount(data);
  }
}
