import type { ChefDetails } from "@shared/types/chef.type";
import { v4 as uuidv4 } from "uuid";

const defaultChefDetails: ChefDetails = {
  uuid: uuidv4(),
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
};

export default defaultChefDetails;
