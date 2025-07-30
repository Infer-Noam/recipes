import { Ingredient } from "../../types/ingredient.type";

export type CreateIngredientReq = {
  name: string;
};

export type CreateIngredientRes = {
  ingredient: Ingredient;
};
