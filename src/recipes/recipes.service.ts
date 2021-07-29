import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateRecipeInput,
  DeletionResponse,
  FilterRecipesInput,
  RecipeDTO,
  UpdateRecipeInput,
} from '../graphql';
import RecipeMappers from './recipe.mappers';
import { RecipeBE } from './recipe.schema';
import slugify from 'slugify';

@Injectable()
export class RecipesService {
  private logger: Logger = new Logger('RecipesService');

  constructor(
    @InjectModel(RecipeBE.name)
    private readonly recipeModel: Model<RecipeBE>,
  ) {}

  public async findOneById(id: string): Promise<RecipeDTO> {
    const recipeBE = await this.recipeModel.findById(id);
    if (!recipeBE) {
      throw new NotFoundException(`Recipe ${id} not found`);
    }
    return RecipeMappers.BEtoDTO(recipeBE);
  }

  public async findOneBySlug(slug: string): Promise<RecipeDTO> {
    const recipeBE = await this.recipeModel.findOne({ slug: slug });
    if (!recipeBE) {
      throw new NotFoundException(`Recipe ${slug} not found`);
    }
    return RecipeMappers.BEtoDTO(recipeBE);
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
}
