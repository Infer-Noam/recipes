import { z } from "zod";

export const IngredientNameSchema = z.object({
  name: z.string().min(1).max(15),
});
