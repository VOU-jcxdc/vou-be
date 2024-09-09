import { BaseModel, QARecord } from "@database";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class QARecordModel extends BaseModel<QARecord> {
  constructor(@InjectModel(QARecord.name) model: Model<QARecord>) {
    super(model);
  }
}
