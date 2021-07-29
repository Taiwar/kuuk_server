import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
  NoteDTO,
  RecipeDTO,
  StepDTO,
  UpdateRecipeInput,
} from '../graphql';
import { GroupItemTypes } from '../groups/group.schema';
import { GroupsService } from '../groups/groups.service';
import { IngredientsService } from '../ingredients/ingredients.service';
import { NotesService } from '../notes/notes.service';
import { StepsService } from '../steps/steps.service';
import RecipeMappers from './recipe.mappers';
import { RecipeBE } from './recipe.schema';
import slugify from 'slugify';

@Injectable()
export class RecipesService {
  private logger: Logger = new Logger('RecipesService');

  constructor(
    @InjectModel(RecipeBE.name)
    private readonly recipeModel: Model<RecipeBE>,
    private readonly ingredientsService: IngredientsService,
    private readonly stepsService: StepsService,
    private readonly notesService: NotesService,
    private readonly groupsService: GroupsService,
  ) {}

  public async findOneById(id: string): Promise<RecipeDTO> {
    return RecipeMappers.BEtoDTO(await this.recipeModel.findById(id));
  }

  public async findOneBySlug(slug: string): Promise<RecipeDTO> {
    return RecipeMappers.BEtoDTO(
      await this.recipeModel.findOne({ slug: slug }),
    );
  }

  public async filter(
    filterRecipesInput: FilterRecipesInput,
  ): Promise<RecipeDTO[]> {
    const shouldApplyFilters = !!filterRecipesInput;
    let query = {};

    if (!shouldApplyFilters) {
      return this.getAll();
    }

    this.logger.log('filtering for', JSON.stringify(filterRecipesInput));

    const tags = filterRecipesInput.tags.filter((t) => t.length > 0);

    const shouldApplyNameFilter =
      filterRecipesInput.name !== null && filterRecipesInput.name.length > 0;
    const shouldApplyTagsFilter = tags.length > 0;

    if (shouldApplyNameFilter) {
      query = { ...query, $text: { $search: filterRecipesInput.name } };
    }

    if (shouldApplyTagsFilter) {
      query = { ...query, tags: { $all: filterRecipesInput.tags } };
    }

    this.logger.log('constructed query', query);

    const recipeBEs = await this.recipeModel.find(query);
    return recipeBEs.map((r) => RecipeMappers.BEtoDTO(r));
  }

  public async create(
    createRecipeInput: CreateRecipeInput,
  ): Promise<RecipeDTO> {
    const generatedSlug = slugify(createRecipeInput.name);
    const newRecipeBE = await new this.recipeModel({
      name: createRecipeInput.name,
      slug: createRecipeInput.slug ?? generatedSlug,
      author: createRecipeInput.author,
      description: createRecipeInput.description,
      prepTimeMin: createRecipeInput.prepTimeMin,
      cookTimeMin: createRecipeInput.cookTimeMin,
      totalTimeMin: createRecipeInput.totalTimeMin,
      notes: createRecipeInput.notes,
      rating: createRecipeInput.rating,
      sourceLinks: createRecipeInput.sourceLinks,
      servings: createRecipeInput.servings,
      tags: createRecipeInput.tags,
      pictures: createRecipeInput.pictures,
    });
    await newRecipeBE.save();

    return RecipeMappers.BEtoDTO(newRecipeBE);
  }

  public async update(
    updateRecipeInput: UpdateRecipeInput,
  ): Promise<RecipeDTO> {
    const update: UpdateRecipeInput = {
      id: updateRecipeInput.id,
      name: updateRecipeInput.name ?? undefined,
      slug: updateRecipeInput.slug ?? undefined,
      author: updateRecipeInput.author ?? undefined,
      prepTimeMin: updateRecipeInput.prepTimeMin ?? undefined,
      cookTimeMin: updateRecipeInput.cookTimeMin ?? undefined,
      totalTimeMin: updateRecipeInput.totalTimeMin ?? undefined,
      servings: updateRecipeInput.servings ?? undefined,
      rating: updateRecipeInput.rating ?? undefined,
      description: updateRecipeInput.description ?? undefined,
      notes: updateRecipeInput.notes ?? undefined,
      sourceLinks: updateRecipeInput.sourceLinks ?? undefined,
      tags: updateRecipeInput.tags ?? undefined,
      pictures: updateRecipeInput.pictures ?? undefined,
    };
    const recipeBE = await this.recipeModel.findByIdAndUpdate(
      update.id,
      update,
      { new: true, omitUndefined: true },
    );

    if (!recipeBE) {
      throw new NotFoundException(`Recipe #${updateRecipeInput.id} not found`);
    }

    return RecipeMappers.BEtoDTO(recipeBE);
  }

  public async delete(id: string): Promise<DeletionResponse> {
    return {
      id,
      success: !!(await this.recipeModel.findByIdAndDelete(id)),
    };
  }

