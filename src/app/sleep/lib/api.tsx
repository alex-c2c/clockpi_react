import React from "react";
import { SleepProps } from "@/app/sleep/types/Sleep";
import { checkDataValidity } from "@/app/sleep/lib/utils";

export async function fetchSleepCreate(
	sleep: SleepProps,
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
	setError: React.Dispatch<React.SetStateAction<string>>,
) {
	const dataError: string | null = checkDataValidity(sleep.startTime, sleep.duration, sleep.days);
	if (dataError != null) {
		setError(dataError);
		return false;
	}

	const data = {
		startTime: sleep.startTime,
		duration: sleep.duration,
		days: sleep.days,
		isEnabled: true
	}

	try {
		const res = await fetch("/api/sleep/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			cache: "no-store",
			body: JSON.stringify(data),
		});

		if (!res.ok) {
			console.error("Failed to create new sleep schedule");
			const j = await res.json()

			console.error(j);
			setError(`Failed to create sleep schedule: ${j.message}`);
		}
		else {
			setIsOpen(false);
			return true;
		}
	}
	catch (err) {
		console.error(`Failed to create sleep schedule: ${err}`);
		setError(`${err}`);
	}

	return false;
}

export async function fetchSleepDelete(
	id: number,
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
	setError: React.Dispatch<React.SetStateAction<string>>,
) {
	try {
		const res = await fetch(`/api/sleep/${id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			cache: "no-store",
		});

		if (!res.ok) {
			console.error("Failed to delete sleep schedule");
			const j = await res.json()

			console.error(j);
			setError(`Failed to delete sleep schedule: ${j.message}`);
		}
		else {
			//selectedSleep(null);
			setIsOpen(false);
			return true;
		}
	}
	catch (err) {
		console.error(`Failed to delete sleep schedule: ${err}`);
		setError(`${err}`);
	}

	return false;
}

export async function fetchSleepUpdate(
	sleep: SleepProps,
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
	setError: React.Dispatch<React.SetStateAction<string>>,
) {
	if (sleep.id == null) {
		setError("Invalid or missing ID");
		return;
	}

	const dataError: string | null = checkDataValidity(sleep.startTime, sleep.duration, sleep.days);
	if (dataError != null) {
		setError(dataError);
		return;
	}

	const data = {
		id: sleep.id,
		startTime: sleep.startTime,
		duration: sleep.duration,
		days: sleep.days,
		isEnabled: sleep.isEnabled
	}

	try {
		const res = await fetch(`/api/sleep/${sleep.id}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			cache: "no-store",
			body: JSON.stringify(data),
		});

		if (!res.ok) {
			console.error(`Failed to update sleep schedule (id:${sleep.id})`);
			const j = await res.json()

			console.error(j);
			setError(`Failed to update sleep schedule (id:${sleep.id}) - ${j.message}`);
		}
		else {
			setIsOpen(false);
		}
	}
	catch (err) {
		console.error(`Failed to create sleep schedule: ${err}`);
		setError(`${err}`);
	}
}
