import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IQAs } from "@types";
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
  options: string[];

  @Prop({ type: Number, required: true })
  answer: number;

  // Hide timestamps
  @Prop({ type: Date, select: false })
  createdOn: Date;

  @Prop({ type: Date, select: false })
  updatedOn: Date;
}

export const QASchema = SchemaFactory.createForClass(QAs);