  async getAll(): Promise<RecipeDTO[]> {
    const recipeBEs = await this.recipeModel.find();
    return recipeBEs.map((r) => RecipeMappers.BEtoDTO(r));
  }

  async getAllTags(): Promise<string[]> {
    return this.recipeModel.distinct('tags');
  }

  public async addIngredient(
    addIngredientInput: AddIngredientInput,
  ): Promise<IngredientDTO> {
    const newIngredientDTO = await this.ingredientsService.create(
      addIngredientInput,
    );
    this.recipeModel.findByIdAndUpdate(addIngredientInput.recipeID, {
      $addToSet: {
        ingredients: newIngredientDTO.id,
      },
    });
    return newIngredientDTO;
  }

  public async removeIngredient(
    ingredientId: string,
    recipeId: string,
  ): Promise<DeletionResponse> {
    const removeResult = await this.recipeModel.findByIdAndUpdate(recipeId, {
      $pull: {
        ingredients: ingredientId,
      },
    });
    const deleteResult = await this.ingredientsService.delete(ingredientId);
    return {
      id: ingredientId,
      success: deleteResult !== null && removeResult !== null,
    };
  }

  public async addStep(addStepInput: AddStepInput): Promise<StepDTO> {
    const newStepDTO = await this.stepsService.create(addStepInput);
    this.recipeModel.findByIdAndUpdate(addStepInput.recipeID, {
      $addToSet: {
        steps: newStepDTO.id,
      },
    });
    return newStepDTO;
  }

  public async removeStep(
    stepId: string,
    recipeId: string,
  ): Promise<DeletionResponse> {
    const removeResult = await this.recipeModel.findByIdAndUpdate(recipeId, {
      $pull: {
        steps: stepId,
      },
    });
    const deleteResult = await this.stepsService.delete(stepId);
    return {
      id: stepId,
      success: deleteResult !== null && removeResult !== null,
    };
  }

  public async addNote(addNoteInput: AddNoteInput): Promise<NoteDTO> {
    const newNoteDTO = await this.notesService.create(addNoteInput);
    this.recipeModel.findByIdAndUpdate(addNoteInput.recipeID, {
      $addToSet: {
        notes: newNoteDTO.id,
      },
    });
    return newNoteDTO;
  }

  public async removeNote(
    noteId: string,
    recipeId: string,
  ): Promise<DeletionResponse> {
    const removeResult = await this.recipeModel.findByIdAndUpdate(recipeId, {
      $pull: {
        notes: noteId,
      },
    });
    const deleteResult = await this.notesService.delete(noteId);
    return {
      id: noteId,
      success: deleteResult !== null && removeResult !== null,
    };
  }

  public async addGroup(addGroupInput: AddGroupInput): Promise<GroupDTO> {
    const newGroupDTO = await this.groupsService.create(addGroupInput);
    let recipeUpdate = {};
    switch (addGroupInput.itemType) {
      case GroupItemTypes.IngredientBE:
        recipeUpdate = {
          $addToSet: {
            ingredients: newGroupDTO.id,
          },
        };
        break;
      case GroupItemTypes.StepBE:
        recipeUpdate = {
          $addToSet: {
            steps: newGroupDTO.id,
          },
        };
        break;
      case GroupItemTypes.NoteBE:
        recipeUpdate = {
          $addToSet: {
            notes: newGroupDTO.id,
          },
        };
        break;
    }
    this.recipeModel.findByIdAndUpdate(addGroupInput.recipeID, recipeUpdate);
    return newGroupDTO;
  }

  public async removeGroup(
    groupId: string,
    recipeId: string,
  ): Promise<DeletionResponse> {
    const groupDTO = await this.groupsService.findOneById(groupId);
    if (!groupDTO) {
      throw new NotFoundException(`Group #${groupId} not found`);
    }
    let removeQuery = {};
    let deleteItemsResult;
    switch (groupDTO.itemType) {
      case 'IngredientDTO':
        removeQuery = {
          $pull: {
            ingredients: groupId,
          },
        };
        deleteItemsResult = this.ingredientsService.deleteByGroupId(groupId);
        break;
      case 'StepDTO':
        removeQuery = {
          $pull: {
            steps: groupId,
          },
        };
        deleteItemsResult = this.stepsService.deleteByGroupId(groupId);
        break;
      case 'NoteDTO':
        removeQuery = {
          $pull: {
            notes: groupId,
          },
        };
        deleteItemsResult = this.notesService.deleteByGroupId(groupId);
        break;
    }
    const removeResult = await this.recipeModel.findByIdAndUpdate(
      recipeId,
      removeQuery,
    );
    const deleteResult = await this.groupsService.delete(groupId);
    return {
      id: groupId,
      success:
        deleteResult !== null &&
        removeResult !== null &&
        deleteItemsResult !== null,
    };
  }
}
