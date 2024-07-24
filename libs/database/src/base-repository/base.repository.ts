import { Injectable } from "@nestjs/common";
import { BaseEntity, Repository, FindOneOptions, DeepPartial } from "typeorm";

@Injectable()
export class BaseRepository<T extends BaseEntity> {
  constructor(private repository: Repository<T>) {}

  findAll(): Promise<T[]> {
    return this.repository.find();
  }

  findOne(data: FindOneOptions<T>): Promise<T | null> {
    return this.repository.findOne(data);
  }

  create(data: DeepPartial<T>): Promise<T> {
    return this.repository.save(data);
  }
}
