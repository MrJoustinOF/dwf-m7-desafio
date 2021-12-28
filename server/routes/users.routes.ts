import { Router } from "express";
import {
  getAllUsers,
  createUser,
  verifyEmail,
  logInUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import { authMiddleware } from "./../middlewares/auth.middleware";
const router = Router();

router.post("/", createUser);

router.get("/all", getAllUsers);

router.get("/:email", verifyEmail);

router.post("/token", logInUser);

router.put("/:id", authMiddleware, updateUser);

router.delete("/:id", deleteUser);

export default router;
