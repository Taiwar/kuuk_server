import { RecipeDTO } from '../graphql';
import { RecipeBE } from './recipe.schema';

export default class RecipeMappers {
  static BEtoDTO(recipeBE: RecipeBE): RecipeDTO {
    return {
      id: recipeBE._id,
      name: recipeBE.name,
      slug: recipeBE.slug,
      author: recipeBE.author,
      description: recipeBE.description,
      prepTimeMin: recipeBE.prepTimeMin,
      cookTimeMin: recipeBE.cookTimeMin,
      totalTimeMin: recipeBE.totalTimeMin,
      notes: recipeBE.notes,
      rating: recipeBE.rating,
      sourceLinks: recipeBE.sourceLinks,
      servings: recipeBE.servings,
      tags: recipeBE.tags,
      pictures: recipeBE.pictures,
    };
  }
}
