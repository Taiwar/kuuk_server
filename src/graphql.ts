
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export interface CreateRecipeInput {
    name: string;
    slug?: Nullable<string>;
    author?: Nullable<string>;
    prepTimeMin?: Nullable<number>;
    cookTimeMin?: Nullable<number>;
    totalTimeMin?: Nullable<number>;
    servings: number;
    rating?: Nullable<number>;
    description?: Nullable<string>;
    notes?: Nullable<Nullable<string>[]>;
    sourceLinks?: Nullable<Nullable<string>[]>;
    tags?: Nullable<Nullable<string>[]>;
    pictures?: Nullable<Nullable<string>[]>;
}

export interface UpdateRecipeInput {
    id: string;
    name?: Nullable<string>;
    slug?: Nullable<string>;
    author?: Nullable<string>;
    prepTimeMin?: Nullable<number>;
    cookTimeMin?: Nullable<number>;
    totalTimeMin?: Nullable<number>;
    servings?: Nullable<number>;
    rating?: Nullable<number>;
    description?: Nullable<string>;
    notes?: Nullable<Nullable<string>[]>;
    sourceLinks?: Nullable<Nullable<string>[]>;
    tags?: Nullable<Nullable<string>[]>;
    pictures?: Nullable<Nullable<string>[]>;
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

export interface AddStepInput {
    recipeID: string;
    name: string;
    description?: Nullable<string>;
    picture?: Nullable<string>;
}

export interface UpdateStepInput {
    id: string;
    name?: Nullable<string>;
    description?: Nullable<string>;
    picture?: Nullable<string>;
}

export interface StepDTO {
    id: string;
    name: string;
    description?: Nullable<string>;
    picture?: Nullable<string>;
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
    slug: string;
    author?: Nullable<string>;
    prepTimeMin?: Nullable<number>;
    cookTimeMin?: Nullable<number>;
    totalTimeMin?: Nullable<number>;
    servings: number;
    rating?: Nullable<number>;
    description?: Nullable<string>;
    notes: Nullable<string>[];
    sourceLinks: Nullable<string>[];
    tags: Nullable<string>[];
    pictures: Nullable<string>[];
    ingredients?: Nullable<IngredientDTO[]>;
    steps?: Nullable<StepDTO[]>;
}

export interface IQuery {
    recipes(): Nullable<Nullable<RecipeDTO>[]> | Promise<Nullable<Nullable<RecipeDTO>[]>>;
    recipe(id: string): Nullable<RecipeDTO> | Promise<Nullable<RecipeDTO>>;
    recipeBySlug(slug: string): Nullable<RecipeDTO> | Promise<Nullable<RecipeDTO>>;
}

export interface IMutation {
    createRecipe(createRecipeInput?: Nullable<CreateRecipeInput>): Nullable<RecipeDTO> | Promise<Nullable<RecipeDTO>>;
    updateRecipe(updateRecipeInput?: Nullable<UpdateRecipeInput>): Nullable<RecipeDTO> | Promise<Nullable<RecipeDTO>>;
    deleteRecipe(id: string): Nullable<boolean> | Promise<Nullable<boolean>>;
    addIngredient(addIngredientInput?: Nullable<AddIngredientInput>): Nullable<IngredientDTO> | Promise<Nullable<IngredientDTO>>;
    updateIngredient(updateIngredientInput?: Nullable<UpdateIngredientInput>): Nullable<IngredientDTO> | Promise<Nullable<IngredientDTO>>;
    removeIngredient(ingredientID: string, recipeID?: Nullable<string>): Nullable<boolean> | Promise<Nullable<boolean>>;
    addStep(addStepInput?: Nullable<AddStepInput>): Nullable<StepDTO> | Promise<Nullable<StepDTO>>;
    updateStep(updateStepInput?: Nullable<UpdateStepInput>): Nullable<StepDTO> | Promise<Nullable<StepDTO>>;
    removeStep(stepID: string, recipeID?: Nullable<string>): Nullable<boolean> | Promise<Nullable<boolean>>;
}

type Nullable<T> = T | null;
