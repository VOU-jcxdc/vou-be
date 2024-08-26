import { Injectable } from "@nestjs/common";
import { Document, FilterQuery, Model } from "mongoose";

@Injectable()
export class ModelRepository<T extends Document> {
  constructor(private model: Model<T>) {}

  async find(filter: FilterQuery<T>) {
    return this.model.find(filter);
  }

  async findOne(query: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(query).exec();
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async update(query: FilterQuery<T>, data: Partial<T>): Promise<T | null> {
    return this.model.findOneAndUpdate(query, data, { new: true }).exec();
  }
}
