import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class RecipeBE extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ unique: true })
  author: string;

  @Prop()
  totalTimeMin: number;

  @Prop()
  prepTimeMin: number;

  @Prop()
  cookTimeMin: number;

  @Prop({ required: true })
  servings: number;

  @Prop()
  rating: number;

  @Prop({ type: [String], default: [] })
  sourceLinks: string[];

  @Prop()
  description: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: [String], default: [] })
  pictures: string[];

  @Prop({ type: [String], default: [] })
  notes: string[];
}

export const RecipeMongoSchema = SchemaFactory.createForClass(RecipeBE);
