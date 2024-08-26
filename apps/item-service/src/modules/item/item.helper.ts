import { CombineItems } from "@database";
import { Injectable } from "@nestjs/common";
import { Document } from "mongoose";

@Injectable()
export class ItemHelper {
  buildResponseData(rawData: Document<unknown, {}, CombineItems> & CombineItems & Required<{ _id: unknown }>) {
    const data = rawData.toObject();
    const { _id, updatedOn, createdOn, __v, ...restData } = data;
    return {
      id: _id,
      ...restData,
    };
  }
}
