import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IngredientItemDtoResolver } from './ingredient-item-dto.resolver';
import { IngredientBE, IngredientMongoSchema } from './ingredient.schema';
import { IngredientsService } from './ingredients.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: IngredientBE.name, schema: IngredientMongoSchema },
    ]),
  ],
  providers: [IngredientsService, IngredientItemDtoResolver],
  exports: [IngredientsService],
})
export class IngredientsModule {}
