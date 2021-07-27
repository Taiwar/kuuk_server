import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongoSchema } from 'mongoose';

@Schema()
export class NoteBE extends Document {
  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'Recipe', required: true })
  recipeID: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;
}

export const NoteMongoSchema = SchemaFactory.createForClass(NoteBE);
