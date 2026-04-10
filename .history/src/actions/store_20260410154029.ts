"use server"

export async function createOrder(userId: string, cartItems: { productId: string, quantity: number }[], deliveryType: 'PICKUP' | 'DELIVERY') {
    return await prisma.$transaction(async (tx))
}