import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongoSchema } from 'mongoose';

export const DEFAULT_GROUP_NAME = '&%$default$%&';

export enum GroupItemTypes {
  IngredientBE = 'IngredientBE',
  StepBE = 'StepBE',
  NoteBE = 'NoteBE',
}

@Schema()
export class GroupBE extends Document {
  @Prop({
    type: MongoSchema.Types.ObjectId,
    ref: 'Recipe',
    required: true,
    index: true,
  })
  recipeID: string;

  @Prop({ required: true })
  itemType: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  sortNr: number;
}

export const GroupMongoSchema = SchemaFactory.createForClass(GroupBE);
