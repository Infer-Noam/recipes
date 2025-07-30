import { emailRegex, phoneRegex } from "../consts/regex.const";
import { z } from "zod";

export const ChefDetailsSchema = z.object({
  uuid: z.string(),
  firstName: z.string().min(1).max(20),
  lastName: z.string().min(1).max(20),
  phone: z.string().regex(phoneRegex).length(10),
  email: z.string().regex(emailRegex),
});
