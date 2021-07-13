import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';

@Schema()
export class StepBE extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true })
  recipeID: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  picture: string;
}

export const StepMongoSchema = SchemaFactory.createForClass(StepBE);
