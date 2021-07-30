import { ResolveField, Resolver } from '@nestjs/graphql';

@Resolver('OrderedRecipeItemDTO')
export class OrderedRecipeItemDtoResolver {
  @ResolveField()
  __resolveType(value) {
    if (value.amount !== undefined) {
      return 'IngredientDTO';
    }
    if (value.picture !== undefined) {
      return 'StepDTO';
    }
    if (value.description !== undefined) {
      return 'NoteDTO';
    }
    if (value.items !== undefined) {
      return 'GroupDTO';
    }
    return null;
  }
}
