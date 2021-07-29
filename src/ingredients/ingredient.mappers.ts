import { IngredientDTO } from '../graphql';
import { IngredientBE } from './ingredient.schema';

export default class IngredientMappers {
  static BEtoDTO(ingredientBE: IngredientBE): IngredientDTO {
    return {
      id: ingredientBE._id,
      recipeID: ingredientBE.recipeID,
      name: ingredientBE.name,
      amount: ingredientBE.amount,
      unit: ingredientBE.unit,
      sortNr: ingredientBE.sortNr,
    };
  }
}
