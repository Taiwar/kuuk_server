import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class RecipeBE extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop([String])
  sourceLinks: string[];

  @Prop()
  description: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop([String])
  pictures: string[];

  @Prop([String])
  notes: string[];
}

export const RecipeMongoSchema = SchemaFactory.createForClass(RecipeBE);
