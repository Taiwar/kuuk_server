import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupsModule } from '../groups/groups.module';
import { IngredientsModule } from '../ingredients/ingredients.module';
import { NotesModule } from '../notes/notes.module';
import { StepsModule } from '../steps/steps.module';
import { OrderedRecipeItemDtoResolver } from './ordered-recipe-item-dto.resolver';
import { RecipeBE, RecipeMongoSchema } from './recipe.schema';
import { RecipesResolver } from './recipes.resolver';
import { RecipesService } from './recipes.service';

@Module({
  imports: [
    IngredientsModule,
    StepsModule,
    NotesModule,
    GroupsModule,
    MongooseModule.forFeature([
      { name: RecipeBE.name, schema: RecipeMongoSchema },
    ]),
  ],
  providers: [RecipesService, RecipesResolver, OrderedRecipeItemDtoResolver],
  exports: [RecipesService],
})
export class RecipesModule {}
