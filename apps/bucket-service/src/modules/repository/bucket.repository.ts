import { BaseRepository, Bucket } from "@database";
import { InternalServerErrorException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, FindOptionsWhere, Repository } from "typeorm";

export class BucketRepository extends BaseRepository<Bucket> {
  constructor(@InjectRepository(Bucket) repository: Repository<Bucket>) {
    super(repository);
  }

  async create(entity: Partial<Bucket>): Promise<Bucket> {
    return await this.repository.save(entity);
  }

  async delete(data: FindOptionsWhere<Bucket>): Promise<DeleteResult> {
    return await this.repository.delete(data);
  }

  async save(entity: Bucket): Promise<Bucket> {
    return await this.repository.save(entity);
  }
}
