import { Body, Controller, Get, Param, ParseEnumPipe, ParseIntPipe, Post, Put, Query, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { AccountRoleEnum, CreateAdminDto, UpdateAccountByAdminDto } from "@types";
import { JwtAuthGuard, RoleGuard } from "../../guard";
import { Roles } from "../../decorators/roles.decorator";

@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(AccountRoleEnum.ADMIN)
@Controller("admin")
export class AdminController {
  constructor(private readonly userService: UserService) {}

  @Get("users")
  async getUsers(
    @Query("offset", ParseIntPipe) offset: number,
    @Query("limit", ParseIntPipe) limit: number,
    @Query("role", new ParseEnumPipe(AccountRoleEnum, { optional: true })) role: AccountRoleEnum,
    @Query("keySearch") keySearch?: string
  ) {
    return this.userService.getUsers(offset, limit, role, keySearch);
  }

  @Get("user/:id")
  async getUserInfo(@Param("id") id: string) {
    return this.userService.getUserInfo(id);
  }

  @Put("user/:id")
  async updateAccount(@Param("id") id: string, @Body() body: UpdateAccountByAdminDto) {
    return this.userService.updateAccountByAdmin(id, body);
  }

  @Post("user")
  async createUser(@Body() data: CreateAdminDto) {
    return this.userService.createUser(data);
  }
}
