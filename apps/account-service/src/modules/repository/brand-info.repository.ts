import { BaseRepository, BrandInfo } from "@database";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Point, Repository } from "typeorm";
import { CreateBrandInfoDto } from "@types";

@Injectable()
export class BrandInfoRepository extends BaseRepository<BrandInfo> {
  private readonly _repository: Repository<BrandInfo> = null;
  constructor(@InjectRepository(BrandInfo) repository: Repository<BrandInfo>) {
    super(repository);
    this._repository = repository;
  }

  async createBrandInfo(data: CreateBrandInfoDto, accountId: string) {
    const pointObject: Point = {
      type: "Point",
      coordinates: [data.location.lng, data.location.lat],
    };

    await this._repository.save({
      ...data,
      accountId,
      location: pointObject,
    });
  }
}
