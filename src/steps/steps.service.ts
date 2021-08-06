import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AddStepInput,
  GroupItemDeletionResponse,
  GroupItemUpdateResponse,
  StepDTO,
  UpdateStepInput,
} from '../graphql';
import {
  checkAllowedOrdering,
  checkItemOrderPostcondition,
  reorderOrderedItems,
  reorderOrderedItemsAfterDelete,
} from '../shared/reorderingHelper';
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

  public async countInOrderGroup(groupId: string): Promise<number> {
    return this.stepModel.countDocuments({
      groupID: groupId,
    });
  }

  public async create(addStepInput: AddStepInput): Promise<StepDTO> {
    const newStepBE = await new this.stepModel({
      recipeID: addStepInput.recipeID,
      name: addStepInput.name,
      description: addStepInput.description,
      picture: addStepInput.picture ?? '',
      sortNr: (await this.countInOrderGroup(addStepInput.groupID)) + 1,
      groupID: addStepInput.groupID,
    });
    await newStepBE.save();
    return StepMappers.BEtoDTO(newStepBE);
  }

  public async update(
    updateStepInput: UpdateStepInput,
  ): Promise<GroupItemUpdateResponse> {
    const stepDTO = await this.findOneById(updateStepInput.id);

    let count: number;
    const isMovingGroups =
      updateStepInput.groupID &&
      updateStepInput.groupID.toString() !== stepDTO.groupID.toString();
    if (isMovingGroups) {
      count = (await this.countInOrderGroup(updateStepInput.groupID)) + 1;
    } else {
      count = await this.countInOrderGroup(stepDTO.groupID);
    }

    await checkAllowedOrdering(stepDTO.sortNr, updateStepInput.sortNr, count);

    const update: UpdateStepInput = {
      id: updateStepInput.id,
      name: updateStepInput.name ?? undefined,
      description: updateStepInput.description ?? undefined,
      picture: updateStepInput.picture ?? undefined,
      groupID: updateStepInput.groupID ?? undefined,
      sortNr: updateStepInput.sortNr ?? undefined,
    };
    const stepBE = await this.stepModel.findByIdAndUpdate(update.id, update, {
      new: true,
      omitUndefined: true,
    });

    await reorderOrderedItems(
      stepBE.id,
      stepBE.recipeID,
      this.stepModel as Model<any>,
      stepDTO.sortNr,
      updateStepInput.sortNr,
      stepDTO.groupID,
      updateStepInput.groupID,
    );

    await checkItemOrderPostcondition(this.stepModel as Model<any>, {
      groupID: stepDTO.groupID,
    });

    if (isMovingGroups) {
      await checkItemOrderPostcondition(this.stepModel as Model<any>, {
        groupID: updateStepInput.groupID,
      });
    }

    return {
      item: StepMappers.BEtoDTO(stepBE),
      prevSortNr: stepDTO.sortNr,
      prevGroupID: stepDTO.groupID,
    };
  }

  public async delete(id: string): Promise<GroupItemDeletionResponse> {
    const deleteResult = await this.stepModel.findByIdAndDelete(id);
    const updateHigherSteps = await reorderOrderedItemsAfterDelete(
      deleteResult.sortNr,
      deleteResult.recipeID,
      this.stepModel as Model<any>,
      deleteResult.groupID,
    );
    return {
      id,
      groupID: deleteResult.groupID,
      success: !!updateHigherSteps,
      sortNr: deleteResult.sortNr,
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
