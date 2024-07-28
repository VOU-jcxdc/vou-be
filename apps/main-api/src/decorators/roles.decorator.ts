import { SetMetadata } from "@nestjs/common";
import { AccountRoleEnum } from "@types";
import { ROLES_KEY } from "@types";

export const Roles = (...roles: AccountRoleEnum[]) => SetMetadata(ROLES_KEY, roles);
