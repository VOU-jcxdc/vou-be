import { BaseRepository, Game } from "@database";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class GameInSystemRepository extends BaseRepository<Game> {
  constructor(@InjectRepository(Game) repository: Repository<Game>) {
    super(repository);
  }
}
