import { Router } from "express";
import { sendRemider } from "../controllers/workflow.controller.js";

const workflowRouter = Router();

workflowRouter.get("/", sendRemider);

export default workflowRouter;
