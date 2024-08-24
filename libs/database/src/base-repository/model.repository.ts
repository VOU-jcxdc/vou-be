import { Injectable } from "@nestjs/common";
import { Document, Model } from "mongoose";

@Injectable()
export class ModelRepository<T extends Document> {
  constructor(private model: Model<T>) {}

  async findAll(): Promise<T[]> {
    return this.model.find().exec();
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }
}
