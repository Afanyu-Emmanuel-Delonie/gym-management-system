"use server"

import {
  getDashboardStats as _getStats,
  getExpiringSoonSubscriptions as _getExpiring,
  getSubscriptionDistribution as _getSubDist,
  getProductDistribution as _getProdDist,
  getRecentActivity as _getActivity,
  getMonthlyRevenue as _getRevenue,
  getMonthlyMembers as _getMembers,
  getMonthlySubscriptions as _getSubs,
  getMonthlyOrders as _getOrders,
} from "../services/dashboard"

export async function getDashboardStats() { return _getStats() }
export async function getExpiringSoonSubscriptions(days?: number) { return _getExpiring(days) }
export async function getSubscriptionDistribution() { return _getSubDist() }
export async function getProductDistribution() { return _getProdDist() }
export async function getRecentActivity(limit?: number) { return _getActivity(limit) }
export async function getMonthlyRevenue() { return _getRevenue() }
export async function getMonthlyMembers() { return _getMembers() }
export async function getMonthlySubscriptions() { return _getSubs() }
export async function getMonthlyOrders() { return _getOrders() }
