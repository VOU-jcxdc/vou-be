import { AccountRoleEnum } from "../enums/account-role.enum";
import { CreateBrandInfoDto } from "./create-brand-info.dto";
import { CreatePlayerInfoDto } from "./create-player-info.dto";
import { IsEnum, IsNotEmpty, Validate, ValidateNested } from "class-validator";
import { InfoValidation } from "./custom";

export class CreateAccountDto {
  @IsNotEmpty({ message: "Phone is required" })
  phone: string;

  @IsNotEmpty({ message: "Username is required" })
  username: string;

  @IsNotEmpty({ message: "Email is required" })
  email: string;

  @IsNotEmpty({ message: "Password is required" })
  password: string;

  @IsEnum(AccountRoleEnum, { message: "Role is required as admin, player, or brand" })
  role: AccountRoleEnum;

  @ValidateNested()
  @Validate(InfoValidation)
  data: CreateBrandInfoDto | CreatePlayerInfoDto;
}
