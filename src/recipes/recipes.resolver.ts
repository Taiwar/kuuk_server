import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {
  AddGroupInput,
  AddIngredientInput,
  AddNoteInput,
  AddStepInput,
  CreateRecipeInput,
  DeletionResponse,
  FilterRecipesInput,
  GroupDTO,
  IngredientDTO,
  IngredientItemDTO,
  NoteDTO,
  NoteItemDTO,
  RecipeDTO,
  StepDTO,
  StepItemDTO,
  UpdateGroupInput,
  UpdateIngredientInput,
  UpdateNoteInput,
  UpdateRecipeInput,
  UpdateStepInput,
} from '../graphql';
import { GroupItemTypes } from '../groups/group.schema';
import { GroupsService } from '../groups/groups.service';
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
    private groupsService: GroupsService,
  ) {}

  @ResolveField()
  async steps(@Parent() recipe): Promise<StepItemDTO[]> {
    const { id } = recipe;
    const steps = await this.stepService.findAllByRecipeID(id);
    const stepGroups = await this.groupsService.findAllByRecipeIDAndItemType(
      id,
      GroupItemTypes.StepBE,
    );
    return [...stepGroups, ...steps];
  }

  @ResolveField()
  async ingredients(@Parent() recipe): Promise<IngredientItemDTO[]> {
    const { id } = recipe;
    const ingredients = await this.ingredientsService.findAllByRecipeID(id);
    const ingredientGroups =
      await this.groupsService.findAllByRecipeIDAndItemType(
        id,
        GroupItemTypes.IngredientBE,
      );
    return [...ingredientGroups, ...ingredients];
  }

  @ResolveField()
  async notes(@Parent() recipe): Promise<NoteItemDTO[]> {
    const { id } = recipe;
    const notes = await this.notesService.findAllByRecipeID(id);
    const noteGroups = await this.groupsService.findAllByRecipeIDAndItemType(
      id,
      GroupItemTypes.NoteBE,
    );
    return [...noteGroups, ...notes];
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
    return this.ingredientsService.create(addIngredientInput);
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
  ): Promise<DeletionResponse> {
    return this.ingredientsService.delete(ingredientId);
  }

  @Mutation()
  async addStep(
    @Args('addStepInput') addStepInput: AddStepInput,
  ): Promise<StepDTO> {
    return this.stepService.create(addStepInput);
  }

  @Mutation()
  async updateStep(
    @Args('updateStepInput') updateStepInput: UpdateStepInput,
  ): Promise<StepDTO> {
    return this.stepService.update(updateStepInput);
  }

  @Mutation()
  async removeStep(@Args('stepID') stepId: string): Promise<DeletionResponse> {
    return this.stepService.delete(stepId);
  }

  @Mutation()
  async addNote(
    @Args('addNoteInput') addNoteInput: AddNoteInput,
  ): Promise<NoteDTO> {
    return this.notesService.create(addNoteInput);
  }

  @Mutation()
  async updateNote(
    @Args('updateNoteInput') updateNoteInput: UpdateNoteInput,
  ): Promise<NoteDTO> {
    return this.notesService.update(updateNoteInput);
  }

  @Mutation()
  async removeNote(@Args('noteID') noteId: string): Promise<DeletionResponse> {
    return this.notesService.delete(noteId);
  }

  @Mutation()
  async addGroup(
    @Args('addGroupInput') addGroupInput: AddGroupInput,
  ): Promise<GroupDTO> {
    return this.groupsService.create(addGroupInput);
  }

  @Mutation()
  async updateGroup(
    @Args('updateGroupInput') updateGroupInput: UpdateGroupInput,
  ): Promise<GroupDTO> {
    return this.groupsService.update(updateGroupInput);
  }

  @Mutation()
  async removeGroup(
    @Args('groupID') groupId: string,
  ): Promise<DeletionResponse> {
    return this.groupsService.delete(groupId);
  }
}
