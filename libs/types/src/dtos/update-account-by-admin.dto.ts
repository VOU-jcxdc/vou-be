import { OmitType, PartialType } from "@nestjs/mapped-types";
import { CreateAccountDto } from "./create-account.dto";
import { CreateBrandInfoDto } from "./create-brand-info.dto";
import { CreatePlayerInfoDto } from "./create-player-info.dto";

export class UpdateAccountByAdminDto extends PartialType(OmitType(CreateAccountDto, ["password"])) {
  info: Partial<CreateBrandInfoDto | CreatePlayerInfoDto>;
}
