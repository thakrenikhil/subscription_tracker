import Subscription from "../models/subscription.model.js";
import { workflowClient } from "../config/upstash.js";
import { SERVER_URL, QSTASH_URL } from "../config/env.js";
export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });
    console.log(subscription._id.toString());
    const { workflowRunId } = await workflowClient.trigger({
      url: `http://localhost:5000/api/v1/workflows/subscription/reminder`,
      body: {
        subscriptionId: subscription._id.toString(),
      },
      headers: {
        "content-type": "application/json",
      },
      retries: 0,
    });
    console.log("User ID in request:", req.user._id);
    console.log("Subscription ID in request:", subscription._id.toString());

    res.status(201).json({
      success: true,
      data: { subscription, workflowRunId },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find(); // Restrict this in production
    res.status(200).json({
      success: true,
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
};

export const getSubscriptionById = async (req, res, next) => {
  try {
    if (req.user._id.toString() !== req.params.id) {
      return res.status(401).json({
        success: false,
        message: "You are not the owner of this account",
      });
    }

    const subscriptions = await Subscription.find({ user: req.params.id });

    res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
};

export const deleteSubscription = async (req, res, next) => {
  try {
    const { userId, subscriptionId } = req.params;

    const subscription = await Subscription.findOneAndDelete({
      _id: subscriptionId,
      user: userId,
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found or not owned by user",
      });
    }

    res.status(200).json({
      success: true,
      message: "Subscription deleted",
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};
