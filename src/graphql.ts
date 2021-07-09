
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export interface CreateRecipeInput {
    name: string;
    ingredientIDs?: Nullable<Nullable<string>[]>;
}

export interface UpdateRecipeInput {
    id: string;
    name?: Nullable<string>;
}

export interface AddIngredientInput {
    recipeID: string;
    name: string;
    amount: number;
    unit: string;
}

export interface UpdateIngredientInput {
    id: string;
    name?: Nullable<string>;
    amount?: Nullable<number>;
    unit?: Nullable<string>;
}

export interface IngredientDTO {
    id: string;
    name: string;
    amount: number;
    unit: string;
}

export interface RecipeDTO {
    id: string;
    name: string;
    ingredients?: Nullable<Nullable<IngredientDTO>[]>;
}

export interface IQuery {
    recipes(): Nullable<Nullable<RecipeDTO>[]> | Promise<Nullable<Nullable<RecipeDTO>[]>>;
    recipe(id: string): Nullable<RecipeDTO> | Promise<Nullable<RecipeDTO>>;
    recipeIngredients(): Nullable<Nullable<IngredientDTO>[]> | Promise<Nullable<Nullable<IngredientDTO>[]>>;
    ingredient(id: string): Nullable<IngredientDTO> | Promise<Nullable<IngredientDTO>>;
}

export interface IMutation {
    createRecipe(createRecipeInput?: Nullable<CreateRecipeInput>): Nullable<RecipeDTO> | Promise<Nullable<RecipeDTO>>;
    updateRecipe(updateRecipeInput?: Nullable<UpdateRecipeInput>): Nullable<RecipeDTO> | Promise<Nullable<RecipeDTO>>;
    deleteRecipe(id: string): Nullable<boolean> | Promise<Nullable<boolean>>;
    addIngredient(addIngredientInput?: Nullable<AddIngredientInput>): Nullable<IngredientDTO> | Promise<Nullable<IngredientDTO>>;
    updateIngredient(updateIngredientInput?: Nullable<UpdateIngredientInput>): Nullable<IngredientDTO> | Promise<Nullable<IngredientDTO>>;
    removeIngredient(ingredientID: string, recipeID?: Nullable<string>): Nullable<boolean> | Promise<Nullable<boolean>>;
}

type Nullable<T> = T | null;
