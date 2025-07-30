import { z } from "zod";

export const UuidSchema = z.object({
  uuid: z.string(),
});
