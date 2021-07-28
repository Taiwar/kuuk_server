import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddStepInput, StepDTO, UpdateStepInput } from '../graphql';
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
    return StepMappers.BEtoDTO(await this.stepModel.findById(id));
  }

  public async create(addStepInput: AddStepInput): Promise<StepDTO> {
    const newStepBE = await new this.stepModel({
      recipeID: addStepInput.recipeID,
      name: addStepInput.name,
      description: addStepInput.description,
      picture: addStepInput.picture,
      group: addStepInput.group,
    });
    await newStepBE.save();
    return StepMappers.BEtoDTO(newStepBE);
  }

  public async update(updateStepInput: UpdateStepInput): Promise<StepDTO> {
    const update: UpdateStepInput = {
      id: updateStepInput.id,
      name: updateStepInput.name ?? undefined,
      description: updateStepInput.description ?? undefined,
      picture: updateStepInput.picture ?? undefined,
      sortNr: updateStepInput.sortNr ?? undefined,
      group: updateStepInput.group ?? undefined,
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

  public async delete(id: string): Promise<boolean> {
    const deleteResult = await this.stepModel.findByIdAndDelete(id);
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
}
