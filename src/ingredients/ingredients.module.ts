import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IngredientBE, IngredientMongoSchema } from './ingredient.schema';
import { IngredientsService } from './ingredients.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: IngredientBE.name, schema: IngredientMongoSchema },
    ]),
  ],
  providers: [IngredientsService],
  exports: [IngredientsService],
})
export class IngredientsModule {}
