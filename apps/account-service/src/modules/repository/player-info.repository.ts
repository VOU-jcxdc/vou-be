import { BaseRepository, PlayerInfo } from "@database";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class PlayerInfoRepository extends BaseRepository<PlayerInfo> {
  private readonly _repository: Repository<PlayerInfo> = null;
  constructor(@InjectRepository(PlayerInfo) repository: Repository<PlayerInfo>) {
    super(repository);
    this._repository = repository;
  }
}
