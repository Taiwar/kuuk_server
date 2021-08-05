import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AddIngredientInput,
  GroupItemDeletionResponse,
  IngredientDTO,
  IngredientUpdateResponse,
  UpdateIngredientInput,
} from '../graphql';
import {
  checkAllowedOrdering,
  reorderOrderedItems,
  reorderOrderedItemsAfterDelete,
} from '../shared/reorderingHelper';
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

  public async countInOrderGroup(groupId: string): Promise<number> {
    return this.ingredientModel.countDocuments({
      groupID: groupId,
    });
  }

  public async create(
    addIngredientInput: AddIngredientInput,
  ): Promise<IngredientDTO> {
    const newIngredientBE = await new this.ingredientModel({
      recipeID: addIngredientInput.recipeID,
      name: addIngredientInput.name,
      amount: addIngredientInput.amount,
      unit: addIngredientInput.unit,
      groupID: addIngredientInput.groupID,
      sortNr: (await this.countInOrderGroup(addIngredientInput.groupID)) + 1,
    });
    await newIngredientBE.save();
    return IngredientMappers.BEtoDTO(newIngredientBE);
  }

  public async update(
    updateIngredientInput: UpdateIngredientInput,
  ): Promise<IngredientUpdateResponse> {
    const ingredientDTO = await this.findOneById(updateIngredientInput.id);

    let count: number;
    if (
      updateIngredientInput.groupID &&
      updateIngredientInput.groupID !== ingredientDTO.groupID
    ) {
      count = (await this.countInOrderGroup(updateIngredientInput.groupID)) + 1;
    } else {
      count = await this.countInOrderGroup(ingredientDTO.groupID);
    }

    await checkAllowedOrdering(
      ingredientDTO.sortNr,
      updateIngredientInput.sortNr,
      count,
    );

    const update: UpdateIngredientInput = {
      id: updateIngredientInput.id,
      name: updateIngredientInput.name ?? undefined,
      amount: updateIngredientInput.amount ?? undefined,
      unit: updateIngredientInput.unit ?? undefined,
      groupID: updateIngredientInput.groupID ?? undefined,
      sortNr: updateIngredientInput.sortNr ?? undefined,
    };
    const ingredientBE = await this.ingredientModel.findByIdAndUpdate(
      update.id,
      update,
      { new: true, omitUndefined: true },
    );

    await reorderOrderedItems(
      ingredientBE.id,
      ingredientBE.recipeID,
      this.ingredientModel as Model<any>,
      ingredientDTO.sortNr,
      updateIngredientInput.sortNr,
      ingredientDTO.groupID,
      updateIngredientInput.groupID,
    );

    console.log('returning', {
      ...IngredientMappers.BEtoDTO(ingredientBE),
      prevSortNr: ingredientDTO.sortNr,
      prevGroupID: ingredientDTO.groupID,
    });

    return {
      ...IngredientMappers.BEtoDTO(ingredientBE),
      prevSortNr: ingredientDTO.sortNr,
      prevGroupID: ingredientDTO.groupID,
    };
  }

  public async delete(id: string): Promise<GroupItemDeletionResponse> {
    const deleteResult = await this.ingredientModel.findByIdAndDelete(id);
    const updateHigherIngredients = await reorderOrderedItemsAfterDelete(
      deleteResult.sortNr,
      deleteResult.recipeID,
      this.ingredientModel as Model<any>,
    );
    return {
      id,
      groupID: deleteResult.groupID,
      success: !!updateHigherIngredients,
      sortNr: deleteResult.sortNr,
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
