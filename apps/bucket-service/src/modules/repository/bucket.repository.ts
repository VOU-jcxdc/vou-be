import { BaseRepository, Bucket } from "@database";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

export class BucketRepository extends BaseRepository<Bucket> {
  constructor(@InjectRepository(Bucket) repository: Repository<Bucket>) {
    super(repository);
  }
}
