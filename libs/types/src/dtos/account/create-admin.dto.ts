import { OmitType } from "@nestjs/mapped-types";
import { CreateAccountDto } from "./create-account.dto";
import { AccountRoleEnum } from "../../enums";

export class CreateAdminDto extends OmitType(CreateAccountDto, ["data", "role"] as const) {
  role = AccountRoleEnum.ADMIN;
}
