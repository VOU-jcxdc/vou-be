import { Controller, Get } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/profile")
  async getUser() {
    const id = "ce118f46-1789-476d-9625-4f61d96679b5";
    return this.userService.getUser(id);
  }
}
