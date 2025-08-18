import { useState } from "react";

/* eslint-disable @next/next/no-img-element */
export default function CarouselImage({ wallpaperId, index }: { wallpaperId: number, index: number }) {
	const [error, setError] = useState<boolean>(false);

	const handleFetchImageError = () => {
		console.error("handleFetchImageError");
		setError(true);
	}

	return (
		<>
			{error ? (
				<p>Unable to retrieve image file for ID: {wallpaperId}</p>
			) : (
				<div className="relative inline-block">
					{/* Number label */}
					<span className={`absolute ${index === 0 ? 
						"top-1 left-1 bg-green-400 text-white text-2xl px-2 py-0 rounded-tl-2xl rounded-br-md z-100" : 
						"top-[18px] left-[24px] bg-neutral-800 text-white text-xl px-2 py-0 rounded-full z-100"}`}>
						{index + 1}
					</span>
					{/* Image */}
					<img
						src={`/api/wallpaper-proxy?id=${wallpaperId}`}
						alt={`Wallpaper ID: ${wallpaperId}`}
						width="auto"
						height="auto"
						className={`rounded-3xl ${index === 0 ? "border-6 border-green-400" : "opacity-60 scale-95"}`}
						onError={handleFetchImageError}
						inert
					/>
				</div>

			)}
		</>
	);
}
