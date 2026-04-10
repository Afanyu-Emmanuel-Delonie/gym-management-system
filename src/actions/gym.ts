"use server"

import { bookSchedule as _book } from "../services/gym"

export async function bookSchedule(scheduleId: string) { return _book(scheduleId) }
