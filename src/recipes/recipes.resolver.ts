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
  AddNoteInput,
  AddStepInput,
  CreateRecipeInput,
  DeletionResponse,
  FilterRecipesInput,
  IngredientDTO,
  NoteDTO,
  RecipeDTO,
  StepDTO,
  UpdateIngredientInput,
  UpdateNoteInput,
  UpdateRecipeInput,
  UpdateStepInput,
} from '../graphql';
import { IngredientsService } from '../ingredients/ingredients.service';
import { NotesService } from '../notes/notes.service';
import { StepsService } from '../steps/steps.service';
import { RecipesService } from './recipes.service';

@Resolver('RecipeDTO')
export class RecipesResolver {
  constructor(
    private recipesService: RecipesService,
    private ingredientsService: IngredientsService,
    private stepService: StepsService,
    private notesService: NotesService,
  ) {}

  @ResolveField()
  async steps(@Parent() recipe): Promise<StepDTO[]> {
    const { id } = recipe;
    return this.stepService.findAllByRecipeID(id);
  }

  @ResolveField()
  async ingredients(@Parent() recipe): Promise<IngredientDTO[]> {
    const { id } = recipe;
    return this.ingredientsService.findAllByRecipeID(id);
  }

  @ResolveField()
  async notes(@Parent() recipe): Promise<NoteDTO[]> {
    const { id } = recipe;
    return this.notesService.findAllByRecipeID(id);
  }

  @Query()
  async recipes(): Promise<RecipeDTO[]> {
    return this.recipesService.getAll();
  }

  @Query()
  async filterRecipes(
    @Args('filterRecipesInput') filterRecipesInput: FilterRecipesInput,
  ): Promise<RecipeDTO[]> {
    return this.recipesService.filter(filterRecipesInput);
  }

  @Query()
  async recipe(@Args('id') id: string): Promise<RecipeDTO> {
    return this.recipesService.findOneById(id);
  }

  @Query()
  async recipeBySlug(@Args('slug') slug: string): Promise<RecipeDTO> {
    return this.recipesService.findOneBySlug(slug);
  }

  @Query()
  async tags(): Promise<string[]> {
    return this.recipesService.getAllTags();
  }

  @Query()
  async ingredientNames(): Promise<string[]> {
    return this.ingredientsService.getAllNames();
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
  async deleteRecipe(@Args('id') id: string): Promise<DeletionResponse> {
    return this.recipesService.delete(id);
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
    @Args('ingredientID') ingredientId: string,
    @Args('recipeID') recipeId: string,
  ): Promise<DeletionResponse> {
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
    @Args('updateStepInput') updateStepInput: UpdateStepInput,
  ): Promise<StepDTO> {
    return this.stepService.update(updateStepInput);
  }

  @Mutation()
  async removeStep(
    @Args('stepID') stepId: string,
    @Args('recipeID') recipeId: string,
  ): Promise<DeletionResponse> {
    return this.recipesService.removeStep(stepId, recipeId);
  }

  @Mutation()
  async addNote(
    @Args('addNoteInput') addNoteInput: AddNoteInput,
  ): Promise<NoteDTO> {
    return this.recipesService.addNote(addNoteInput);
  }

  @Mutation()
  async updateNote(
    @Args('updateNoteInput') updateNoteInput: UpdateNoteInput,
  ): Promise<NoteDTO> {
    return this.notesService.update(updateNoteInput);
  }

  @Mutation()
  async removeNote(
    @Args('noteID') noteId: string,
    @Args('recipeID') recipeId: string,
  ): Promise<DeletionResponse> {
    return this.recipesService.removeNote(noteId, recipeId);
  }
}
