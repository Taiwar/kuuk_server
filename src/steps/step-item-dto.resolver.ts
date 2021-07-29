import { ResolveField, Resolver } from '@nestjs/graphql';

@Resolver('StepItemDTO')
export class StepItemDtoResolver {
  @ResolveField()
  __resolveType(value) {
    if (value.description) {
      return 'StepDTO';
    }
    if (value.items) {
      return 'GroupDTO';
    }
    return null;
  }
}
