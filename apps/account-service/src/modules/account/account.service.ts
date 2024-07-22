import { Injectable } from "@nestjs/common";
import { AccountRepository } from "../repository/account.repository";

@Injectable()
export class AccountService {
  constructor(private readonly userRepository: AccountRepository) {}

  async findAll() {
    return this.userRepository.findAll();
  }

  async getUser(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    console.log("user: ", user);
    return user;
  }
}
