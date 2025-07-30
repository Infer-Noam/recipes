import { type GetAllRecipesRes } from "../../../../shared/api/recipe/getAllRecipes.http-type";
import { useQuery } from "@tanstack/react-query";
import api from "../../api";

export const USE_GET_RECIPES_KEY = "useGetRecipesKey";

export const useGetRecipes = () => {
  return useQuery({
    queryKey: [USE_GET_RECIPES_KEY],
    queryFn: () =>
      api
        .get<GetAllRecipesRes>("/recipe")
        .then((response) => response.data.recipes),
  });
};
