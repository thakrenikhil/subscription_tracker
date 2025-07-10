import { Router } from "express";

const subscriptionRouter = Router();

subscriptionRouter.get("/", (req, res) => {
  res.json({
    title: "GET all subs",
  });
});

subscriptionRouter.get("/:id", (req, res) => {
  res.json({
    title: "GET subs detail",
  });
});
subscriptionRouter.post("/", (req, res) => {
  res.json({
    title: "CREATE subs",
  });
});
subscriptionRouter.post("/:id", (req, res) => {
  res.json({
    title: "UPDATE subs",
  });
});
subscriptionRouter.delete("/:id", (req, res) => {
  res.json({
    title: "DELETE subs",
  });
});
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
