import { Body, Controller, Get, Param, ParseEnumPipe, ParseIntPipe, Put, Query } from "@nestjs/common";
import { UserService } from "./user.service";
import { AccountRoleEnum, UpdateAccountByAdminDto } from "@types";

@Controller("admin")
export class AdminController {
  constructor(private readonly userService: UserService) {}

  @Get("users")
  async getUsers(
    @Query("offset", ParseIntPipe) offset: number,
    @Query("limit", ParseIntPipe) limit: number,
    @Query("role", new ParseEnumPipe(AccountRoleEnum, { optional: true })) role: AccountRoleEnum
  ) {
    return this.userService.getUsers(offset, limit, role);
  }

  @Get("user/:id")
  async getUserInfo(@Param("id") id: string) {
    return this.userService.getUserInfo(id);
  }

  @Put("user/:id")
  async updateAccount(@Param("id") id: string, @Body() body: UpdateAccountByAdminDto) {
    return this.userService.updateAccountByAdmin(id, body);
  }
}
