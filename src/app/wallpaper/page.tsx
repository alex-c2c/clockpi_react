"use client"

import { useEffect, useState } from "react";
import UploadDiv from "./components/UploadDiv";
import { WallpaperProps } from "./types/Wallpaper";
import { fetchWallpapers } from "./lib/api";
import GridDiv from "./components/GridDiv";

export default function WallpaperPage() {
	const [isFetchWallpapers, setIsFetchWallpapers] = useState<boolean>(true);
	const [wallpapers, setWallpapers] = useState<WallpaperProps[] | null>(null);
	
	useEffect(() => {
		if (isFetchWallpapers) {
			fetchWallpapers(setWallpapers);
			setIsFetchWallpapers(false);
		}
	}, [isFetchWallpapers]);

	return (
		<div className="flex gap-4 flex-col items-center pt-4 bg-stone-1000 mb-4">
			<UploadDiv />
			<GridDiv wallpapers={wallpapers} setIsFetchWallpapers={setIsFetchWallpapers}/>
		</div>
	);
}
