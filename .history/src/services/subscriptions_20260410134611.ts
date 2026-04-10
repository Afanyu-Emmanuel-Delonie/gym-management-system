"use server"

// user select request 
export async function createSubscriptionRequest(userId: string, type: 'DAILY' | 'WEEKLY' | 'MONTHLY' ){
    return await prisma.subscription.create
}