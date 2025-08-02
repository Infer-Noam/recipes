import api from "../../api";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import type {
  SaveRecipeReq,
  SaveRecipeRes,
} from "../../../../shared/http-types/recipe/saveRecipe.http-type";
import type { RecipeDetails } from "../../../../shared/types/recipe.type";
import { USE_GET_RECIPES_KEY } from "./useGetRecipes.api";
import { USE_GET_RECIPE_BY_UUID_KEY } from "./useGetRecipeByUuid.api";

const mutationFn = async (recipeDetails: RecipeDetails) => {
  const data: SaveRecipeReq = { recipeDetails };
  const response = await api.post<SaveRecipeRes>("/recipe", data);
  return response.data;
};

export const useSaveRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USE_GET_RECIPES_KEY] });
      queryClient.invalidateQueries({ queryKey: [USE_GET_RECIPE_BY_UUID_KEY] });
    },
  });
};
