import { Result, safeAsync } from "@/lib/result";
import {DeviceProps, DeviceCreateProps, DeviceUpdateProps } from "@/app/device/[id]/types/Device"

export function fetchDeviceList(): Promise<Result<DeviceProps[]>> {
	return safeAsync(async () => {				
		const res = await fetch("/api/device", {
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
	}, "fetchDeviceList");
}

export function fetchDeviceCreate(deviceCreateProps: DeviceCreateProps): Promise<Result<void>> {
	return safeAsync(async () => {
		const res = await fetch("/api/device/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify(deviceCreateProps),
		});
		
		const data = await res.json();
		if (!res.ok)
		{
			throw new Error(`${data.message}`);
		}
	})
}

export function fetchDeviceUpdate(deviceId: number, deviceUpdateProps: Partial<DeviceUpdateProps>): Promise<Result<void>> {
	return safeAsync(async () => {
		const res = await fetch(`/api/device/${deviceId}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify(deviceUpdateProps),
		});
		
		const data = await res.json();
		if (!res.ok)
		{
			console.error(data);
			throw new Error(`${data.message}`);
		}
	})
}

export function fetchDeviceDelete(deviceId: number): Promise<Result<void>> {
	return safeAsync(async () => {
		const res = await fetch(`/api/device/${deviceId}`, {
			method: "DELETE",
			credentials: "include",
		});
		
		if (!res.ok)
		{
			const data = await res.json();
			throw new Error(`${data.message}`);
		}
	})
}
