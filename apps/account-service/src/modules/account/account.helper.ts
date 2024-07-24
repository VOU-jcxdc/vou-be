import { Injectable } from "@nestjs/common";
import { IAccount } from "@types";

@Injectable()
export class AccountHelper {
  buildCreateAccountResponse(data: IAccount) {
    return {
      id: data.id,
      phone: data.phone,
      username: data.username,
      email: data.email,
      role: data.role,
    };
  }
}
