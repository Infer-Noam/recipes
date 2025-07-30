import { Router, Request, Response, NextFunction } from "express";
import service from "./ingredient.service";
import {
  CreateIngredientReq,
  CreateIngredientRes,
} from "@shared/api/ingredient/createIngredient.api";
import { GetAllIngredientsRes } from "@shared/api/ingredient/getAllIngredients.api";
import { validateZodSchema } from "../middleware/validation.middleware";
import { IngredientNameSchema } from "@shared/validation/ingredientNameSchema.validation";

const router = Router();

router.post(
  "/",
  validateZodSchema(IngredientNameSchema),
  async (
    req: Request<unknown, CreateIngredientRes, CreateIngredientReq>,
    res: Response<CreateIngredientRes>,
    next: NextFunction
  ) => {
    try {
      const name = req.body.name;
      const ingredient = await service.createIngredient(name);

      res.status(201).json({ ingredient });
      next();
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/",
  async (
    _: Request,
    res: Response<GetAllIngredientsRes>,
    next: NextFunction
  ) => {
    try {
      const ingredients = await service.getAllIngredients();
      res.status(200).json({ ingredients });
      next();
    } catch (err) {
      next(err);
    }
  }
);

export default router;
