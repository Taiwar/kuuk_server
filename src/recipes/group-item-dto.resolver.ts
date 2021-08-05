import { ResolveField, Resolver } from '@nestjs/graphql';

@Resolver('GroupItemDTO')
export class GroupItemDtoResolver {
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
    return null;
  }
}
