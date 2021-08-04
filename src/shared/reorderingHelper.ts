import { BadRequestException } from '@nestjs/common';
import { Model, UpdateWriteOpResult } from 'mongoose';
import { GroupBE } from '../groups/group.schema';
import { IngredientBE } from '../ingredients/ingredient.schema';
import { NoteBE } from '../notes/note.schema';
import { StepBE } from '../steps/step.schema';

export async function checkAllowedOrdering(
  prevSortNr: number | null,
  newSortNr: number,
  countInOrderGroup: number,
) {
  if (newSortNr && prevSortNr !== newSortNr) {
    if (newSortNr > countInOrderGroup) {
      throw new BadRequestException(
        `Can't update item with new sortNr ${newSortNr} because list only contains ${countInOrderGroup} items!`,
      );
    } else if (newSortNr < 0) {
      throw new BadRequestException(
        `Can't update item with new sortNr ${newSortNr}. SortNr has to be >=1 !`,
      );
    }
  }
}

export async function reorderOrderedItems(
  itemId: string,
  recipeId: string,
  model: Model<IngredientBE | StepBE | NoteBE | GroupBE>,
  prevSortNr: number,
  newSortNr: number,
  prevGroupId?: string | null,
  newGroupId?: string | null,
) {
  const isInGroup = !!prevGroupId;
  let isMovingGroups = false;
  if (isInGroup) {
    if (newGroupId && prevGroupId.toString() !== newGroupId.toString()) {
      isMovingGroups = true;
    }
  }
  if (prevSortNr !== newSortNr || isMovingGroups) {
    let filter: any;
    let update: any | undefined;
    if (!isMovingGroups && newSortNr > prevSortNr) {
      filter = {
        _id: { $ne: itemId },
        sortNr: { $lte: newSortNr },
      };
      update = {
        $inc: { sortNr: -1 },
      };
    } else {
      filter = {
        _id: { $ne: itemId },
        sortNr: { $gte: newSortNr },
      };
      update = {
        $inc: { sortNr: 1 },
      };
    }
    if (isInGroup) {
      if (isMovingGroups) {
        filter.groupID = newGroupId;
        // Handle removing item from prev group
        await reorderOrderedItemsAfterDelete(
          prevSortNr,
          recipeId,
          model,
          prevGroupId,
        );
      } else {
        filter.groupID = prevGroupId;
      }
    } else {
      filter.recipeID = recipeId;
    }
    return model.updateMany(filter, update);
  }
}

export async function reorderOrderedItemsAfterDelete(
  deletedSortNr: number,
  recipeId: string,
  model: Model<IngredientBE | StepBE | NoteBE | GroupBE>,
  groupId?: string | null,
): Promise<UpdateWriteOpResult> {
  const filter: any = {
    sortNr: { $gt: deletedSortNr },
  };
  if (groupId) {
    filter.groupID = groupId;
  } else {
    filter.recipeID = recipeId;
  }
  return model.updateMany(filter, {
    $inc: { sortNr: -1 },
  });
}
