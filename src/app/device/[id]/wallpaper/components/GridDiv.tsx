import { WallpaperProps } from "../types/Wallpaper";
import WallpaperCard from "./WallpaperCard";

export default function GridDiv({
	deviceId,
	wallpaperList,
	handleCardClick,
}: {
	deviceId: number;
	wallpaperList: WallpaperProps[];
	handleCardClick: (wallpaperId: number) => void;
}) {
	return (
		<div className="w-full max-w-4xl p-4 sm:p-6 mx-auto bg-stone-800 rounded-2xl flex flex-col justify-center">
			<h2 className="text-xl sm:text-xl text-white mb-2 self-start uppercase tracking-widest font-extrabold">
				Wallpapers
			</h2>
			<div className="w-full h-px bg-white opacity-30 mb-6" />

			{/* Wallpaper Card List */}
			<div className="grid grid-cols-3 gap-4">
				{wallpaperList.map((wallpaper, index) => (
					<div
						onClick={() => handleCardClick(wallpaper.id)}
						key={index}
						className="hover:scale-105 duration-300 ease-in-out"
					>
						<WallpaperCard
							deviceId={deviceId}
							wallpaperId={wallpaper.id} />
					</div>
				))}
			</div>
		</div>
	);
}
