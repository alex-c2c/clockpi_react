/* eslint-disable @next/next/no-img-element */
export default function WallpaperCard({
	deviceId,
	wallpaperId,
}: {
	deviceId: number,
	wallpaperId: number,
}) {
	const handleFetchImageError = () => {
		console.error("handleFetchImageError");
	};

	return (
		<>
			<img
				src={`/api/wallpaper-proxy?deviceId=${deviceId}&wallpaperId=${wallpaperId}`}
				alt={`Wallpaper ID: ${wallpaperId}`}
				width="auto"
				height="auto"
				className={`rounded-xl`}
				onError={handleFetchImageError}
				inert
			/>
		</>
	);
}
