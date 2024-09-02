import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { CombineItemTypeEnum, ICombineItems, IItemRecipe } from "@types";
import { Document, HydratedDocument } from "mongoose";

@Schema({
  collection: "combine_items",
  timestamps: {
    createdAt: "createdOn",
    updatedAt: "updatedOn",
  },
  versionKey: false,
})
export class CombineItems extends Document implements ICombineItems {
  @Prop({ type: String, required: true })
  eventId: string;

  @Prop({ type: Array, required: true })
  itemRecipe: IItemRecipe[];

  @Prop({ type: String, enum: CombineItemTypeEnum, required: true })
  targetType: CombineItemTypeEnum;

  @Prop({ type: String, required: true })
  targetId: string;

  // Hide timestamps
  @Prop({ type: Date, select: false })
  createdOn: Date;

  @Prop({ type: Date, select: false })
  updatedOn: Date;
}

export const CombineItemsSchema = SchemaFactory.createForClass(CombineItems);
export type CombineItemsDocument = HydratedDocument<CombineItems>;
