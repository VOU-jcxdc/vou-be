import { BaseRepository, Event } from "@database";
import { Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { AccountRoleEnum, EventStatusEnum, ICurrentUser } from "@types";
import { In, Repository } from "typeorm";

@Injectable()
export class EventRepository extends BaseRepository<Event> {
  constructor(@InjectRepository(Event) repository: Repository<Event>) {
    super(repository);
  }

  async findAllByRole(user: ICurrentUser, offset: number, limit: number) {
    const whereStatement =
      user.role === AccountRoleEnum.BRAND ? `brand_id = '${user.userId}'` : `event.end_date > NOW()`;

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

  async findNotExpiredEvent(id: string) {
    const event = await this.repository.findOne({
      where: { id, status: In([EventStatusEnum.PLANNING, EventStatusEnum.ONGOING]) },
    });

    if (!event) {
      throw new RpcException("Event is not exist or it expired");
    }
    return event;
  }
}
