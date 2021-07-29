import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AddIngredientInput,
  DeletionResponse,
  IngredientDTO,
  UpdateIngredientInput,
} from '../graphql';
import IngredientMappers from './ingredient.mappers';
import { IngredientBE } from './ingredient.schema';

@Injectable()
export class IngredientsService {
  private logger: Logger = new Logger('IngredientsService');

  constructor(
    @InjectModel(IngredientBE.name)
    private readonly ingredientModel: Model<IngredientBE>,
  ) {}

  public async findOneById(id: string): Promise<IngredientDTO> {
    const ingredientBE = await this.ingredientModel.findById(id);
    if (!ingredientBE) {
      throw new NotFoundException(`Ingredient ${id} not found`);
    }
    return IngredientMappers.BEtoDTO(ingredientBE);
  }
  public async countInOrderGroup(
    recipeId: string,
    groupId = null,
  ): Promise<number> {
    let count: number;
    if (groupId) {
      count = await this.ingredientModel.countDocuments({
        groupID: groupId,
      });
    } else {
      count = await this.ingredientModel.countDocuments({
        recipeID: recipeId,
      });
    }
    return count;
  }

  public async create(
    addIngredientInput: AddIngredientInput,
  ): Promise<IngredientDTO> {
    const newIngredientBE = await new this.ingredientModel({
      recipeID: addIngredientInput.recipeID,
      name: addIngredientInput.name,
      amount: addIngredientInput.amount,
      unit: addIngredientInput.unit,
      sortNr: (await this.countInOrderGroup(addIngredientInput.recipeID)) + 1, // This asserts that when an item get deleted, the sortNr of the remaining items are adjusted to always start at 1 and leave NO spaces
    });
    await newIngredientBE.save();
    return IngredientMappers.BEtoDTO(newIngredientBE);
  }

  public async update(
    updateIngredientInput: UpdateIngredientInput,
  ): Promise<IngredientDTO> {
    const update: UpdateIngredientInput = {
      id: updateIngredientInput.id,
      name: updateIngredientInput.name ?? undefined,
      amount: updateIngredientInput.amount ?? undefined,
      unit: updateIngredientInput.unit ?? undefined,
      sortNr: updateIngredientInput.sortNr ?? undefined,
    };
    const ingredientBE = await this.ingredientModel.findByIdAndUpdate(
      update.id,
      update,
      { new: true, omitUndefined: true },
    );

    if (!ingredientBE) {
      throw new NotFoundException(
        `Ingredient #${updateIngredientInput.id} not found`,
      );
    }

    return IngredientMappers.BEtoDTO(ingredientBE);
  }

  public async delete(id: string): Promise<DeletionResponse> {
    // TODO: Reorder other ingredients in recipe/group
    const deleteResult = await this.ingredientModel.findByIdAndDelete(id);
    return {
      id,
      success: deleteResult !== null,
    };
  }

  public async deleteByGroupId(groupId: string): Promise<boolean> {
    const deleteResult = await this.ingredientModel.deleteMany({
      groupID: groupId,
    });
    return deleteResult !== null;
  }

  async getAll(): Promise<IngredientDTO[]> {
    return (await this.ingredientModel.find()).map((i) =>
      IngredientMappers.BEtoDTO(i),
    );
  }

  async getAllNames(): Promise<string[]> {
    return this.ingredientModel.distinct('name');
  }

  async findAllByRecipeID(id: string): Promise<IngredientDTO[]> {
    return (await this.ingredientModel.find({ recipeID: id })).map((i) =>
      IngredientMappers.BEtoDTO(i),
    );
  }

  async findAllByGroupID(id: string): Promise<IngredientDTO[]> {
    return (await this.ingredientModel.find({ groupID: id })).map((i) =>
      IngredientMappers.BEtoDTO(i),
    );
  }
}
