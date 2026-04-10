"use server"

import {
  getStaffMembers as _getStaffMembers,
  getStaffAttendance as _getStaffAttendance,
  getAllRosters as _getAllRosters,
  getRosterById as _getRosterById,
} from "../services/staff/queries"

import {
  createStaffMember as _createStaffMember,
  deleteStaffMember as _deleteStaffMember,
  createRoster as _createRoster,
  addRosterShift as _addRosterShift,
  updateRosterShift as _updateRosterShift,
  deleteRosterShift as _deleteRosterShift,
  publishRoster as _publishRoster,
  checkIn as _checkIn,
  checkOut as _checkOut,
  markAttendance as _markAttendance,
} from "../services/staff/mutations"

import type { ShiftType, AttendanceStatus } from "../generated/prisma/client.ts"

export async function getStaffMembers() { return _getStaffMembers() }
export async function getStaffAttendance(date?: Date) { return _getStaffAttendance(date) }
export async function getAllRosters() { return _getAllRosters() }
export async function getRosterById(id: string) { return _getRosterById(id) }

export async function createStaffMember(data: Parameters<typeof _createStaffMember>[0]) { return _createStaffMember(data) }
export async function deleteStaffMember(id: string) { return _deleteStaffMember(id) }
export async function createRoster(weekStart: Date) { return _createRoster(weekStart) }
export async function addRosterShift(data: Parameters<typeof _addRosterShift>[0]) { return _addRosterShift(data) }
export async function updateRosterShift(id: string, data: Parameters<typeof _updateRosterShift>[1]) { return _updateRosterShift(id, data) }
export async function deleteRosterShift(id: string) { return _deleteRosterShift(id) }
export async function publishRoster(id: string) { return _publishRoster(id) }
export async function checkIn(staffId: string) { return _checkIn(staffId) }
export async function checkOut(staffId: string) { return _checkOut(staffId) }
export async function markAttendance(data: { staffId: string; date: Date; status: AttendanceStatus; note?: string }) { return _markAttendance(data) }
