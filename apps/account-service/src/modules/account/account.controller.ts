import { Controller, Get } from "@nestjs/common";
import { AccountService } from "./account.service";
import { MessagePattern } from "@nestjs/microservices";

@Controller("account")
export class AccountController {
  constructor(private readonly userService: AccountService) {}
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @MessagePattern({ cmd: "get_user" })
  async getUser(data: { id: string }) {
    return this.userService.getUser(data.id);
  }
}
