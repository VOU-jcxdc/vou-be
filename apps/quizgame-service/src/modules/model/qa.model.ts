import { BaseModel, QAs } from "@database";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class QAModel extends BaseModel<QAs> {
  constructor(@InjectModel(QAs.name) model: Model<QAs>) {
    super(model);
  }
}
