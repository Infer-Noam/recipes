import { Recipe } from "../../types/recipe.type";
import { UuidReq } from "../generic/uuidReq.api";

export type GetRecipeByIdRes = {
  recipe: Recipe;
};
