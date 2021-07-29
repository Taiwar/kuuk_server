import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AddGroupInput,
  DeletionResponse,
  GroupDTO,
  OrderedRecipeItem,
  UpdateGroupInput,
} from '../graphql';
import { IngredientsService } from '../ingredients/ingredients.service';
import { NotesService } from '../notes/notes.service';
import { StepsService } from '../steps/steps.service';
import GroupMappers from './group.mappers';
import { GroupBE, GroupItemTypes } from './group.schema';

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

  public async findOneById(id: string): Promise<GroupDTO> {
    return GroupMappers.BEtoDTO(await this.groupModel.findById(id));
  }

  public async create(addGroupInput: AddGroupInput): Promise<GroupDTO> {
    const newGroupBE = await new this.groupModel({
      recipeID: addGroupInput.recipeID,
      name: addGroupInput.name,
      itemType: addGroupInput.itemType,
    });
    await newGroupBE.save();
    return GroupMappers.BEtoDTO(newGroupBE);
  }

  public async update(updateGroupInput: UpdateGroupInput): Promise<GroupDTO> {
    const update: UpdateGroupInput = {
      id: updateGroupInput.id,
      name: updateGroupInput.name ?? undefined,
      sortNr: updateGroupInput.sortNr ?? undefined,
    };
    const groupBE = await this.groupModel.findByIdAndUpdate(update.id, update, {
      new: true,
      omitUndefined: true,
    });

    if (!groupBE) {
      throw new NotFoundException(`Group ${updateGroupInput.id} not found`);
    }

    return GroupMappers.BEtoDTO(groupBE);
  }

  public async delete(id: string): Promise<boolean> {
    const deleteResult = await this.groupModel.findByIdAndDelete(id);
    return deleteResult !== null;
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

  public async addItem(
    itemId: string,
    itemType: GroupItemTypes,
    groupId: string,
  ): Promise<GroupDTO> {
    const groupDTO = await this.findOneById(groupId);
    if (!groupDTO) {
      throw new NotFoundException(`Group ${groupDTO.id} not found`);
    }

    if (groupDTO.itemType !== itemType) {
      throw new BadRequestException(
        `Group ${groupId} is not an ${itemType} group!`,
      );
    }

    let itemDTO: OrderedRecipeItem;
    switch (itemType) {
      case GroupItemTypes.IngredientBE:
        itemDTO = await this.ingredientsService.findOneById(itemId);
        break;
      case GroupItemTypes.StepBE:
        itemDTO = await this.stepsService.findOneById(itemId);
        break;
      case GroupItemTypes.NoteBE:
        itemDTO = await this.notesService.findOneById(itemId);
        break;
    }

    if (!itemDTO) {
      throw new NotFoundException(`${itemType} ${itemId} not found`);
    }
    if (groupDTO.recipeID !== itemDTO.recipeID) {
      throw new BadRequestException(
        `Group ${groupId} and ${itemType} ${itemId} are not in the same recipe!`,
      );
    }

    const groupBE = await this.groupModel.findByIdAndUpdate(groupId, {
      $addToSet: {
        items: itemId,
      },
    });

    return GroupMappers.BEtoDTO(groupBE);
  }

  public async removeItem(
    itemId: string,
    groupId: string,
  ): Promise<DeletionResponse> {
    const removeResult = await this.groupModel.findByIdAndUpdate(groupId, {
      $pull: {
        items: itemId,
      },
    });
    return {
      id: itemId,
      success: removeResult !== null,
    };
  }
}
