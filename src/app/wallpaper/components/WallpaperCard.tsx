/* eslint-disable @next/next/no-img-element */
export default function WallpaperCard({
	wallpaperId
}:{
	wallpaperId: number
}) {
	
	const handleFetchImageError = () => {
		console.error("handleFetchImageError");
		//setError(true);
	}
	
	return (
		<>
			<img
				src={`/api/wallpaper-proxy?id=${wallpaperId}`}
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
