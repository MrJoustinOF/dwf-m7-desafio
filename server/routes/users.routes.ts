import { Router } from "express";
import * as cors from "cors";
import {
  getAllUsers,
  createUser,
  verifyEmail,
  logInUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import { authMiddleware } from "./../middlewares/auth.middleware";
import { corsOptions } from "./../middlewares/cors.middleware";
const router = Router();

router.use(cors(corsOptions));

router.post("/", createUser);

router.get("/all", getAllUsers);

router.get("/:email", verifyEmail);

router.post("/token", logInUser);

router.put("/:id", authMiddleware, updateUser);

router.delete("/:id", deleteUser);

export default router;
