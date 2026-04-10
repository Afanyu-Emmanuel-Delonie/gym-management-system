"use server"

import { verifyGymAccess as _verify } from "../services/access"

export async function verifyGymAccess(code: string) { return _verify(code) }
