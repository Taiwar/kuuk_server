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
  AddStepInput,
  CreateRecipeInput,
  IngredientDTO,
  RecipeDTO,
  StepDTO,
  UpdateIngredientInput,
  UpdateRecipeInput,
} from '../graphql';
import { IngredientsService } from '../ingredients/ingredients.service';
import { StepsService } from '../steps/steps.service';
import { RecipesService } from './recipes.service';

@Resolver('RecipeDTO')
export class RecipesResolver {
  constructor(
    private recipesService: RecipesService,
    private ingredientsService: IngredientsService,
    private stepService: StepsService,
  ) {}

  @ResolveField()
  async steps(@Parent() recipe): Promise<StepDTO[]> {
    const { id } = recipe;
    return this.stepService.findAllByRecipeID(id);
  }

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

  @Mutation()
  async addStep(
    @Args('addStepInput') addStepInput: AddStepInput,
  ): Promise<StepDTO> {
    return this.recipesService.addStep(addStepInput);
  }

  @Mutation()
  async updateStep(
    @Args('updateIngredientInput') updateIngredientInput: UpdateIngredientInput,
  ): Promise<StepDTO> {
    return this.stepService.update(updateIngredientInput);
  }

  @Mutation()
  async removeStep(
    @Args('stepId') stepId: string,
    @Args('recipeId') recipeId: string,
  ): Promise<boolean> {
    return this.recipesService.removeStep(stepId, recipeId);
  }
}
