export async function getCleanedAdminStats() {
  const now = new Date();

  await prisma.subscription.updatedMany({
    where: {
      status: "ACTIVE",
      endDate: { lt: now },
    },
    data: { status: "EXPIRED" },
  });

//   return the accurate subscriptions count 
  const activeCount = await prisma.subscription.count({ where: { status: 'ACTIVE' } })
  const pendingCount = await prisma.subscription.count({ where: { status: 'PENDING' } })
}
