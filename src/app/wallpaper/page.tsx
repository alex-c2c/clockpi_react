"use client";

import { useEffect, useState } from "react";

import UploadDiv from "@/app/wallpaper/components/UploadDiv";
import GridDiv from "@/app/wallpaper/components/GridDiv";
import { WallpaperProps } from "@/app/wallpaper/types/Wallpaper";
import { fetchWallpapers } from "@/app/wallpaper/lib/api";
import { Result } from "@/lib/result";

export default function WallpaperPage() {
	const [isFetchWallpapers, setIsFetchWallpapers] = useState<boolean>(true);
	const [wallpapers, setWallpapers] = useState<WallpaperProps[]>([]);

	useEffect(() => {
		if (!isFetchWallpapers) return;

		const fetch = async () => {
			const result: Result<WallpaperProps[]> = await fetchWallpapers();
			if (result.success) {
				setWallpapers(result.data);
			}

			setIsFetchWallpapers(false);
		};

		fetch();
	}, [isFetchWallpapers]);

	return (
		<div className="flex gap-4 flex-col items-center pt-4 bg-stone-1000 mb-4">
			<UploadDiv />
			<GridDiv
				wallpapers={wallpapers}
				setIsFetchWallpapers={setIsFetchWallpapers}
			/>
		</div>
	);
}
