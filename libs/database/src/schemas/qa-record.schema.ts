import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IPlayerAnswer, IQAOption, IQARecord } from "@types";
import { Document } from "mongoose";

@Schema({
  collection: "QARecord",
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

  @Prop({ type: Date, required: true })
  updatedOn: Date;

  @Prop({ type: Date, required: true })
  createdOn: Date;
}

export const QARecordSchema = SchemaFactory.createForClass(QARecord);
