import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");
import Subscription from "../models/subscription.model.js";
import dayjs from "dayjs";
import { sendReminderEmail } from "../utils/send-email.js";

const REMINDERS = [7, 5, 2, 1];

export const sendSubscriptionReminder = serve(async (context) => {
  console.log("Subscription reminder workflow started");
  console.log("Workflow context enabled:", context.enabled ? "PRODUCTION" : "DEVELOPMENT");

  if (!context.requestPayload?.subscriptionId) {
    console.error("No subscription ID provided in request payload");
    return;
  }

  const { subscriptionId } = context.requestPayload;
  console.log("Received subscription ID:", subscriptionId);

  let subscription;
  try {
    subscription = await fetchSubscription(context, subscriptionId);
    if (!subscription) {
      console.error(`Subscription not found for ID: ${subscriptionId}`);
      return;
    }

    if (subscription.status !== 'active') {
      console.log(`Subscription ${subscriptionId} is not active (status: ${subscription.status}). Skipping reminders.`);
      return;
    }

    console.log(`Processing subscription: ${subscription.name} with renewal date: ${subscription.renewdate}`);
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return;
  }

  const renewalDate = dayjs(subscription.renewdate);

  if (renewalDate.isBefore(dayjs())) {
    console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`);
    return;
  }
  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.clone().subtract(daysBefore, 'day');

    if (context.enabled) {
        if (reminderDate.isAfter(dayjs())) {
            await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate);
            await triggerReminder(context, `${daysBefore} days before reminder`, subscription);
        } else if (dayjs().isSame(reminderDate, 'day')) {
            await triggerReminder(context, `${daysBefore} days before reminder`, subscription);
        }
    } else {
        console.log(`(Dev mode) Would schedule ${daysBefore} days before reminder on ${reminderDate.format()}`);
        // Only trigger 1st reminder in dev mode for test
        await triggerReminder(context, `${daysBefore} days before reminder`, subscription);
        break; // stop loop after first for dev testing
    }
}


});

const fetchSubscription = async (context, subscriptionId) => {
  if (context.enabled) {
    return await context.run('get subscription', async () => {
      return Subscription.findById(subscriptionId).populate('user', 'name email');
    });
  } else {
    console.log("Workflows disabled, fetching subscription directly (dev mode)");
    return Subscription.findById(subscriptionId).populate('user', 'name email');
  }
};

const sleepUntilReminder = async (context, label, date) => {
  if (context.enabled) {
    console.log(`Sleeping until ${label} reminder at ${date}`);
    await context.sleepUntil(label, date.toDate());
  } else {
    console.log(`(Dev mode) Skipping sleepUntil for ${label} scheduled at ${date}`);
  }
};

const triggerReminder = async (context, label, subscription) => {
  if (context.enabled) {
    return await context.run(label, async () => {
      await sendReminder(subscription, label);
    });
  } else {
    console.log(`(Dev mode) Directly triggering reminder: ${label}`);
    await sendReminder(subscription, label);
  }
};

const sendReminder = async (subscription, label) => {
  try {
    await sendReminderEmail({
      to: subscription.user.email,
      type: label,
      subscription,
    });
    console.log(`Successfully sent ${label} reminder to ${subscription.user.email}`);
  } catch (error) {
    console.error(`Failed to send ${label} reminder:`, error);
    throw error;
  }
};
