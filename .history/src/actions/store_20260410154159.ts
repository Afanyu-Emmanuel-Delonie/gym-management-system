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

      
    }
  });
}
