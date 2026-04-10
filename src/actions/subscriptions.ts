"use server"

import {
  createSubscriptionRequest as _create,
  confirmSubscriptionPayment as _confirm,
  cancelSubscription as _cancel,
  getAllSubscriptions as _getAll,
} from "../services/subscriptions"
import type { SubscriptionType } from "../generated/prisma/client.ts"
import { serialize } from "../lib/serialize"

export async function createSubscriptionRequest(userId: string, type: SubscriptionType) { return _create(userId, type) }
export async function confirmSubscriptionPayment(id: string) { return serialize(await _confirm(id)) }
export async function cancelSubscription(id: string) { return _cancel(id) }
export async function getAllSubscriptions(page?: number, pageSize?: number, status?: string, search?: string) { return serialize(await _getAll(page, pageSize, status, search)) }
