import { ResolveField, Resolver } from '@nestjs/graphql';

@Resolver('NoteItemDTO')
export class NoteItemDtoResolver {
  @ResolveField()
  __resolveType(value) {
    if (value.description) {
      return 'NoteDTO';
    }
    if (value.items) {
      return 'GroupDTO';
    }
    return null;
  }
}
