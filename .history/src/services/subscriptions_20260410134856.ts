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
export async function confirmSubscriptionPayment(subscriptionId: string){
    const sub = await prisma.subscription.fundUnique({
        where
    })
}