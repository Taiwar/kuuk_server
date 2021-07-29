import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongoSchema } from 'mongoose';

@Schema()
export class StepBE extends Document {
  @Prop({
    type: MongoSchema.Types.ObjectId,
    ref: 'Recipe',
    required: true,
    index: true,
  })
  recipeID: string;

  @Prop({
    type: MongoSchema.Types.ObjectId,
    ref: 'Group',
    index: true,
  })
  groupID: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  picture: string;

  @Prop({ required: true })
  sortNr: number;

  @Prop()
  group: string;
}

export const StepMongoSchema = SchemaFactory.createForClass(StepBE);
