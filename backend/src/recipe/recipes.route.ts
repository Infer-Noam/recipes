import { Router, Request, Response } from "express";
import service from "./recipe.service";
import {
  SaveRecipeReq,
  SaveRecipeRes,
} from "@shared/http-types/recipe/saveRecipe.http-type";
import { DeleteRecipeReq } from "@shared/http-types/recipe/deleteRecipe.http-type";
import { GetRecipeByIdRes } from "@shared/http-types/recipe/getRecipeByUuid.http-type";
import { GetAllRecipesRes } from "@shared/http-types/recipe/getAllRecipes.http-type";

const router = Router();

router.post(
  "/",
  async (
    req: Request<null, null, SaveRecipeReq>,
    res: Response<SaveRecipeRes>
  ) => {
    try {
      const recipe = await service.saveRecipe(req.body.recipeDetails);
      if (recipe) {
        res.status(200).json({ recipe });
      } else {
        res.sendStatus(500);
      }
    } catch (err) {
      res.sendStatus(400);
    }
  }
);

router.delete(
  "/",
  async (req: Request<null, null, DeleteRecipeReq>, res: Response) => {
    const { uuid } = req.body;

    const exist = await service.deleteRecipe(uuid);

    res.sendStatus(exist ? 204 : 404);
  }
);

router.get("/", async (_: Request, res: Response<GetAllRecipesRes>) => {
  const recipes = await service.getAllRecipes();

  if (!recipes.length) {
    return res.sendStatus(404);
  }

  return res.status(200).json({ recipes });
});

router.get("/:uuid", async (req: Request, res: Response<GetRecipeByIdRes>) => {
  const uuid = req.params.uuid;

  const recipe = await service.getRecipeByUuid(uuid);

  if (!recipe) return res.sendStatus(404);

  return res.status(200).json({ recipe });
});

export default router;
