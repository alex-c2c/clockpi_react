"use client";

import { Result, safeAsync } from "@/lib/result";
import { DeviceProps } from "../types/Device"

export function fetchDevice(deviceId: number): Promise<Result<DeviceProps>> {
	return safeAsync(async () => {
		const res = await fetch(`/flask/device/${deviceId}`, {
			method: "GET",
			credentials: "include",
		});

		const data = await res.json();
		if (!res.ok) {
			throw new Error(`${data.message}`);
		}
		
		return data as DeviceProps;
	}, "fetchDevice");
}

export function fetchQueue(deviceId: number): Promise<Result<number[]>> {
	return safeAsync(async () => {
		const res = await fetch(`/flask/device/${deviceId}/queue`, {
			method: "GET",
			credentials: "include",
		});

		const data = await res.json();
		if (!res.ok) {
			throw new Error(`${data.message}`);
		}
		
		return data;
	}, "fetchQueue");
}

export function fetchDevices(): Promise<Result<DeviceProps[]>> {
	return safeAsync(async () => {
		const res = await fetch("/flask/device", {
			method: "GET",
			credentials: "include",
		});

		const data = await res.json();
		if (!res.ok) {
			throw new Error(`${data.message}`);
		}
		
		if (Array.isArray(data) && data.length > 0) {
			const devices: DeviceProps[] = data
				.sort((a, b) => a.id - b.id)
				.map((item: DeviceProps) => ({
					id: item.id,
					name: item.name,
					desc: item.desc,
					ipv4: item.ipv4,
					type: item.type,
					orientation: item.orientation,
					supportedColors: item.supportedColors,
					defaultLabelColor: item.defaultLabelColor,
					defaultLabelShadow: item.defaultLabelShadow,
					width: item.width,
					height: item.height,
					queue: item.queue,
					isDrawGrid: item.isDrawGrid,
					isEnabled: item.isEnabled,
				}));
			return devices;
		}
		
		return [];
	}, "fetchDevices");
}

export function fetchQueueNext(deviceId: number): Promise<Result<void>> {
	return safeAsync(async () => {
		const res = await fetch(`/flask/device/${deviceId}/queue/next`, {
			method: "POST",
			credentials: "include",
		});

		if (!res.ok) {
			const data = await res.json();
			throw new Error(`${data.message}`);
		}
	}, "fetchQueueNext");
}

export function fetchQueueShuffle(deviceId: number): Promise<Result<void>> {
	return safeAsync(async () => {
		const res = await fetch(`/flask/device/${deviceId}/queue/shuffle`, {
			method: "POST",
			credentials: "include",
		});

		if (!res.ok) {
			const data = await res.json();
			throw new Error(`${data.message}`);
		}
	}, "fetchQueueShuffle");
}

export function fetchEpdRefresh(deviceId: number): Promise<Result<void>> {
	return safeAsync(async () => {
		const res = await fetch(`/flask/device/${deviceId}/display/refresh`, {
			method: "POST",
			credentials: "include",
		});

		if (!res.ok) {
			const data = await res.json();
			throw new Error(`${data.message}`);
		}
	}, "fetchEpdRefresh");
}

export function fetchEpdClear(deviceId: number): Promise<Result<void>> {
	return safeAsync(async () => {
		const res = await fetch(`/flask/device/${deviceId}/display/clear`, {
			method: "POST",
			credentials: "include",
		});

		if (!res.ok) {
			const data = await res.json();
			throw new Error(`${data.message}`);
		}
	}, "fetchEpdClear");
}

export function fetchSleepStatus(deviceId: number): Promise<Result<boolean>> {
	return safeAsync(async () => {
		const res = await fetch(`/flask/device/${deviceId}/sleep-status`, {
			method: "GET",
			credentials: "include",
		});

		const data = await res.json();
		if (!res.ok) {
			throw new Error(`${data.message}`);
		}
		
		return data.isSleep;
	}, "fetchSleepStatus");
}
