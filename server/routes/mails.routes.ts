import { Router } from "express";
import * as cors from "cors";
import { sendPetReport } from "../controllers/mailController";
import { corsOptions } from "./../middlewares/cors.middleware";
const router = Router();

router.use(cors(corsOptions));

router.post("/", sendPetReport);

export default router;
