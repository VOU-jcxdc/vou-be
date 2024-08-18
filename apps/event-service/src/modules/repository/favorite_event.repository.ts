import { BaseRepository, FavoriteEvent } from "@database";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class FavoriteEventRepository extends BaseRepository<FavoriteEvent> {
  constructor(@InjectRepository(FavoriteEvent) repository: Repository<FavoriteEvent>) {
    super(repository);
  }

  async getFavoriteEvents(offset: number, limit: number, userId: string) {
    const lists = await this.repository.find({
      where: { accountId: userId },
      skip: offset,
      take: limit,
      relations: ["event"],
    });
    const favoriteEvents = lists.map((item) => {
      return item.event;
    });
    const total = await this.repository.count({ where: { accountId: userId } });

    return { favoriteEvents, total, offset, limit };
  }
}
