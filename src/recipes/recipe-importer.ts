import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import slugify from 'slugify';
import {
  AddGroupInput,
  AddIngredientInput,
  AddStepInput,
  CreateRecipeInput,
} from '../graphql';
import { GroupItemTypes } from '../groups/group.schema';

type HowToStepGraph = {
  text: string;
  name: string;
  url: string;
};

type HowToSectionGraph = {
  name: string;
  itemListElement: HowToStepGraph[];
};

type RecipeGraph = {
  name: string;
  author: { name: string };
  description: string;
  datePublished: string;
  image: string[];
  recipeYield: string[];
  prepTime?: string;
  cookTime?: string;
  recipeIngredient: string[];
  recipeInstructions: HowToSectionGraph[];
  recipeCategory: string[];
  recipeCuisine: string[];
  keywords: string;
};

export class RecipeImporter {
  private readonly url: string;
  private body: string;
  private recipeGraph: RecipeGraph;
  recipe: CreateRecipeInput;
  ingredients: AddIngredientInput[] = [];
  stepGroups: (AddGroupInput & { items: AddStepInput[] })[] = [];
  steps: AddStepInput[] = [];

  constructor(url: string) {
    this.url = url;
  }

  async fetchRecipe() {
    return fetch(this.url)
      .then((res) => res.text())
      .then((body) => {
        this.body = body.toString();
      });
  }

  extractJsonld() {
    if (!this.body) new Error('No body to extract jsonld from!');
    const $ = cheerio.load(this.body);
    const ldTag = $('script[type="application/ld+json"]');
    const ld = JSON.parse(ldTag.html())['@graph'];
    this.recipeGraph = ld.filter((i) => i['@type'] === 'Recipe')[0];
  }

  parseJsonld() {
    this.recipe = {
      name: this.recipeGraph.name,
      servings: parseInt(this.recipeGraph.recipeYield[0]),
      description: this.recipeGraph.description,
      slug: slugify(this.recipeGraph.name),
      // TODO: Formats here can vary
      // prepTimeMin:
      //   parseInt(this.recipeGraph.prepTime?.replace(/[^0-9]/g, '')) ?? 0,
      // cookTimeMin:
      //   parseInt(this.recipeGraph.cookTime?.replace(/[^0-9]/g, '')) ?? 0,
      tags: [
        ...this.recipeGraph.keywords.split(' '),
        ...this.recipeGraph.recipeCuisine,
        ...this.recipeGraph.recipeCategory,
      ],
      sourceLinks: [this.url],
    };

    for (const ingredient of this.recipeGraph.recipeIngredient) {
      this.ingredients.push({
        recipeID: 'temp-id',
        groupID: 'temp-id',
        name: ingredient,
        amount: 1,
        unit: 'WIP',
      });
    }

    for (const stepGroup of this.recipeGraph.recipeInstructions) {
      if (stepGroup['@type'] === 'HowToStep') {
        this.steps.push({
          name: stepGroup.name,
          recipeID: 'temp-id',
          groupID: 'temp-id',
        });
      } else {
        const stepGroupInput: AddGroupInput & { items: AddStepInput[] } = {
          recipeID: 'temp-id',
          name: stepGroup.name,
          itemType: GroupItemTypes.StepBE,
          items: [],
        };
        console.log('stepg', stepGroup);
        for (const step of stepGroup.itemListElement) {
          stepGroupInput.items.push({
            name: step.name,
            recipeID: 'temp-id',
            groupID: 'temp-id',
          });
        }
        this.stepGroups.push(stepGroupInput);
      }
    }
  }
}
