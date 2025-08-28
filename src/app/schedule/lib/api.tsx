import { ScheduleProps } from "@/app/schedule/types/Schedule";
import { Result, safeAsync } from "@/lib/result";

export function fetchScheduleCreate(
	newSchedule: ScheduleProps
): Promise<Result<void>> {
	return safeAsync(async () => {
		const res = await fetch("/api/schedule/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify(newSchedule),
		});

		if (!res.ok) {
			const data = await res.json();
			throw new Error(`${data.message}`);
		}
	}, "fetchScheduleCreate");
}

export function fetchScheduleDelete(id: number): Promise<Result<void>> {
	return safeAsync(async () => {
		const res = await fetch(`/api/schedule/${id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});

		if (!res.ok) {
			const data = await res.json();
			throw new Error(`${data.message}`);
		}
	}, "fetchScheduleDelete");
}

export async function fetchScheduleUpdate(
	schedule: ScheduleProps
): Promise<Result<void>> {
	return safeAsync(async () => {
		const res = await fetch(`/api/schedule/${schedule.id}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify(schedule),
		});

		if (!res.ok) {
			const data = await res.json();
			throw new Error(`${data.message}`);
		}
	}, "fetchScheduleUpdate");
}
