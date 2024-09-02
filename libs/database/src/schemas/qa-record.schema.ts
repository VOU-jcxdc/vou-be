import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IPlayerAnswer, IQARecord } from "@types";
import { Document } from "mongoose";

@Schema({
  collection: "QA_records",
  versionKey: false,
  timestamps: {
    createdAt: "createdOn",
    updatedAt: "updatedOn",
  },
})
export class QARecord extends Document implements IQARecord {
  @Prop({ type: String, required: true })
  QAId: string;

  @Prop({ type: Array, required: true })
  playerAnswer: IPlayerAnswer[];
}

export const QARecordSchema = SchemaFactory.createForClass(QARecord);
