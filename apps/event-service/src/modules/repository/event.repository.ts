import { BaseRepository, Event } from "@database";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AccountRoleEnum, ICurrentUser } from "@types";
import { Repository } from "typeorm";

@Injectable()
export class EventRepository extends BaseRepository<Event> {
  constructor(@InjectRepository(Event) repository: Repository<Event>) {
    super(repository);
  }

  async findAllByRole(user: ICurrentUser, offset: number, limit: number) {
    const whereStatement = user.role === AccountRoleEnum.BRAND ? `brand_id = '${user.userId}'` : `1 = 1`;

    const events = await this.repository.query(`
      SELECT * FROM events
      WHERE ${whereStatement}
      ORDER BY 
        CASE 
          WHEN end_date > NOW() THEN 0
          ELSE 1
        END,
        begin_date ASC
      LIMIT ${limit}
      OFFSET ${offset};
    `);

    const total = await this.repository.count({
      where: {
        brandId: user.role === AccountRoleEnum.BRAND ? user.userId : undefined,
      },
    });

    return { events, total, offset, limit };
  }
}
