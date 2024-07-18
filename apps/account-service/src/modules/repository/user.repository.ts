import { BaseRepository, User } from "@database";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(@InjectRepository(User) repository: Repository<User>) {
    super(repository);
  }
}
