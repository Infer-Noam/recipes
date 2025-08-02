import { Router, Request, Response, NextFunction } from "express";
import service from "./ingredient.service";
import {
  CreateIngredientReq,
  CreateIngredientRes,
} from "@shared/http-types/ingredient/createIngredient.http-type";
import { GetAllIngredientsRes } from "@shared/http-types/ingredient/getAllIngredients.http-type";

const router = Router();

router.post(
  "/",
  async (
    req: Request<null, null, CreateIngredientReq>,
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
