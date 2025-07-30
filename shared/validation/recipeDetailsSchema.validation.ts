import { z } from "zod";
import { MeasurementUnit } from "../enums/measurement-unit.enum";
import { imageUrlRegex } from "../consts/regex.const";

export const RecipeDetailsSchema = z.object({
  uuid: z.string().optional(),
  name: z.string().min(1).max(20),
  steps: z.array(z.string().min(1)).min(1).max(20),
  chef: z.object({ uuid: z.string() }),
  ingredients: z
    .array(
      z.object({
        uuid: z.string().optional(),
        recipe: z.object({ uuid: z.string() }),
        ingredient: z.object({ uuid: z.string() }),
        amount: z.number().min(1),
        measurementUnit: z.enum(MeasurementUnit),
      })
    )
    .min(1)
    .max(50),
  description: z.string(),
  imageUrl: z.string().regex(imageUrlRegex),
});
