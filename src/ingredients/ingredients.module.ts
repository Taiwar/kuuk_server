import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecipesModule } from '../recipes/recipes.module';
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
