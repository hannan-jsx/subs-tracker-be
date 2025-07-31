import { serve } from "@upstash/workflow";
import Subscription from "../models/subscription.model.js";
import dayjs from "dayjs";

const REMINDERS = [7, 5, 2, 1];
export const sendRemider = serve(async (context) => {
  const requestPayload = context?.requestPayload || {};
  const { subscriptionId } = requestPayload;
  const subscription = await fetchSubscription(context, subscriptionId);

  if (!subscription || subscription.status !== "active") return;

  const renewalDate = dayjs(subscription?.renewalDate);

  if (renewalDate.isBefore(dayjs())) {
    console.log("Renewal date is passed" + subscriptionId, "Workflow stopped");
  }

  for (const daysBefore of REMINDERS) {
    const reminderDates = renewalDate.subtract(daysBefore, "day");
    // if (dayjs().isSame(reminderDates, "day")) {
    //   console.log(
    //     `sending reminder email to ${subscription.user.email} for subscription ${subscriptionId}`
    //   );
    // }
    if (reminderDates.isAfter(dayjs())) {
      await sleepUntilReminder(
        context,
        `Reminder ${daysBefore} days before`,
        reminderDates
      );
    }
    await triggerReminder(context, `Reminder ${daysBefore} days before`);
  }
});
const fetchSubscription = async (context, subscriptionId) => {
  return await context.run("get subscription", () => {
    return Subscription.findById(subscriptionId).populate("user", "name email");
  });
};

const sleepUntilReminder = async (context, label, date) => {
  console.log(`sleeping until ${label} reminder at ${date}`);
  await context.sleepUntil(date?.toDate());
};
const triggerReminder = async (context, label) => {
  return await context.run(label, () => {
    console.log(`triggering ${label} reminder`);
  });
};
