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
    const allowedHighestNumber = countInOrderGroup + 1;
    if (newSortNr > allowedHighestNumber) {
      throw new BadRequestException(
        `Can't update item with new sortNr ${newSortNr} because list only contains ${allowedHighestNumber} items!`,
      );
    } else if (newSortNr < 0) {
      throw new BadRequestException(
        `Can't update item with new sortNr ${newSortNr}. SortNr has to be positive!`,
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
) {
  if (prevSortNr !== newSortNr) {
    if (newSortNr > prevSortNr) {
      await model.updateMany(
        {
          id: { $ne: itemId },
          recipeID: recipeId,
          sortNr: { $lte: newSortNr },
        },
        {
          $inc: { sortNr: -1 },
        },
      );
    } else {
      await model.updateMany(
        {
          id: { $ne: itemId },
          recipeID: recipeId,
          sortNr: { $gte: newSortNr },
        },
        {
          $inc: { sortNr: 1 },
        },
      );
    }
  }
}

export async function reorderOrderedItemsAfterDelete(
  deletedSortNr: number,
  recipeId: string,
  model: Model<IngredientBE | StepBE | NoteBE | GroupBE>,
): Promise<UpdateWriteOpResult> {
  return model.updateMany(
    {
      recipeID: recipeId,
      sortNr: { $gt: deletedSortNr },
    },
    {
      $inc: { sortNr: -1 },
    },
  );
}
