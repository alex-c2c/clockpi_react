/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { WallpaperProps } from "../types/Wallpaper";
import WallpaperCard from "./WallpaperCard";
import ModalWallpaperUpdate from "./ModalWallpaperUpdate";

export default function GridDiv({
	wallpapers,
	setIsFetchWallpapers
}: {
	wallpapers: WallpaperProps[] | null,
	setIsFetchWallpapers: React.Dispatch<React.SetStateAction<boolean>>
}) {
	const [isModalWallpaperUpdateOpen, setIsModalWallpaperUpdateOpen] = useState<boolean>(false);
	const [selectedWallpaper, setSelectedWallpaper] = useState<WallpaperProps | null>(null);

	const handleClick = (id: number) => {
		setIsModalWallpaperUpdateOpen(true);
		
		const wallpaper: WallpaperProps | undefined = wallpapers?.find(item => item.id === id);
		if (wallpaper) {
			setSelectedWallpaper(wallpaper);
		}
		else {
			setSelectedWallpaper(null);
		}

		console.debug(`clicked on id: ${JSON.stringify(wallpaper)}`);
	}

	return (
		<div className="w-full max-w-4xl p-4 sm:p-6 mx-auto bg-stone-800 rounded-2xl flex flex-col justify-center">
			<h2 className="text-xl sm:text-xl text-white mb-2 self-start uppercase tracking-widest font-extrabold">
				Wallpapers
			</h2>
			<div className="w-full h-px bg-white opacity-30 mb-6" />

			{/* Wallpaper Card List */}
			<div className="grid grid-cols-3 gap-4">
				{wallpapers?.map((wallpaper, index) => (
					<div onClick={() => handleClick(wallpaper.id)} key={index} className="hover:scale-105 duration-300 ease-in-out">
						<WallpaperCard wallpaperId={wallpaper.id} />
					</div>
				))}
			</div>

			{(isModalWallpaperUpdateOpen && selectedWallpaper != null) && (
				<ModalWallpaperUpdate selectedWallpaper={selectedWallpaper} setIsOpen={setIsModalWallpaperUpdateOpen} setIsFetchWallpapers={setIsFetchWallpapers} />
			)}
		</div>
	);
}
