import { Router } from "express";
import {sendSubscriptionReminder}  from "../controllers/workflow.controller.js"
const  workflowRouter = Router();


console.log("Workflow Router Loaded");
workflowRouter.post("/subscription/reminder", sendSubscriptionReminder);

export default workflowRouter;  
