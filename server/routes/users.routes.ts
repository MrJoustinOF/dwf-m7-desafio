import { Router } from "express";
import {
  getAllUsers,
  createUser,
  verifyEmail,
  logInUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";
const router = Router();

router.post("/", createUser);

router.get("/all", getAllUsers);

router.get("/:email", verifyEmail);

router.post("/token", logInUser);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

export default router;
