import type { Recipe, RecipeDetails } from "../../types/recipe.type";

export type SaveRecipeReq = {
  recipeDetails: RecipeDetails;
};

export type SaveRecipeRes = {
  recipe: Recipe;
};
