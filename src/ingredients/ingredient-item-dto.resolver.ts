import { ResolveField, Resolver } from '@nestjs/graphql';

@Resolver('IngredientItemDTO')
export class IngredientItemDtoResolver {
  @ResolveField()
  __resolveType(value) {
    if (value.amount) {
      return 'IngredientDTO';
    }
    if (value.items) {
      return 'GroupDTO';
    }
    return null;
  }
}
