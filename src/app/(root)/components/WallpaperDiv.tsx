"use client"

import Image from "next/image";
import { ButtonWallpaperShuffle, ButtonWallpaperNext, ButtonWallpaperEdit } from "@/app/(root)/components/Buttons";
import { useEffect, useState } from "react";

export default function WallpaperDiv() {
	const [timestamp, setTimestamp] = useState(0);

	useEffect(() => {
		setTimestamp(Date.now());
	}, []);

	const currentWallpaperSrc = `/api/wallpaper-proxy?id=current${timestamp ? `&_t=${timestamp}` : ""}`;

	return (
		<div className="w-[640px] bg-stone-800 rounded-2xl p-6 flex flex-col justify-center">
			<h2 className="text-xl text-white mb-2 self-start uppercase tracking-widest font-extrabold">
				Wallpaper
			</h2>
			<div className="w-full h-px bg-white opacity-30 mb-6" />
			<div className="flex items-center justify-center mb-6">
				<Image
					src={currentWallpaperSrc}
					alt="Image of current wallpaper"
					width={640}
					height={384}
					priority={true}
				>
				</Image>
			</div>

			<div className="flex gap-8">
				<ButtonWallpaperShuffle setTimestamp={setTimestamp} />
				<ButtonWallpaperNext setTimestamp={setTimestamp} />
				<ButtonWallpaperEdit />
			</div>
		</div>
	);
}
