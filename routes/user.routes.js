import { Router } from "express";
import { getUsers, getUserById } from "../controllers/user.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";
const userRouter = Router();

userRouter.get("/", getUsers);

userRouter.get("/:id", authorize, getUserById);

userRouter.post("/", (req, res) => {
  res.json({
    title: "CREATE  user",
  });
});

userRouter.put("/:id", (req, res) => {
  res.json({
    title: "Update  user",
  });
});

userRouter.delete("/:id", (req, res) => {
  res.json({
    title: "DELETE user",
  });
});

export default userRouter;
