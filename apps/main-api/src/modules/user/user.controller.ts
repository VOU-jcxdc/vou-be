import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "../../guard";
import { CurrentUser } from "../../decorators";
import { ICurrentUser, UdpateAccountDto } from "@types";

@UseGuards(JwtAuthGuard)
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/profile")
  async getUser(@CurrentUser() user: ICurrentUser) {
    return this.userService.getUserInfoWithRole(user.userId, user.role);
  }

  @Put("/profile")
  async updateUser(@CurrentUser() user: ICurrentUser, @Body() body: UdpateAccountDto) {
    return this.userService.updateAccountByUser(user.userId, body);
  }
}
