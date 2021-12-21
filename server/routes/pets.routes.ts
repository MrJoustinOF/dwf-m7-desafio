import { Router } from "express";
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
const router = Router();

router.post("/", savePet);

router.get("/", getAllPets);

router.get("/user/:id", getAllUserPets);

router.get("/near/:lat/:lng", getPetsNearMe);

router.get("/:id", getOnePet);

router.put("/found/:id", setPetFound);

router.put("/:id", updatePet);

router.delete("/:id", deletePet);

export default router;
