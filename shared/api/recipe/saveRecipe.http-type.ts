import type { RecipeDetails } from "../../types/recipe.type";

export type SaveRecipeReq = {
  recipeDetails: RecipeDetails;
};

export type SaveRecipeRes = {
  message: string;
};
