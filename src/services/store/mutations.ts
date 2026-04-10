import { revalidatePath } from "next/cache"
import prisma from "../../lib/prisma"
import { createClient } from "../../lib/supabase/server"
import { DeliveryType, DiscountType, OrderStatus } from "../../generated/prisma/client.ts"

// --- SECURITY ---

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const profile = await prisma.profile.findUnique({ where: { id: user.id } })
  if (profile?.role !== "ADMIN") throw new Error("Forbidden: Admin only")

  return profile
}

// --- PRODUCTS ---

export async function createProduct(data: {
  name: string
  description?: string
  price: number
  stock: number
  category: string
  image?: string
}) {
  await requireAdmin()
  const product = await prisma.product.create({ data })
  revalidatePath("/admin/store")
  return product
}

export async function updateProduct(
  productId: string,
  data: Partial<{
    name: string
    description: string
    price: number
    stock: number
    category: string
    image: string
    isActive: boolean
  }>,
) {
  await requireAdmin()
  const product = await prisma.product.update({ where: { id: productId }, data })
  revalidatePath("/admin/store")
  return product
}

export async function deleteProduct(productId: string) {
  await requireAdmin()

  const hasOrders = await prisma.orderItem.findFirst({ where: { productId } })
  if (hasOrders) {
    // Soft delete — keep data integrity
    await prisma.product.update({ where: { id: productId }, data: { isActive: false } })
  } else {
    await prisma.product.delete({ where: { id: productId } })
  }

  revalidatePath("/admin/store")
}

export async function restockProduct(productId: string, quantity: number) {
  await requireAdmin()
  const product = await prisma.product.update({
    where: { id: productId },
    data: { stock: { increment: quantity } },
  })
  revalidatePath("/admin/store")
  return product
}

// --- DISCOUNTS ---

export async function createDiscount(data: {
  code: string
  type: DiscountType
  value: number
  minOrder?: number
  maxUses?: number
  expiresAt?: Date
}) {
  await requireAdmin()
  const discount = await prisma.discount.create({ data })
  revalidatePath("/admin/store/discounts")
  return discount
}

export async function toggleDiscount(discountId: string, isActive: boolean) {
  await requireAdmin()
  return await prisma.discount.update({ where: { id: discountId }, data: { isActive } })
}

export async function deleteDiscount(discountId: string) {
  await requireAdmin()
  await prisma.discount.delete({ where: { id: discountId } })
  revalidatePath("/admin/store/discounts")
}

// --- ORDERS ---

export async function createOrder(
  clientId: string,
  cartItems: { productId: string; quantity: number }[],
  deliveryType: DeliveryType,
  deliveryAddress?: string,
  discountCode?: string,
) {
  if (deliveryType === "DELIVERY" && !deliveryAddress) {
    throw new Error("Delivery address is required for delivery orders")
  }

  return await prisma.$transaction(async (tx) => {
    let total = 0
    const itemsWithPrice: { productId: string; quantity: number; price: number }[] = []

    for (const item of cartItems) {
      const product = await tx.product.findUnique({ where: { id: item.productId } })

      if (!product || !product.isActive) throw new Error(`Product ${product?.name ?? "Unknown"} is unavailable.`)
      if (product.stock < item.quantity) throw new Error(`Item ${product.name} is out of stock.`)

      const price = Number(product.price)
      total += price * item.quantity
      itemsWithPrice.push({ productId: item.productId, quantity: item.quantity, price })

      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      })
    }

    // Apply discount
    let discountAmount = 0
    let discountId: string | undefined

    if (discountCode) {
      const discount = await tx.discount.findUnique({ where: { code: discountCode } })

      if (!discount || !discount.isActive) throw new Error("Invalid or inactive discount code")
      if (discount.expiresAt && discount.expiresAt < new Date()) throw new Error("Discount code has expired")
      if (discount.maxUses && discount.usedCount >= discount.maxUses) throw new Error("Discount code has reached its usage limit")
      if (discount.minOrder && total < Number(discount.minOrder)) throw new Error(`Minimum order of ${discount.minOrder} required for this discount`)

      discountAmount = discount.type === "PERCENTAGE"
        ? (total * Number(discount.value)) / 100
        : Math.min(Number(discount.value), total)

      discountId = discount.id
      await tx.discount.update({ where: { id: discount.id }, data: { usedCount: { increment: 1 } } })
    }

    const finalAmount = Math.max(0, total - discountAmount)

    const order = await tx.order.create({
      data: {
        clientId,
        totalAmount: total,
        discountAmount,
        finalAmount,
        deliveryType,
        deliveryAddress,
        discountId,
        status: "PENDING",
        items: { create: itemsWithPrice },
      },
      include: { items: true },
    })

    // Create delivery record if needed
    if (deliveryType === "DELIVERY") {
      await tx.delivery.create({
        data: { orderId: order.id, address: deliveryAddress! },
      })
    }

    return order
  })
}

// --- ORDER STATUS (Admin) ---

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  await requireAdmin()
  const order = await prisma.order.update({ where: { id: orderId }, data: { status } })
  revalidatePath("/admin/store/orders")
  return order
}

export async function updateDeliveryTracking(
  orderId: string,
  data: { trackingNote?: string; estimatedAt?: Date; deliveredAt?: Date },
) {
  await requireAdmin()
  const delivery = await prisma.delivery.update({
    where: { orderId },
    data,
  })

  if (data.deliveredAt) {
    await prisma.order.update({ where: { id: orderId }, data: { status: "DELIVERED" } })
  }

  revalidatePath("/admin/store/orders")
  return delivery
}

export async function cancelOrder(orderId: string) {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    })

    if (!order) throw new Error("Order not found")
    if (["COMPLETED", "DELIVERED", "SHIPPED"].includes(order.status)) {
      throw new Error(`Cannot cancel an order that is ${order.status}`)
    }

    for (const item of order.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      })
    }

    if (order.discountId) {
      await tx.discount.update({
        where: { id: order.discountId },
        data: { usedCount: { decrement: 1 } },
      })
    }

    return await tx.order.update({ where: { id: orderId }, data: { status: "CANCELLED" } })
  })
}
