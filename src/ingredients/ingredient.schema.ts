import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongoSchema } from 'mongoose';

@Schema({
  autoIndex: true,
})
export class IngredientBE extends Document {
  @Prop({
    type: MongoSchema.Types.ObjectId,
    ref: 'Recipe',
    required: true,
    index: true,
  })
  recipeID: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  unit: string;

  @Prop({ required: true })
  sortNr: number;

  @Prop()
  group: string;
}

export const IngredientMongoSchema = SchemaFactory.createForClass(IngredientBE);

IngredientMongoSchema.index({ name: 'text' });
