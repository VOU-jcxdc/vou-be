import { OmitType } from "@nestjs/mapped-types";
import { UpdateAccountByAdminDto } from "./update-account-by-admin.dto";

export class UdpateAccountDto extends OmitType(UpdateAccountByAdminDto, ["role"]) {}
