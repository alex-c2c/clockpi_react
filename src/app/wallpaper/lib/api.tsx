import {
	WallpaperProps,
	WallpaperUpdateProps,
} from "@/app/wallpaper/types/Wallpaper";
import { Result, safeAsync } from "@/lib/result";

export function fetchWallpapers(): Promise<Result<WallpaperProps[]>> {
	return safeAsync(async () => {
		const res = await fetch("/api/wallpaper", {
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
					x: item.x,
					y: item.y,
					w: item.w,
					h: item.h,
					color: item.color,
					shadow: item.shadow,
				}));
			return wallpapers;
		}

		return [];
	}, "fetchWallpaper");
}

export function fetchWallpaperDelete(id: number): Promise<Result<void>> {
	return safeAsync(async () => {
		const res = await fetch(`/api/wallpaper/${id}`, {
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

export function fetchWallpaperUpdate(
	wallpaperUpdateProps: WallpaperUpdateProps
): Promise<Result<void>> {
	return safeAsync(async () => {
		const res = await fetch(`/api/wallpaper/${wallpaperUpdateProps.id}`, {
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
	payload: FormData
): Promise<Result<void>> {
	return safeAsync(async () => {
			const res = await fetch("/api/wallpaper/upload", {
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
