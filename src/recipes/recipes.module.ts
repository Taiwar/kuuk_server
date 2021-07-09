import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IngredientsModule } from '../ingredients/ingredients.module';
import { RecipeBE, RecipeMongoSchema } from './recipe.schema';
import { RecipesResolver } from './recipes.resolver';
import { RecipesService } from './recipes.service';

@Module({
  imports: [
    IngredientsModule,
    MongooseModule.forFeature([
      { name: RecipeBE.name, schema: RecipeMongoSchema },
    ]),
  ],
  providers: [RecipesService, RecipesResolver],
  exports: [RecipesService],
})
export class RecipesModule {}
