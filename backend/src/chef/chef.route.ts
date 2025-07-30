import { Router, Request, Response, NextFunction } from "express";
import service from "./chef.service";
import { SaveChefReq, SaveChefRes } from "@shared/api/chef/saveChef.api";
import { GetAllChefsRes } from "@shared/api/chef/getAllChefs.api";
import { DeleteChefReq, DeleteChefRes } from "@shared/api/chef/deleteChef.api";
import { HttpError } from "@shared/types/httpError.type";
import { ChefDetailsSchema } from "@shared/validation/chefDetailsSchema.validation";
import { validateZodSchema } from "../middleware/validation.middleware";
import { UuidSchema } from "@shared/validation/uuidSchema.validation";

const router = Router();

router.post(
  "/",
  validateZodSchema(ChefDetailsSchema, "chefDetails"),
  async (
    req: Request<unknown, SaveChefRes, SaveChefReq>,
    res: Response<SaveChefRes>,
    next: NextFunction
  ) => {
    try {
      const chef = await service.saveChef(req.body.chefDetails);
      if (!chef) {
        new HttpError("Something went wrong", 500);
      }
      res.status(200).json({ message: "Chef saved successfully" });
      next();
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/",
  async (_: Request, res: Response<GetAllChefsRes>, next: NextFunction) => {
    try {
      const chefs = await service.getAllChefs();
      res.status(200).json({ chefs });
      next();
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/",
  validateZodSchema(UuidSchema),
  async (
    req: Request<unknown, DeleteChefRes, DeleteChefReq>,
    res: Response<DeleteChefRes>,
    next: NextFunction
  ) => {
    try {
      const { uuid } = req.body;

      const exist = await service.deleteChef(uuid);

      if (!exist) throw new HttpError("Chef dosen't exist", 404);

      res.status(200).json({
        message: "Chef deleted successfully",
      });
      next();
    } catch (err) {
      next(err);
    }
  }
);
export default router;
