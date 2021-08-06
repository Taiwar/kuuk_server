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
    } else if (newSortNr < 1) {
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
  const isChangingSortNr = prevSortNr !== newSortNr;
  const isMovingGroups =
    isInGroup && newGroupId && prevGroupId.toString() !== newGroupId.toString();
  if (!isChangingSortNr && !isMovingGroups) {
    return;
  }

  let filter: any;
  let update: any;
  if (newSortNr > prevSortNr) {
    filter = {
      _id: { $ne: itemId },
      sortNr: { $lte: newSortNr },
    };
    if (!isMovingGroups) {
      filter.sortNr = {
        ...filter.sortNr,
        $gt: prevSortNr,
      };
    }
    update = {
      $inc: { sortNr: -1 },
    };
  } else {
    filter = {
      _id: { $ne: itemId },
      sortNr: { $gte: newSortNr },
    };
    if (!isMovingGroups) {
      filter.sortNr = {
        ...filter.sortNr,
        $lt: prevSortNr,
      };
    }
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
  if (!filter || !update) return;
  return model.updateMany(filter, update);
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

// TODO: Using this function is a band-aid solution that is probably less efficient than fixing the reordering logic to be consistent
export async function checkItemOrderPostcondition(
  model: Model<IngredientBE | StepBE | NoteBE | GroupBE>,
  filter: {
    recipeID?: string | null;
    groupID?: string | null;
  },
): Promise<void> {
  if (!filter.recipeID && !filter.groupID) {
    throw new Error(
      'checkItemOrderPostcondition: Filter requires either a recipeID or groupID!',
    );
  }
  const items = await model.find(filter, '_id sortNr', {
    sort: {
      sortNr: 1,
    },
  });
  let hadToFix = 0;
  for (let i = 1; i <= items.length; i++) {
    const item = items[i - 1];
    if (i !== item.sortNr) {
      await model.findByIdAndUpdate(item._id, { sortNr: i });
      hadToFix++;
    }
  }
  console.log('Completed Postcondition check. Had to fix:', hadToFix);
}
