
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
    groupID: string;
}

export interface UpdateIngredientInput {
    id: string;
    name?: Nullable<string>;
    amount?: Nullable<number>;
    unit?: Nullable<string>;
    sortNr?: Nullable<number>;
    groupID?: Nullable<string>;
}

export interface AddStepInput {
    recipeID: string;
    name: string;
    description?: Nullable<string>;
    picture?: Nullable<string>;
    groupID: string;
}

export interface UpdateStepInput {
    id: string;
    name?: Nullable<string>;
    description?: Nullable<string>;
    picture?: Nullable<string>;
    sortNr?: Nullable<number>;
    groupID?: Nullable<string>;
}

export interface AddNoteInput {
    recipeID: string;
    name: string;
    description?: Nullable<string>;
    groupID: string;
}

export interface UpdateNoteInput {
    id: string;
    name?: Nullable<string>;
    description?: Nullable<string>;
    sortNr?: Nullable<number>;
    groupID?: Nullable<string>;
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

export interface OrderedRecipeItemDTO {
    id: string;
    recipeID: string;
    name: string;
    sortNr: number;
}

export interface GroupItem {
    groupID: string;
}

export interface Ingredient {
    id: string;
    recipeID: string;
    name: string;
    amount: number;
    unit: string;
    sortNr: number;
    groupID: string;
}

export interface ReorderInfo {
    prevSortNr?: Nullable<number>;
    prevGroupID?: Nullable<string>;
}

export interface GroupDTO extends OrderedRecipeItemDTO {
    id: string;
    recipeID: string;
    name: string;
    sortNr: number;
    itemType: string;
    items: OrderedRecipeItemDTO[];
}

export interface StepDTO extends OrderedRecipeItemDTO, GroupItem {
    id: string;
    recipeID: string;
    name: string;
    description?: Nullable<string>;
    picture?: Nullable<string>;
    sortNr: number;
    groupID: string;
}

export interface NoteDTO extends OrderedRecipeItemDTO, GroupItem {
    id: string;
    recipeID: string;
    name: string;
    description?: Nullable<string>;
    sortNr: number;
    groupID: string;
}

export interface IngredientDTO extends Ingredient, OrderedRecipeItemDTO, GroupItem {
    id: string;
    recipeID: string;
    name: string;
    amount: number;
    unit: string;
    sortNr: number;
    groupID: string;
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
    ingredients?: Nullable<GroupDTO[]>;
    steps?: Nullable<GroupDTO[]>;
    notes?: Nullable<GroupDTO[]>;
}

export interface DeletionResponse {
    id: string;
    success: boolean;
}

export interface GroupItemDeletionResponse extends GroupItem {
    id: string;
    groupID: string;
    success: boolean;
    sortNr: number;
}

export interface GroupItemUpdateResponse extends ReorderInfo {
    item: GroupItemDTO;
    prevSortNr?: Nullable<number>;
    prevGroupID?: Nullable<string>;
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
    importRecipe(url: string): Nullable<RecipeDTO> | Promise<Nullable<RecipeDTO>>;
    updateRecipe(updateRecipeInput?: Nullable<UpdateRecipeInput>): Nullable<RecipeDTO> | Promise<Nullable<RecipeDTO>>;
    deleteRecipe(id: string): Nullable<DeletionResponse> | Promise<Nullable<DeletionResponse>>;
    addIngredient(addIngredientInput?: Nullable<AddIngredientInput>): Nullable<IngredientDTO> | Promise<Nullable<IngredientDTO>>;
    updateIngredient(updateIngredientInput?: Nullable<UpdateIngredientInput>): Nullable<GroupItemUpdateResponse> | Promise<Nullable<GroupItemUpdateResponse>>;
    removeIngredient(ingredientID: string): Nullable<GroupItemDeletionResponse> | Promise<Nullable<GroupItemDeletionResponse>>;
    addStep(addStepInput?: Nullable<AddStepInput>): Nullable<StepDTO> | Promise<Nullable<StepDTO>>;
    updateStep(updateStepInput?: Nullable<UpdateStepInput>): Nullable<GroupItemUpdateResponse> | Promise<Nullable<GroupItemUpdateResponse>>;
    removeStep(stepID: string): Nullable<GroupItemDeletionResponse> | Promise<Nullable<GroupItemDeletionResponse>>;
    addNote(addNoteInput?: Nullable<AddNoteInput>): Nullable<NoteDTO> | Promise<Nullable<NoteDTO>>;
    updateNote(updateNoteInput?: Nullable<UpdateNoteInput>): Nullable<GroupItemUpdateResponse> | Promise<Nullable<GroupItemUpdateResponse>>;
    removeNote(noteID: string): Nullable<GroupItemDeletionResponse> | Promise<Nullable<GroupItemDeletionResponse>>;
    addGroup(addGroupInput?: Nullable<AddGroupInput>): Nullable<GroupDTO> | Promise<Nullable<GroupDTO>>;
    updateGroup(updateGroupInput?: Nullable<UpdateGroupInput>): Nullable<GroupDTO> | Promise<Nullable<GroupDTO>>;
    removeGroup(groupID: string): Nullable<DeletionResponse> | Promise<Nullable<DeletionResponse>>;
}

export type GroupItemDTO = IngredientDTO | StepDTO | NoteDTO;
type Nullable<T> = T | null;
