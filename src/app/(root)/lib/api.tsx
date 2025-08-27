"use client";

import { Result, safeAsync } from "@/lib/result";

export function fetchQueueNext(): Promise<Result<void>> {
	return safeAsync(async () => {
		const res = await fetch("/api/queue/next", {
			method: "GET",
			credentials: "include",
		});

		if (!res.ok) {
			const data = await res.json();
			throw new Error(`${data.message}`);
		}
	}, "fetchQueueNext");
}

export function fetchQueueShuffle(): Promise<Result<void>> {
	return safeAsync(async () => {
		const res = await fetch("/api/queue/shuffle", {
			method: "GET",
			credentials: "include",
		});

		if (!res.ok) {
			const data = await res.json();
			throw new Error(`${data.message}`);
		}
	}, "fetchQueueShuffle");
}

export function fetchQueue(): Promise<Result<number[]>> {
	return safeAsync(async () => {
		const res = await fetch("/api/queue", {
			method: "GET",
			credentials: "include",
		});

		if (!res.ok) {
			const data = await res.json();
			throw new Error(`${data.message}`);
		}

		const queue: number[] = await res.json();
		return queue;
	}, "fetchQueue");
}

export function fetchEpdRefresh(): Promise<Result<void>> {
	return safeAsync(async () => {
		const res = await fetch("/api/epd/refresh", {
			method: "GET",
			credentials: "include",
		});

		if (!res.ok) {
			const data = await res.json();
			throw new Error(`${data.message}`);
		}
	}, "fetchEpdRefresh");
}

export function fetchEpdClear(): Promise<Result<void>> {
	return safeAsync(async () => {
		const res = await fetch("/api/epd/clear", {
			method: "GET",
			credentials: "include",
		});

		if (!res.ok) {
			const data = await res.json();
			throw new Error(`${data.message}`);
		}
	}, "fetchEpdClear");
}
