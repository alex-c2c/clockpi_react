import {
	WallpaperProps,
	WallpaperUpdateProps,
} from "../types/Wallpaper";

import { Result, safeAsync } from "@/lib/result";

export function fetchWallpaperList(deviceId: number): Promise<Result<WallpaperProps[]>> {
	return safeAsync(async () => {
		const res = await fetch(`/flask/device/${deviceId}/wallpapers`, {
			method: "GET",
			credentials: "include",
		});

		const data = await res.json();
		if (!res.ok) {
			throw new Error(`${data.message}`);
		}

		if (Array.isArray(data) && data.length > 0) {
			const wallpapers: WallpaperProps[] = data
				.sort((a, b) => a.id - b.id)
				.map((item: WallpaperProps) => ({
					id: item.id,
					name: item.name,
					hash: item.hash,
					size: item.size,
					fileName: item.fileName,
					labelXPer: item.labelXPer,
					labelYPer: item.labelYPer,
					labelWPer: item.labelWPer,
					labelHPer: item.labelHPer,
					color: item.color,
					shadow: item.shadow,
				}));
			return wallpapers;
		}

		return [];
	}, "fetchWallpaper");
}

export function fetchWallpaperDelete(deviceId: number, wallpaperId: number): Promise<Result<void>> {
	return safeAsync(async () => {
		const res = await fetch(`/flask/device/${deviceId}/wallpaper/${wallpaperId}`, {
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
	}, "fetchWallpaperDelete");
}

export function fetchWallpaperDeleteAll(deviceId: number): Promise<Result<void>> {
	return safeAsync(async () => {
		const res = await fetch(`/flask/device/${deviceId}/wallpaper/delete-all`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});

		if (!res.ok) {
			const data = await res.json();
			throw new Error(`${data.message}`);
		}
	}, "fetchWallpaperDeleteAll");
}

export function fetchWallpaperUpdate(
	deviceId: number,
	wallpaperUpdateProps: WallpaperUpdateProps
): Promise<Result<void>> {
	return safeAsync(async () => {
		const res = await fetch(`/flask/device/${deviceId}/wallpaper/${wallpaperUpdateProps.id}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify(wallpaperUpdateProps),
		});

		if (!res.ok) {
			const data = await res.json();
			throw new Error(`${data.message}`);
		}
	}, "fetchWallpaperUpdate");
}

export function fetchWallpaperUpload(
	deviceId: number,
	payload: FormData
): Promise<Result<void>> {
	return safeAsync(async () => {
			const res = await fetch(`/flask/device/${deviceId}/wallpaper/upload`, {
				method: "POST",
				credentials: "include",
				body: payload,
			});
			
			if (!res.ok) {
				const data = await res.json();
				throw new Error(`${data.message}`);
			}
	}, "fetchWallpaperUpload");	
}
