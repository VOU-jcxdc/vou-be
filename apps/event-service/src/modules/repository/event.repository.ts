import { BaseRepository, Event } from "@database";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AccountRoleEnum, ICurrentUser } from "@types";
import { Brackets, Repository } from "typeorm";

@Injectable()
export class EventRepository extends BaseRepository<Event> {
  constructor(@InjectRepository(Event) repository: Repository<Event>) {
    super(repository);
  }

  async findAllByRole(user: ICurrentUser, offset: number, limit: number) {
    const whereStatement = user.role === AccountRoleEnum.BRAND ? `brand_id = '${user.userId}'` : `1 = 1`;

    const events = await this.repository
      .createQueryBuilder("event")
      .where(whereStatement)
      .orderBy(`CASE WHEN event.end_date > NOW() THEN 0 ELSE 1 END`, "ASC")
      .addOrderBy(`CASE WHEN event.end_date > NOW() THEN event.begin_date END`, "ASC")
      .addOrderBy(`CASE WHEN event.end_date <= NOW() THEN event.end_date END`, "DESC")
      .limit(limit)
      .offset(offset)
      .getMany();

    const total = await this.repository.count({
      where: {
        brandId: user.role === AccountRoleEnum.BRAND ? user.userId : undefined,
      },
    });

    return { events, total, offset, limit };
  }
}
