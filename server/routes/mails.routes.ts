import { Router } from "express";
import { sendPetReport } from "../controllers/mailController";
const router = Router();

router.post("/", sendPetReport);

export default router;
