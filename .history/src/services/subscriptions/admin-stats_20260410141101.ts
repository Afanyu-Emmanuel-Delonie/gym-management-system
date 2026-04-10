export async function getCleanedAdminStats() {
    const now = new Date()

    await prisma.subscription.updatedMany({
        where: {
      status: 'ACTIVE',
      endDate: { lt: now }
    },
    data: { status: 'EXPIRED' }
    })
}