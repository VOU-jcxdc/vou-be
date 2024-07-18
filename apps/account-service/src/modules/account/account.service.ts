import { Injectable } from "@nestjs/common";
import { AccountRepository } from "../repository/account.repository";

@Injectable()
export class AccountService {
  constructor(private readonly userRepository: AccountRepository) {}

  async findAll() {
    return this.userRepository.findAll();
  }
}
