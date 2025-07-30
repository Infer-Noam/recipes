import api from "../../api";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import type {
  SaveChefReq,
  SaveChefRes,
} from "../../../../shared/api/chef/saveChef.api";
import { USE_GET_CHEFS_KEY } from "./useGetChefs.api";
import type { ChefDetails } from "@shared/types/chef.type";

const mutationFn = async (chefDetails: ChefDetails) => {
  const data: SaveChefReq = { chefDetails };
  const response = await api.post<SaveChefRes>("/chef", data);
  return response.data;
};
export const useSaveChef = (
  onError?: (error: unknown) => void,
  onSuccess?: (data: SaveChefRes) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (response) => {
      onSuccess?.(response);
      queryClient.invalidateQueries({ queryKey: [USE_GET_CHEFS_KEY] });
    },
    onError,
  });
};
