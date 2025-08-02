import api from "../../api";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import type {
  DeleteRecipeReq,
  DeleteRecipeRes,
} from "../../../../shared/http-types/recipe/deleteRecipe.http-type";
import { USE_GET_RECIPES_KEY } from "./useGetRecipes.api";

const mutationFn = async (uuid: string) => {
  const data: DeleteRecipeReq = { uuid };
  const response = await api.delete("/recipe", { data });
  return response.data;
};

export const useDeleteRecipe = (
  onError?: (error: unknown) => void,
  onSuccess?: (data: DeleteRecipeRes) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [USE_GET_RECIPES_KEY] });
      onSuccess?.(response);
    },
    onError,
  });
};
