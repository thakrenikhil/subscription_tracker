import { Router } from "express";
import { authorize } from "../middlewares/auth.middleware.js";
import {
  createSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  deleteSubscription,
} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get("/", getAllSubscriptions);

subscriptionRouter.get("/:id", authorize, getSubscriptionById);
subscriptionRouter.post("/", authorize, createSubscription);
subscriptionRouter.post("/:id", (req, res) => {
  res.json({
    title: "UPDATE subs",
  });
});
subscriptionRouter.delete("/:userId/:subscriptionId", authorize, deleteSubscription);
subscriptionRouter.get("/user/:id", (req, res) => {
  res.json({
    title: "GET all user subs",
  });
});
subscriptionRouter.put("/:id/cancel", (req, res) => {
  res.json({
    title: "CANCEL subs",
  });
});

subscriptionRouter.get("/upcoming-renewals", (req, res) => {
  res.json({
    title: "GET upcoming renewals subs",
  });
});

export default subscriptionRouter;
