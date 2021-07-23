import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AddIngredientInput,
  AddStepInput,
  CreateRecipeInput,
  DeletionResponse,
  FilterRecipesInput,
  IngredientDTO,
  RecipeDTO,
  StepDTO,
  UpdateRecipeInput,
} from '../graphql';
import { IngredientsService } from '../ingredients/ingredients.service';
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

    const shouldApplyNameFilter = filterRecipesInput.name !== null;
    const shouldApplyTagsFilter = filterRecipesInput.tags;

    if (shouldApplyNameFilter) {
      query = { ...query, $text: { $search: filterRecipesInput.name } };
    }

    if (shouldApplyTagsFilter) {
      query = { ...query, tags: { $in: filterRecipesInput.tags } };
    }

    const recipeBEs = await this.recipeModel.find(query);
    this.logger.log('Filter result', recipeBEs);
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
}
