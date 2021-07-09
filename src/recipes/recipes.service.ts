import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AddIngredientInput,
  CreateRecipeInput,
  IngredientDTO,
  RecipeDTO,
  UpdateRecipeInput,
} from '../graphql';
import { IngredientsService } from '../ingredients/ingredients.service';
import RecipeMappers from './recipe.mappers';
import { RecipeBE } from './recipe.schema';

@Injectable()
export class RecipesService {
  private logger: Logger = new Logger('RecipesService');

  constructor(
    @InjectModel(RecipeBE.name)
    private readonly recipeModel: Model<RecipeBE>,
    private readonly ingredientsService: IngredientsService,
  ) {}

  public async findOneById(id: string): Promise<RecipeDTO> {
    return RecipeMappers.BEtoDTO(await this.recipeModel.findById(id));
  }

  public async create(
    createRecipeInput: CreateRecipeInput,
  ): Promise<RecipeDTO> {
    const newRecipeBE = await new this.recipeModel({
      name: createRecipeInput.name,
    });
    await newRecipeBE.save();

    return RecipeMappers.BEtoDTO(newRecipeBE);
  }

  public async update(
    updateRecipeInput: UpdateRecipeInput,
  ): Promise<RecipeDTO> {
    const recipeBE = await this.recipeModel.findByIdAndUpdate(
      updateRecipeInput.id,
      updateRecipeInput,
    );

    if (!recipeBE) {
      throw new NotFoundException(`Recipe #${updateRecipeInput.id} not found`);
    }

    return RecipeMappers.BEtoDTO(recipeBE);
  }

  public async delete(id: string): Promise<boolean> {
    return !!(await this.recipeModel.findByIdAndDelete(id));
  }

  async getAll(): Promise<RecipeDTO[]> {
    const recipeBEs = await this.recipeModel.find();
    this.logger.log('recipes', recipeBEs);
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
  ): Promise<boolean> {
    const removeResult = await this.recipeModel.findByIdAndUpdate(recipeId, {
      $pull: {
        ingredients: ingredientId,
      },
    });
    const deleteResult = await this.ingredientsService.delete(ingredientId);
    return deleteResult !== null && removeResult !== null;
  }
}
