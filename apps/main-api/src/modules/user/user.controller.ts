import { Controller, Get, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "../../guard";
import { CurrentUser } from "../../decorators";
import { ICurrentUser } from "@types";

@UseGuards(JwtAuthGuard)
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/profile")
  async getUser(@CurrentUser() user: ICurrentUser) {
    const id = user.userId;
    return this.userService.getUser(id);
  }
}
