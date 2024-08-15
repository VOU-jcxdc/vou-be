import { BaseRepository, BrandInfo } from "@database";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Point, Repository } from "typeorm";
import { CreateBrandInfoDto } from "@types";

@Injectable()
export class BrandInfoRepository extends BaseRepository<BrandInfo> {
  constructor(@InjectRepository(BrandInfo) repository: Repository<BrandInfo>) {
    super(repository);
  }

  async createBrandInfo(data: CreateBrandInfoDto, accountId: string) {
    const pointObject: Point = {
      type: "Point",
      coordinates: [data.location.lng, data.location.lat],
    };

    await this.save({
      ...data,
      accountId,
      gps: pointObject,
    });
  }
}
