import { ScheduleProps } from "../types/Schedule";
import { Result, safeAsync } from "@/lib/result";

export function fetchScheduleList(deviceId: number): Promise<Result<ScheduleProps[]>> {
	return safeAsync(async () => {
		const res = await fetch(`/api/device/${deviceId}/schedules`, {
			method: "GET",
			credentials: "include",
		});

		const data = await res.json();
		if (!res.ok) {
			throw new Error(`${data.message}`);
		}

		if (Array.isArray(data) && data.length > 0) {
			const schedules: ScheduleProps[] = data
				.sort((a, b) => a.id - b.id)
				.map((item: ScheduleProps) => ({
					id: item.id,
					startTime: item.startTime,
					duration: item.duration,
					days: item.days,
					isEnabled: item.isEnabled,
				}));
			return schedules;
		}

		return [];
	}, "fetchScheduleList");
}

export function fetchScheduleCreate(
	deviceId: number,
	newSchedule: ScheduleProps
): Promise<Result<void>> {
	return safeAsync(async () => {
		const res = await fetch(`/api/device/${deviceId}/schedule/create`, {
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

export function fetchScheduleDelete(deviceId: number, scheduleId: number): Promise<Result<void>> {
	return safeAsync(async () => {
		const res = await fetch(`/api/device/${deviceId}/schedule/${scheduleId}`, {
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
	deviceId: number,
	schedule: ScheduleProps
): Promise<Result<void>> {
	return safeAsync(async () => {
		const res = await fetch(`/api/device/${deviceId}/schedule/${schedule.id}`, {
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
