import { Router } from "express";
import { sendRemider } from "../controllers/workflow.controller.js";

const workflowRouter = Router();

// Use the workflow handler as middleware
workflowRouter.post("/subscription/reminder", (req, res, next) => {
  // The workflow handler expects a specific context format
  // We need to adapt the Express request to the workflow format
  const context = {
    requestPayload: req.body,
    // Add other context properties as needed
  };

  // Call the workflow handler
  sendRemider
    .handler(context)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      next(error);
    });
});

export default workflowRouter;
