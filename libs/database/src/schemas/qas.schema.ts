import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IQAOption, IQAs } from "@types";
import { Document } from "mongoose";

@Schema({
  collection: "QAs",
  versionKey: false,
  timestamps: {
    createdAt: "createdOn",
    updatedAt: "updatedOn",
  },
})
export class QAs extends Document implements IQAs {
  @Prop({ type: String, required: true })
  question: string;

  @Prop({ type: Array, required: true })
  options: IQAOption[];

  @Prop({ type: Number, required: true })
  answer: number;
}

export const QASchema = SchemaFactory.createForClass(QAs);
