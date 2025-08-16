import { ScheduleProps } from "@/app/schedule/types/Schedule";

export async function fetchScheduleCreate(
	schedule: ScheduleProps
): Promise<string>
{
	console.debug("fetchScheduleCreate");
	const data = {
		startTime: schedule.startTime,
		duration: schedule.duration,
		days: schedule.days,
		isEnabled: true
	}

	try {
		const res = await fetch("/api/schedule/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			cache: "no-store",
			body: JSON.stringify(data),
		});
		
		console.debug("res");
		console.debug(res);

		if (!res.ok) {
			const j = await res.json()
			
			console.error(`res error: ${JSON.stringify(j)}`);
			
			return j.message
		}
	}
	catch (err) {
		console.error(`API call failed: ${err}`);
		return `${err}`;
	}

	// success
	return "";
}

export async function fetchScheduleDelete(
	id: number,
): Promise<string>
{
	console.debug("fetchScheduleDelete");
	try {
		const res = await fetch(`/api/schedule/${id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			cache: "no-store",
		});
		
		console.debug("res");
		console.debug(res);

		if (!res.ok) {
			const j = await res.json();
			
			console.error(`res error: ${JSON.stringify(j)}`);

			return j.message;
		}
	}
	catch (err) {
		console.error(`API call failed: ${err}`);
		return `${err}`;
	}

	// success
	return "";
}

export async function fetchScheduleUpdate(
	schedule: ScheduleProps
): Promise<string>
{
	console.debug("fetchScheduleUpdate");
	try {
		const res = await fetch(`/api/schedule/${schedule.id}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			cache: "no-store",
			body: JSON.stringify(schedule),
		});

		console.debug("res");
		console.debug(res);
		
		if (!res.ok) {
			const j = await res.json()
			
			console.error(`res error: ${JSON.stringify(j)}`);
			return j.message;
		}
	}
	catch (err) {
		console.error(`API call failed: ${err}`);
		return `${err}`;
	}
	
	// success
	return ""
}
