import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {
  AddIngredientInput,
  CreateRecipeInput,
  IngredientDTO,
  RecipeDTO,
  UpdateIngredientInput,
  UpdateRecipeInput,
} from '../graphql';
import { IngredientsService } from '../ingredients/ingredients.service';
import { RecipesService } from './recipes.service';

@Resolver('RecipeDTO')
export class RecipesResolver {
  constructor(
    private recipesService: RecipesService,
    private ingredientsService: IngredientsService,
  ) {}

  @Query()
  async recipes(): Promise<RecipeDTO[]> {
    return this.recipesService.getAll();
  }

  @Query()
  async recipe(@Args('id') id: string): Promise<RecipeDTO> {
    return this.recipesService.findOneById(id);
  }

  @Mutation()
  async createRecipe(
    @Args('createRecipeInput') createRecipeInput: CreateRecipeInput,
  ): Promise<RecipeDTO> {
    return this.recipesService.create(createRecipeInput);
  }

  @Mutation()
  async updateRecipe(
    @Args('updateRecipeInput') updateRecipeInput: UpdateRecipeInput,
  ): Promise<RecipeDTO> {
    return this.recipesService.update(updateRecipeInput);
  }

  @Mutation()
  async deleteRecipe(@Args('id') id: string): Promise<boolean> {
    return this.recipesService.delete(id);
  }

  @ResolveField()
  async ingredients(@Parent() recipe): Promise<IngredientDTO[]> {
    const { id } = recipe;
    return this.ingredientsService.findAllByRecipeID(id);
  }

  @Query()
  async ingredient(@Args('id') id: string): Promise<IngredientDTO> {
    return this.ingredientsService.findOneById(id);
  }

  @Mutation()
  async addIngredient(
    @Args('addIngredientInput') addIngredientInput: AddIngredientInput,
  ): Promise<IngredientDTO> {
    return this.recipesService.addIngredient(addIngredientInput);
  }

  @Mutation()
  async updateIngredient(
    @Args('updateIngredientInput') updateIngredientInput: UpdateIngredientInput,
  ): Promise<IngredientDTO> {
    return this.ingredientsService.update(updateIngredientInput);
  }

  @Mutation()
  async removeIngredient(
    @Args('ingredientId') ingredientId: string,
    @Args('recipeId') recipeId: string,
  ): Promise<boolean> {
    return this.recipesService.removeIngredient(ingredientId, recipeId);
  }
}
