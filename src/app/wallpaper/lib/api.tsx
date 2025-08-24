import { WallpaperProps, WallpaperUpdateProps } from "../types/Wallpaper";

export async function fetchWallpapers(
	setWallpapers: React.Dispatch<React.SetStateAction<WallpaperProps[] | null>>
) {
	console.debug("fetchWallpapers");
	try {
		const res = await fetch("/api/wallpaper", {
			method: "GET",
			credentials: "include",
			cache: "no-store",
		});

		console.debug("res");
		console.debug(res);

		const data = await res.json()
		if (!res.ok) {
			console.error(`res error: ${JSON.stringify(data)}`);
		}
		else {
			console.debug("data");
			console.debug(data);
			if (!Array.isArray(data) || data.length == 0) {
				setWallpapers(null);
			}
			else {
				setWallpapers(data
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
						shadow: item.shadow
					})));
			}
			return;
		}
	}
	catch (err) {
		console.error(`API call failed: ${err}`);
		return `${err}`;
	}

	setWallpapers([]);
}

export async function fetchWallpaperDelete(id: number): Promise<string> {
	console.debug("fetchWallpaperDelete");
	try {
		const res = await fetch(`/api/wallpaper/${id}`, {
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

export async function fetchWallpaperUpdate(id: number, wallpaperUpdateProps: WallpaperUpdateProps): Promise<string> {
	console.debug("fetchWallpaperUpdate");
	console.debug(wallpaperUpdateProps);
	try {
		const res = await fetch(`/api/wallpaper/${id}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			cache: "no-store",
			body: JSON.stringify(wallpaperUpdateProps)
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
