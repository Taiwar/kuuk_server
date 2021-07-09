import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { IngredientDTO } from '../graphql';

@Schema()
export class RecipeBE extends Document {
  @Prop({ unique: true })
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' })
  ingredients: IngredientDTO[];
}

export const RecipeMongoSchema = SchemaFactory.createForClass(RecipeBE);
