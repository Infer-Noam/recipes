import api from "../../api";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import type {
  SaveChefReq,
  SaveChefRes,
} from "../../../../shared/http-types/chef/saveChef.http-type";
import { USE_GET_CHEFS_KEY } from "./useGetChefs.api";
import type { ChefDetails } from "@shared/types/chef.type";

const mutationFn = async (chefDetails: ChefDetails) => {
  const data: SaveChefReq = { chefDetails };
  const response = await api.post<SaveChefRes>("/chef", data);
  return response.data;
};

export const useSaveChef = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USE_GET_CHEFS_KEY] });
    },
  });
};
