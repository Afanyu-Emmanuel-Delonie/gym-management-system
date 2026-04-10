"use server";

// user select request
export async function createSubscriptionRequest(
  userId: string,
  type: "DAILY" | "WEEKLY" | "MONTHLY",
) {
  return await prisma.subscription.create({
    data: {
      profileId: userId,
      type: type,
      status: "PENDING",
    },
  });
}

// sales agent confirming payment and activating the plan
export async function confirmSubscriptionPayment(subscriptionId: string) {
  const sub = await prisma.subscription.fundUnique({
    where: { id: subscriptionId },
  });

  if (!sub) throw new Error("Subscription not found");

  const durationMap = {
    DAILY: 1,
    WEEKLY: 7,
    MONTHLY: 30,
    YEARLY: 365,
  };

 const startDate = new Date()
  const endDate = new Date()
  endDate.setDate(startDate.getDate() + durationMap[sub.type])
}
