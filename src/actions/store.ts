"use server"

import {
  getProducts as _getProducts,
  getDiscounts as _getDiscounts,
  getAllOrders as _getAllOrders,
  getStoreStats as _getStoreStats,
} from "../services/store/queries"

import {
  createOrder as _createOrder,
  cancelOrder as _cancelOrder,
  createProduct as _createProduct,
  updateProduct as _updateProduct,
  deleteProduct as _deleteProduct,
  restockProduct as _restockProduct,
  createDiscount as _createDiscount,
  toggleDiscount as _toggleDiscount,
  deleteDiscount as _deleteDiscount,
  updateOrderStatus as _updateOrderStatus,
  updateDeliveryTracking as _updateDeliveryTracking,
} from "../services/store"
import type { DeliveryType, DiscountType, OrderStatus } from "../generated/prisma/client.ts"
import { serialize } from "../lib/serialize"

export async function createOrder(...args: Parameters<typeof _createOrder>) { return _createOrder(...args) }
export async function cancelOrder(orderId: string) { return _cancelOrder(orderId) }
export async function createProduct(data: Parameters<typeof _createProduct>[0]) { return _createProduct(data) }
export async function updateProduct(id: string, data: Parameters<typeof _updateProduct>[1]) { return _updateProduct(id, data) }
export async function deleteProduct(id: string) { return _deleteProduct(id) }
export async function restockProduct(id: string, qty: number) { return _restockProduct(id, qty) }
export async function createDiscount(data: Parameters<typeof _createDiscount>[0]) { return _createDiscount(data) }
export async function toggleDiscount(id: string, isActive: boolean) { return _toggleDiscount(id, isActive) }
export async function deleteDiscount(id: string) { return _deleteDiscount(id) }
export async function updateOrderStatus(id: string, status: OrderStatus) { return _updateOrderStatus(id, status) }
export async function updateDeliveryTracking(id: string, data: Parameters<typeof _updateDeliveryTracking>[1]) { return _updateDeliveryTracking(id, data) }

export async function getProducts(filters?: { category?: string; isActive?: boolean }, page?: number, pageSize?: number) { return serialize(await _getProducts(filters, page, pageSize)) }
export async function getDiscounts() { return serialize(await _getDiscounts()) }
export async function getAllOrders(status?: Parameters<typeof _getAllOrders>[0], page?: number, pageSize?: number, search?: string) { return serialize(await _getAllOrders(status, page, pageSize, search)) }
export async function getStoreStats() { return serialize(await _getStoreStats()) }
