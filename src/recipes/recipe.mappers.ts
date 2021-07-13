import { RecipeDTO } from '../graphql';
import { RecipeBE } from './recipe.schema';

export default class RecipeMappers {
  static BEtoDTO(recipeBE: RecipeBE): RecipeDTO {
    return {
      id: recipeBE._id,
      name: recipeBE.name,
      tags: recipeBE.tags,
      pictures: recipeBE.pictures,
    };
  }
}
