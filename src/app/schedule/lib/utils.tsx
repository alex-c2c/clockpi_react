import { DAYS_OF_WEEK } from "@/app/schedule/lib/consts";

function checkTimeValidity(hour: number, minute: number): string | null {
	if (hour === null || hour < 0 || hour > 23) {
		return "Invalid range for hour: 0 - 23";
	}

	if (minute === null || minute < 0 || minute > 59) {
		return "Invalid range for minute: 0 - 59";
	}

	return null;
}

function checkDurationValidity(duration: number): string | null {
	if (duration === null || duration <= 0 || duration > 1440) {
		return "Invalid range for duratio: 1 - 1440";
	}

	return null;
}

function checkDaysValidity(days: string[]): string | null {
	if (days.length > 7) {
		return "Invalid size for days";
	}

	if (!days.every(value => DAYS_OF_WEEK.includes(value))) {
		return "Invalid data in days";
	}

	return null;
}

export function checkDataValidity(startTime: string, duration: number, days: string[]) {
	const hour: number = parseInt(startTime.slice(0, 3), 10);
	const minute: number = parseInt(startTime.slice(3, 6), 10);

	let err: string | null = "";

	err = checkTimeValidity(hour, minute);
	if (err != null) {
		return err;
	}

	err = checkDurationValidity(duration);
	if (err != null) {
		return err;
	}

	err = checkDaysValidity(days);
	if (err != null) {
		return err;
	}

	return null;
}

export function getEndTime(startTime: string, duration: number): string {
	const [hours, minutes] = startTime.split(":").map(Number);

	const date = new Date();
	date.setHours(hours);
	date.setMinutes(minutes);
	date.setSeconds(0);
	date.setMilliseconds(0);

	date.setMinutes(date.getMinutes() + duration);

	const endHours = date.getHours().toString().padStart(2, "0");
	const endMinutes = date.getMinutes().toString().padStart(2, "0");

	return `${endHours}:${endMinutes}`;
}
