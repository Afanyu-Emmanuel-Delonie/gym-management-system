"use server"

// user select request 
export async function createSubscriptionRequest(userId: string, type: 'DAILY' | 'WEEKLY' | 'MONTHLY' ){
    return await prisma.subscription.create({
        data:{
            profileId: userId,
            type: type,
            status: 'PENDING'
        }
    })
}

// sales agent confirming payment and activating the plan 
export async function confirm