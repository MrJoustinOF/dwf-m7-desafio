import { Router } from "express";
import * as cors from "cors";
import {
  savePet,
  getAllPets,
  getAllUserPets,
  getPetsNearMe,
  getOnePet,
  setPetFound,
  updatePet,
  deletePet,
} from "../controllers/petController";
import { authMiddleware } from "./../middlewares/auth.middleware";
import { corsOptions } from "./../middlewares/cors.middleware";
const router = Router();

router.use(cors(corsOptions));

router.post("/", authMiddleware, savePet);

router.get("/", getAllPets);

router.get("/user/:id", authMiddleware, getAllUserPets);

router.get("/near/:lat/:lng", getPetsNearMe);

router.get("/:id", getOnePet);

router.put("/found/:id", authMiddleware, setPetFound);

router.put("/:id", authMiddleware, updatePet);

router.delete("/:id", authMiddleware, deletePet);

export default router;
