import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AddIngredientInput,
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
    return IngredientMappers.BEtoDTO(await this.ingredientModel.findById(id));
  }

  public async create(
    addIngredientInput: AddIngredientInput,
  ): Promise<IngredientDTO> {
    const newIngredientBE = await new this.ingredientModel({
      name: addIngredientInput.name,
      amount: addIngredientInput.amount,
      unit: addIngredientInput.unit,
    });
    await newIngredientBE.save();
    return IngredientMappers.BEtoDTO(newIngredientBE);
  }

  public async update(
    updateIngredientInput: UpdateIngredientInput,
  ): Promise<IngredientDTO> {
    const ingredientBE = await this.ingredientModel.findByIdAndUpdate(
      updateIngredientInput.id,
      updateIngredientInput,
    );

    if (!ingredientBE) {
      throw new NotFoundException(
        `Ingredient #${updateIngredientInput.id} not found`,
      );
    }

    return IngredientMappers.BEtoDTO(ingredientBE);
  }

  public async delete(id: string): Promise<boolean> {
    const deleteResult = await this.ingredientModel.findByIdAndDelete(id);
    return deleteResult !== null;
  }

  async getAll(): Promise<IngredientDTO[]> {
    return (await this.ingredientModel.find()).map((i) =>
      IngredientMappers.BEtoDTO(i),
    );
  }

  async getAllNames(): Promise<string[]> {
    return (await this.ingredientModel.find().select('name').exec()).map(
      (i) => i.name,
    );
  }

  async findAllByRecipeID(id: string): Promise<IngredientDTO[]> {
    return (await this.ingredientModel.find({ recipeID: id })).map((i) =>
      IngredientMappers.BEtoDTO(i),
    );
  }
}
