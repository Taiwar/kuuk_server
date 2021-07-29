import { GroupDTO } from '../graphql';
import { GroupBE } from './group.schema';

export default class GroupMappers {
  static BEtoDTO(groupBE: GroupBE): GroupDTO {
    return {
      id: groupBE._id,
      recipeID: groupBE.recipeID,
      name: groupBE.name,
      itemType: groupBE.itemType,
      sortNr: groupBE.sortNr,
    };
  }
}
