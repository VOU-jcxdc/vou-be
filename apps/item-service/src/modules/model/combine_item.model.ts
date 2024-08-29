import { BaseModel, CombineItems } from "@database";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class CombineItemModel extends BaseModel<CombineItems> {
  constructor(@InjectModel(CombineItems.name) model: Model<CombineItems>) {
    super(model);
  }
}
