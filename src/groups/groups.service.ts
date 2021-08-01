import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AddGroupInput,
  DeletionResponse,
  GroupDTO,
  UpdateGroupInput,
} from '../graphql';
import { IngredientsService } from '../ingredients/ingredients.service';
import { NotesService } from '../notes/notes.service';
import {
  checkAllowedOrdering,
  reorderOrderedItems,
  reorderOrderedItemsAfterDelete,
} from '../shared/reorderingHelper';
import { StepsService } from '../steps/steps.service';
import GroupMappers from './group.mappers';
import { DEFAULT_GROUP_NAME, GroupBE, GroupItemTypes } from './group.schema';

@Injectable()
export class GroupsService {
  private logger: Logger = new Logger('GroupsService');

  constructor(
    private readonly ingredientsService: IngredientsService,
    private readonly stepsService: StepsService,
    private readonly notesService: NotesService,
    @InjectModel(GroupBE.name)
    private readonly groupModel: Model<GroupBE>,
  ) {}

  public async countInOrderGroup(recipeId: string): Promise<number> {
    return this.groupModel.countDocuments({
      recipeID: recipeId,
    });
  }

  public async findOneById(id: string): Promise<GroupDTO> {
    return GroupMappers.BEtoDTO(await this.groupModel.findById(id));
  }

  public async create(addGroupInput: AddGroupInput): Promise<GroupDTO> {
    const newGroupBE = await new this.groupModel({
      recipeID: addGroupInput.recipeID,
      name: addGroupInput.name,
      itemType: addGroupInput.itemType,
      sortNr: (await this.countInOrderGroup(addGroupInput.recipeID)) + 1,
    });
    await newGroupBE.save();
    return GroupMappers.BEtoDTO(newGroupBE);
  }

  public async update(updateGroupInput: UpdateGroupInput): Promise<GroupDTO> {
    const groupDTO = await this.findOneById(updateGroupInput.id);
    if (groupDTO.name === DEFAULT_GROUP_NAME) {
      throw new BadRequestException('Cannot update default group!');
    }

    await checkAllowedOrdering(
      groupDTO.sortNr,
      updateGroupInput.sortNr,
      await this.countInOrderGroup(groupDTO.recipeID),
    );

    const update: UpdateGroupInput = {
      id: updateGroupInput.id,
      name: updateGroupInput.name ?? undefined,
      sortNr: updateGroupInput.sortNr ?? undefined,
    };
    const groupBE = await this.groupModel.findByIdAndUpdate(update.id, update, {
      new: true,
      omitUndefined: true,
    });

    await reorderOrderedItems(
      groupBE.id,
      groupBE.recipeID,
      this.groupModel as Model<any>,
      groupDTO.sortNr,
      updateGroupInput.sortNr,
    );

    return GroupMappers.BEtoDTO(groupBE);
  }

  public async delete(id: string): Promise<DeletionResponse> {
    const groupBE = await this.groupModel.findById(id);
    if (groupBE.name === DEFAULT_GROUP_NAME) {
      throw new BadRequestException('Cannot delete default group!');
    }
    const deleteResult = await this.groupModel.findByIdAndDelete(id);
    const updateHigherGroups = await reorderOrderedItemsAfterDelete(
      deleteResult.sortNr,
      deleteResult.recipeID,
      this.groupModel as Model<any>,
    );
    let deleteChildrenResult: boolean;
    switch (deleteResult.itemType) {
      case GroupItemTypes.IngredientBE:
        deleteChildrenResult = await this.ingredientsService.deleteByGroupId(
          deleteResult.id,
        );
        break;
      case GroupItemTypes.StepBE:
        deleteChildrenResult = await this.stepsService.deleteByGroupId(
          deleteResult.id,
        );
        break;
      case GroupItemTypes.NoteBE:
        deleteChildrenResult = await this.notesService.deleteByGroupId(
          deleteResult.id,
        );
        break;
    }
    return {
      id,
      success: !!updateHigherGroups && deleteChildrenResult,
    };
  }

  async findAllByRecipeIDAndItemType(
    id: string,
    itemType: string,
  ): Promise<GroupDTO[]> {
    const groupBEs = await this.groupModel.find({ recipeID: id, itemType });
    const groupDTOs = groupBEs.map((i) => GroupMappers.BEtoDTO(i));
    for (const groupDTO of groupDTOs) {
      switch (groupDTO.itemType) {
        case GroupItemTypes.IngredientBE:
          groupDTO.items = await this.ingredientsService.findAllByGroupID(
            groupDTO.id,
          );
          break;
        case GroupItemTypes.StepBE:
          groupDTO.items = await this.stepsService.findAllByGroupID(
            groupDTO.id,
          );
          break;
        case GroupItemTypes.NoteBE:
          groupDTO.items = await this.notesService.findAllByGroupID(
            groupDTO.id,
          );
          break;
      }
    }
    return groupDTOs;
  }
}
