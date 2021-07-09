import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class IngredientBE extends Document {
  @Prop({ required: true })
  recipeID: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  unit: string;
}

export const IngredientMongoSchema = SchemaFactory.createForClass(IngredientBE);
