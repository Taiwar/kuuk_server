import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class RecipeBE extends Document {
  @Prop({ unique: true })
  name: string;

  @Prop({ type: [String], default: [] })
  tags: string[];
}

export const RecipeMongoSchema = SchemaFactory.createForClass(RecipeBE);
