import api from "../../api";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { USE_GET_CHEFS_KEY } from "./useGetChefs.api";
import type {
  DeleteChefReq,
  DeleteChefRes,
} from "../../../../shared/api/chef/deleteChef.api";

const mutationFn = async (uuid: string) => {
  const data: DeleteChefReq = { uuid };
  const response = await api.delete<DeleteChefRes>("/chef", { data });
  return response.data;
};

export const useDeleteChef = (
  onError?: (error: unknown) => void,
  onSuccess?: (data: DeleteChefRes) => void
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
