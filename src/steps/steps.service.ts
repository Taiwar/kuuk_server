import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AddStepInput,
  DeletionResponse,
  StepDTO,
  UpdateStepInput,
} from '../graphql';
import StepMappers from './step.mappers';
import { StepBE } from './step.schema';

@Injectable()
export class StepsService {
  private logger: Logger = new Logger('StepsService');

  constructor(
    @InjectModel(StepBE.name)
    private readonly stepModel: Model<StepBE>,
  ) {}

  public async findOneById(id: string): Promise<StepDTO> {
    const stepBE = await this.stepModel.findById(id);
    if (!stepBE) {
      throw new NotFoundException(`Step ${id} not found`);
    }
    return StepMappers.BEtoDTO(stepBE);
  }

  public async countInOrderGroup(
    recipeId: string,
    groupId = null,
  ): Promise<number> {
    let count: number;
    if (groupId) {
      count = await this.stepModel.countDocuments({
        groupID: groupId,
      });
    } else {
      count = await this.stepModel.countDocuments({
        recipeID: recipeId,
      });
    }
    return count;
  }

  public async create(addStepInput: AddStepInput): Promise<StepDTO> {
    const newStepBE = await new this.stepModel({
      recipeID: addStepInput.recipeID,
      name: addStepInput.name,
      description: addStepInput.description,
      picture: addStepInput.picture,
    });
    await newStepBE.save();
    return StepMappers.BEtoDTO(newStepBE);
  }

  public async update(updateStepInput: UpdateStepInput): Promise<StepDTO> {
    // TODO: Reorder other steps in recipe/group
    const update: UpdateStepInput = {
      id: updateStepInput.id,
      name: updateStepInput.name ?? undefined,
      description: updateStepInput.description ?? undefined,
      picture: updateStepInput.picture ?? undefined,
      sortNr: updateStepInput.sortNr ?? undefined,
    };
    const stepBE = await this.stepModel.findByIdAndUpdate(update.id, update, {
      new: true,
      omitUndefined: true,
    });

    if (!stepBE) {
      throw new NotFoundException(`Step #${updateStepInput.id} not found`);
    }

    return StepMappers.BEtoDTO(stepBE);
  }

  public async delete(id: string): Promise<DeletionResponse> {
    // TODO: Reorder other steps in recipe/group
    const deleteResult = await this.stepModel.findByIdAndDelete(id);
    return {
      id,
      success: deleteResult !== null,
    };
  }

  public async deleteByGroupId(groupId: string): Promise<boolean> {
    const deleteResult = await this.stepModel.deleteMany({
      groupID: groupId,
    });
    return deleteResult !== null;
  }

  async getAll(): Promise<StepDTO[]> {
    return (await this.stepModel.find()).map((i) => StepMappers.BEtoDTO(i));
  }

  async getAllNames(): Promise<string[]> {
    return (await this.stepModel.find().select('name').exec()).map(
      (i) => i.name,
    );
  }

  async findAllByRecipeID(id: string): Promise<StepDTO[]> {
    return (await this.stepModel.find({ recipeID: id })).map((i) =>
      StepMappers.BEtoDTO(i),
    );
  }

  async findAllByGroupID(id: string): Promise<StepDTO[]> {
    return (await this.stepModel.find({ groupID: id })).map((i) =>
      StepMappers.BEtoDTO(i),
    );
  }
}
