import type { GetRecipeByIdRes } from "../../../../shared/api/recipe/getRecipeByUuid.http-type";
import { useQuery } from "@tanstack/react-query";
import api from "../../api";

export const USE_GET_RECIPE_BY_UUID_KEY = "useGetRecipeByUuidKey";

export const useGetRecipeByUuid = (uuid?: string) => {
  return useQuery({
    enabled: Boolean(uuid),
    queryKey: [USE_GET_RECIPE_BY_UUID_KEY, uuid],
    queryFn: () =>
      api
        .get<GetRecipeByIdRes>(`/recipe/${uuid}`)
        .then((response) => response.data.recipe),
  });
};
