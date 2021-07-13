import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IngredientsModule } from '../ingredients/ingredients.module';
import { StepsModule } from '../steps/steps.module';
import { RecipeBE, RecipeMongoSchema } from './recipe.schema';
import { RecipesResolver } from './recipes.resolver';
import { RecipesService } from './recipes.service';

@Module({
  imports: [
    IngredientsModule,
    StepsModule,
    MongooseModule.forFeature([
      { name: RecipeBE.name, schema: RecipeMongoSchema },
    ]),
  ],
  providers: [RecipesService, RecipesResolver],
  exports: [RecipesService],
})
export class RecipesModule {}
