import { Router, Request, Response, NextFunction } from "express";
import service from "./recipe.service";
import {
  SaveRecipeReq,
  SaveRecipeRes,
} from "@shared/http-types/recipe/saveRecipe.http-type";
import { DeleteRecipeReq } from "@shared/http-types/recipe/deleteRecipe.http-type";
import { GetRecipeByIdRes } from "@shared/http-types/recipe/getRecipeByUuid.http-type";
import { GetAllRecipesRes } from "@shared/http-types/recipe/getAllRecipes.http-type";
import { HttpError } from "@shared/types/httpError.type";

const router = Router();

router.post(
  "/",
  async (
    req: Request<null, null, SaveRecipeReq>,
    res: Response<SaveRecipeRes>,
    next: NextFunction
  ) => {
    try {
      const recipe = await service.saveRecipe(req.body.recipeDetails);
      if (recipe) {
        res.status(200).json({ recipe });
      } else {
        res.sendStatus(500);
      }
      next()
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/",
  async (
    req: Request<null, null, DeleteRecipeReq>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { uuid } = req.body;

      const exist = await service.deleteRecipe(uuid);

      if (!exist) throw new HttpError("Recipe not found", 404);

      res.sendStatus(204);
      next();
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/",
  async (_: Request, res: Response<GetAllRecipesRes>, next: NextFunction) => {
    try {
      const recipes = await service.getAllRecipes();

      if (!recipes.length) {
        throw new HttpError("Recipes not found", 404);
      }

      res.status(200).json({ recipes });
      next();
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/:uuid",
  async (req: Request, res: Response<GetRecipeByIdRes>, next: NextFunction) => {
    try {
      const uuid = req.params.uuid;

      const recipe = await service.getRecipeByUuid(uuid);

      if (!recipe) throw new HttpError("Recipe not found", 404);

      res.status(200).json({ recipe });
      next();
    } catch (err) {
      next(err);
    }
  }
);

export default router;
