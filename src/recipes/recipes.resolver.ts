import { BadRequestException } from '@nestjs/common';
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
  GroupItemDeletionResponse,
  GroupItemUpdateResponse,
  IngredientDTO,
  NoteDTO,
  RecipeDTO,
  StepDTO,
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
  async steps(@Parent() recipe): Promise<GroupDTO[]> {
    const { id } = recipe;
    return await this.groupsService.findAllByRecipeIDAndItemType(
      id,
      GroupItemTypes.StepBE,
    );
  }

  @ResolveField()
  async ingredients(@Parent() recipe): Promise<GroupDTO[]> {
    const { id } = recipe;
    return await this.groupsService.findAllByRecipeIDAndItemType(
      id,
      GroupItemTypes.IngredientBE,
    );
  }

  @ResolveField()
  async notes(@Parent() recipe): Promise<GroupDTO[]> {
    const { id } = recipe;
    return await this.groupsService.findAllByRecipeIDAndItemType(
      id,
      GroupItemTypes.NoteBE,
    );
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
  async importRecipe(@Args('url') url: string): Promise<RecipeDTO> {
    return this.recipesService.import(url);
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
    const groupItemType = await this.groupsService.getTypeById(
      addIngredientInput.groupID,
    );
    if (groupItemType !== GroupItemTypes.IngredientBE) {
      throw new BadRequestException(
        `Group ${addIngredientInput.groupID} is not an ingredient group!`,
      );
    }
    return this.ingredientsService.create(addIngredientInput);
  }

  @Mutation()
  async updateIngredient(
    @Args('updateIngredientInput') updateIngredientInput: UpdateIngredientInput,
  ): Promise<GroupItemUpdateResponse> {
    if (updateIngredientInput.groupID) {
      const groupItemType = await this.groupsService.getTypeById(
        updateIngredientInput.groupID,
      );
      if (groupItemType !== GroupItemTypes.IngredientBE) {
        throw new BadRequestException(
          `Group ${updateIngredientInput.groupID} is not an ingredient group!`,
        );
      }
    }
    return this.ingredientsService.update(updateIngredientInput);
  }

  @Mutation()
  async removeIngredient(
    @Args('ingredientID') ingredientId: string,
  ): Promise<GroupItemDeletionResponse> {
    return this.ingredientsService.delete(ingredientId);
  }

  @Mutation()
  async addStep(
    @Args('addStepInput') addStepInput: AddStepInput,
  ): Promise<StepDTO> {
    const groupItemType = await this.groupsService.getTypeById(
      addStepInput.groupID,
    );
    if (groupItemType !== GroupItemTypes.StepBE) {
      throw new BadRequestException(
        `Group ${addStepInput.groupID} is not a step group!`,
      );
    }
    return this.stepService.create(addStepInput);
  }

  @Mutation()
  async updateStep(
    @Args('updateStepInput') updateStepInput: UpdateStepInput,
  ): Promise<GroupItemUpdateResponse> {
    if (updateStepInput.groupID) {
      const groupItemType = await this.groupsService.getTypeById(
        updateStepInput.groupID,
      );
      if (groupItemType !== GroupItemTypes.StepBE) {
        throw new BadRequestException(
          `Group ${updateStepInput.groupID} is not a step group!`,
        );
      }
    }
    return this.stepService.update(updateStepInput);
  }

  @Mutation()
  async removeStep(
    @Args('stepID') stepId: string,
  ): Promise<GroupItemDeletionResponse> {
    return this.stepService.delete(stepId);
  }

  @Mutation()
  async addNote(
    @Args('addNoteInput') addNoteInput: AddNoteInput,
  ): Promise<NoteDTO> {
    const groupItemType = await this.groupsService.getTypeById(
      addNoteInput.groupID,
    );
    if (groupItemType !== GroupItemTypes.NoteBE) {
      throw new BadRequestException(
        `Group ${addNoteInput.groupID} is not a note group!`,
      );
    }
    return this.notesService.create(addNoteInput);
  }

  @Mutation()
  async updateNote(
    @Args('updateNoteInput') updateNoteInput: UpdateNoteInput,
  ): Promise<GroupItemUpdateResponse> {
    if (updateNoteInput.groupID) {
      const groupItemType = await this.groupsService.getTypeById(
        updateNoteInput.groupID,
      );
      if (groupItemType !== GroupItemTypes.NoteBE) {
        throw new BadRequestException(
          `Group ${updateNoteInput.groupID} is not a note group!`,
        );
      }
    }
    return this.notesService.update(updateNoteInput);
  }

  @Mutation()
  async removeNote(
    @Args('noteID') noteId: string,
  ): Promise<GroupItemDeletionResponse> {
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
