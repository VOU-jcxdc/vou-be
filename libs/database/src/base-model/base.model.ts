import { Injectable, Logger } from "@nestjs/common";
import { Document, FilterQuery, Model, Types, UpdateQuery } from "mongoose";

@Injectable()
export class BaseModel<T extends Document> {
  constructor(protected model: Model<T>) {}

  save(data: T) {
    try {
      const newData = new this.model(data);
      return newData.save();
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  async findByIdAndUpdate(id: Types.ObjectId, update: UpdateQuery<T>) {
    return this.model.findByIdAndUpdate(id, update, { new: true });
  }

  async findById(id: Types.ObjectId) {
    return this.model.findById(id);
  }

  async find(filter: FilterQuery<T>) {
    return this.model.find(filter);
  }

  async findByIdAndDelete(id: Types.ObjectId) {
    return this.model.findByIdAndDelete(id);
  }
}
