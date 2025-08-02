import { Router, Request, Response } from "express";
import service from "./chef.service";
import {
  SaveChefReq,
  SaveChefRes,
} from "@shared/http-types/chef/saveChef.http-type";
import { GetAllChefsRes } from "@shared/http-types/chef/getAllChefs.http-type";
import { DeleteChefReq } from "@shared/http-types/chef/deleteChef.http-type";

const router = Router();

router.post(
  "/",
  async (req: Request<null, null, SaveChefReq>, res: Response<SaveChefRes>) => {
    try {
      const chef = await service.saveChef(req.body.chefDetails);
      if (chef) {
        res.status(200).json({ message: "Chef saved successfully" });
      } else {
        res.status(500).json({ message: "Something went wrong" });
      }
    } catch (err) {
      if (err instanceof Error) {
        res.status(400).json({ message: err.message });
      } else {
        res.status(400).json({ message: "Something went wrong" });
      }
    }
  }
);

router.get("/", async (_: Request, res: Response<GetAllChefsRes>) => {
  const chefs = await service.getAllChefs();
  return res.status(200).json({ chefs });
});

router.delete(
  "/",
  async (req: Request<null, null, DeleteChefReq>, res: Response) => {
    const { uuid } = req.body;

    const exist = await service.deleteChef(uuid);

    res.sendStatus(exist ? 204 : 404);
  }
);
export default router;
