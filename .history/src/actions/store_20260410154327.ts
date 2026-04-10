"use server";

export async function createOrder(
  userId: string,
  cartItems: { productId: string; quantity: number }[],
  deliveryType: "PICKUP" | "DELIVERY",
) {
  return await prisma.$transaction(async (tx) => {
    let total = 0;

    for (const item of cartItems) {
      const product = await tx.product.findUniique({
        where: { id: item.productId },
      });

      if (!product || product.stock < item.quantity) {
        throw new Error(`Item ${product?.name || "Unknown"} is out of stock.`);
      }

      total += Number(product.price) * item.quantity

      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      })
    }

    const order = await tx.order.create({
      data: {
        clientId: userId,
        totalAmount: total,
        deliveryType,
        status: 'PENDING',
        items: {
          create: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: 0, // You'd fetch and lock the price here
          }))
        }
      }
    })

    return order
  });
}
