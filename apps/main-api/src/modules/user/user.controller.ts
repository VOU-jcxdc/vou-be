import { Body, Controller, Get, Param, ParseEnumPipe, ParseIntPipe, Put, Query, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtAuthGuard, RoleGuard } from "../../guard";
import { CurrentUser } from "../../decorators";
import { AccountRoleEnum, ICurrentUser, UdpateAccountDto, UpdateAsssignVoucherDto } from "@types";
import { Roles } from "../../decorators/roles.decorator";

@UseGuards(JwtAuthGuard)
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("")
  async getUsers(
    @CurrentUser() user: ICurrentUser,
    @Query("offset", ParseIntPipe) offset: number,
    @Query("limit", ParseIntPipe) limit: number,
    @Query("keySearch") keySearch?: string
  ) {
    return this.userService.getUsers(offset, limit, AccountRoleEnum.PLAYER, keySearch, user.userId);
  }

  @Get("profile")
  async getUser(@CurrentUser() user: ICurrentUser) {
    return this.userService.getUserInfoWithRole(user.userId, user.role);
  }

  @Get("vouchers")
  @UseGuards(RoleGuard)
  @Roles(AccountRoleEnum.PLAYER, AccountRoleEnum.BRAND)
  async getPlayerVouchers(@CurrentUser() user: ICurrentUser) {
    return this.userService.getVouchers(user);
  }

  @Put("profile")
  async updateUser(@CurrentUser() user: ICurrentUser, @Body() body: UdpateAccountDto) {
    return this.userService.updateAccountByUser(user.userId, body);
  }

  @Put("voucher/:accountVoucherId/applying")
  @UseGuards(RoleGuard)
  @Roles(AccountRoleEnum.PLAYER)
  async applyingVoucher(
    @Param("accountVoucherId") accountVoucherId: string,
    @CurrentUser() user: ICurrentUser,
    @Body() body: UpdateAsssignVoucherDto
  ) {
    return this.userService.updateAccountVoucherStatus(accountVoucherId, user.userId, body);
  }
}
