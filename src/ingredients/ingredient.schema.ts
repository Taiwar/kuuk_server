import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';

@Schema()
export class IngredientBE extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true })
  recipeID: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  unit: string;
}

export const IngredientMongoSchema = SchemaFactory.createForClass(IngredientBE);
