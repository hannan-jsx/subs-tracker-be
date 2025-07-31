import { SERVER_URL } from "../config/env.js";
import { workflowClient } from "../config/upstash.js";
import Subscription from "../models/subscription.model.js";

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user.id,
    });

    const { workflowRunId } = await workflowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
      body: {
        subscriptionId: subscription.id,
      },
      headers: {
        "Content-Type": "application/json",
      },
      retries: 0,
    });
    res.status(201).json({
      success: true,
      data: { subscription, workflowRunId },
    });
  } catch (error) {
    next(error);
  }
};
export const getUserSubscriptions = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      /** @type {Error & { statusCode?: number }} */
      const error = new Error("You are not the owner of this subscription");
      error.statusCode = 401;
      throw error;
    }
    const subscription = await Subscription.find({ user: req.params.id });
    res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};
