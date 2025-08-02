import type { GenericUuid } from "../../types/generic/genericUuid.type";

export type DeleteRecipeReq = GenericUuid;

export type DeleteRecipeRes = {
  message: string;
};
