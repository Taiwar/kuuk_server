
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export interface FilterRecipesInput {
    name?: Nullable<string>;
    tags?: Nullable<string[]>;
}

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
    notes?: Nullable<string[]>;
    sourceLinks?: Nullable<string[]>;
    tags?: Nullable<string[]>;
    pictures?: Nullable<string[]>;
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
    notes?: Nullable<string[]>;
    sourceLinks?: Nullable<string[]>;
    tags?: Nullable<string[]>;
    pictures?: Nullable<string[]>;
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
    sortNr?: Nullable<number>;
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
    sortNr?: Nullable<number>;
}

export interface AddNoteInput {
    recipeID: string;
    name: string;
    description?: Nullable<string>;
}

export interface UpdateNoteInput {
    id: string;
    name?: Nullable<string>;
    description?: Nullable<string>;
    sortNr?: Nullable<number>;
}

export interface AddGroupInput {
    recipeID: string;
    name: string;
    itemType: string;
}

export interface UpdateGroupInput {
    id: string;
    name?: Nullable<string>;
    sortNr?: Nullable<number>;
}

export interface OrderedRecipeItem {
    id: string;
    recipeID: string;
    name: string;
    sortNr: number;
}

export interface GroupItem {
    groupID?: Nullable<string>;
}

export interface GroupDTO extends OrderedRecipeItem {
    id: string;
    recipeID: string;
    name: string;
    sortNr: number;
    itemType: string;
    items?: Nullable<OrderedRecipeItem[]>;
}

export interface StepDTO extends OrderedRecipeItem {
    id: string;
    recipeID: string;
    name: string;
    description?: Nullable<string>;
    picture?: Nullable<string>;
    sortNr: number;
}

export interface NoteDTO extends OrderedRecipeItem {
    id: string;
    recipeID: string;
    name: string;
    description?: Nullable<string>;
    sortNr: number;
}

export interface IngredientDTO extends OrderedRecipeItem {
    id: string;
    recipeID: string;
    name: string;
    amount: number;
    unit: string;
    sortNr: number;
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
    sourceLinks: string[];
    tags: string[];
    pictures: string[];
    ingredients?: Nullable<IngredientItem[]>;
    steps?: Nullable<StepItem[]>;
    notes?: Nullable<NoteItem[]>;
}

export interface DeletionResponse {
    id: string;
    success: boolean;
}

export interface IQuery {
    recipes(): RecipeDTO[] | Promise<RecipeDTO[]>;
    tags(): string[] | Promise<string[]>;
    ingredientNames(): string[] | Promise<string[]>;
    filterRecipes(filterRecipesInput?: Nullable<FilterRecipesInput>): Nullable<RecipeDTO>[] | Promise<Nullable<RecipeDTO>[]>;
    recipe(id: string): Nullable<RecipeDTO> | Promise<Nullable<RecipeDTO>>;
    recipeBySlug(slug: string): Nullable<RecipeDTO> | Promise<Nullable<RecipeDTO>>;
}

export interface IMutation {
    createRecipe(createRecipeInput?: Nullable<CreateRecipeInput>): Nullable<RecipeDTO> | Promise<Nullable<RecipeDTO>>;
    updateRecipe(updateRecipeInput?: Nullable<UpdateRecipeInput>): Nullable<RecipeDTO> | Promise<Nullable<RecipeDTO>>;
    deleteRecipe(id: string): Nullable<DeletionResponse> | Promise<Nullable<DeletionResponse>>;
    addIngredient(addIngredientInput?: Nullable<AddIngredientInput>): Nullable<IngredientDTO> | Promise<Nullable<IngredientDTO>>;
    addIngredientToGroup(ingredientID: string, groupID: string): Nullable<GroupDTO> | Promise<Nullable<GroupDTO>>;
    updateIngredient(updateIngredientInput?: Nullable<UpdateIngredientInput>): Nullable<IngredientDTO> | Promise<Nullable<IngredientDTO>>;
    removeIngredient(ingredientID: string, recipeID?: Nullable<string>): Nullable<DeletionResponse> | Promise<Nullable<DeletionResponse>>;
    addStep(addStepInput?: Nullable<AddStepInput>): Nullable<StepDTO> | Promise<Nullable<StepDTO>>;
    addStepToGroup(stepID: string, groupID: string): Nullable<GroupDTO> | Promise<Nullable<GroupDTO>>;
    updateStep(updateStepInput?: Nullable<UpdateStepInput>): Nullable<StepDTO> | Promise<Nullable<StepDTO>>;
    removeStep(stepID: string, recipeID?: Nullable<string>): Nullable<DeletionResponse> | Promise<Nullable<DeletionResponse>>;
    addNote(addNoteInput?: Nullable<AddNoteInput>): Nullable<NoteDTO> | Promise<Nullable<NoteDTO>>;
    addNoteToGroup(noteID: string, groupID: string): Nullable<GroupDTO> | Promise<Nullable<GroupDTO>>;
    updateNote(updateNoteInput?: Nullable<UpdateNoteInput>): Nullable<NoteDTO> | Promise<Nullable<NoteDTO>>;
    removeNote(noteID: string, recipeID?: Nullable<string>): Nullable<DeletionResponse> | Promise<Nullable<DeletionResponse>>;
    addGroup(addGroupInput?: Nullable<AddGroupInput>): Nullable<GroupDTO> | Promise<Nullable<GroupDTO>>;
    updateGroup(updateGroupInput?: Nullable<UpdateGroupInput>): Nullable<GroupDTO> | Promise<Nullable<GroupDTO>>;
    removeGroup(groupID: string, recipeID?: Nullable<string>): Nullable<DeletionResponse> | Promise<Nullable<DeletionResponse>>;
}

export type IngredientItem = IngredientDTO | GroupDTO;
export type StepItem = StepDTO | GroupDTO;
export type NoteItem = NoteDTO | GroupDTO;
type Nullable<T> = T | null;
