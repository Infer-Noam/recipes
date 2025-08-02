import type { ChefDetails } from "../../types/chef.type";

export type SaveChefReq = {
  chefDetails: ChefDetails;
};

export type SaveChefRes = {
  message: string;
};
