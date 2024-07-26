import { Injectable } from "@nestjs/common";
import { BaseEntity, Repository, FindOneOptions, DeepPartial, DeleteResult, ObjectId, FindOptionsWhere } from "typeorm";

@Injectable()
export class BaseRepository<T extends BaseEntity> {
  constructor(private repository: Repository<T>) {}

  findAll(): Promise<T[]> {
    return this.repository.find();
  }

  findOne(data: FindOneOptions<T>): Promise<T | null> {
    return this.repository.findOne(data);
  }

  save(data: DeepPartial<T>): Promise<T> {
    return this.repository.save(data);
  }

  delete(
    data: string | number | Date | ObjectId | string[] | number[] | Date[] | ObjectId[] | FindOptionsWhere<T>
  ): Promise<DeleteResult> {
    return this.repository.delete(data);
  }
}
