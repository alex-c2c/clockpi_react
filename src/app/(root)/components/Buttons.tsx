"use client"

import { useRouter } from "next/navigation";

export function ButtonSleepEdit() {
	const router = useRouter();

	const handleClick = async () => {
		router.push("/sleep");
	};

	return (
		<button onClick={handleClick} className="h-[50px] bg-stone-600 text-white rounded-xl shadow-lg flex items-center justify-center text-2xl font-semibold transition-all duration-200 ease-in-out hover:bg-stone-700">
			Edit
		</button>
	);
}

export function ButtonWallpaperEdit() {
	const router = useRouter();

	const handleClick = async () => {
		router.push("/wallpaper");
	};

	return (
		<button onClick={handleClick} className="w-1/3 h-[50px] bg-stone-600 text-white rounded-xl shadow-lg flex items-center justify-center text-2xl font-semibold transition-all duration-200 ease-in-out hover:bg-stone-700">
			Edit
		</button>
	);
}

export function ButtonWallpaperNext({ setTimestamp }: { setTimestamp: React.Dispatch<React.SetStateAction<number>> }) {
	const router = useRouter();

	const handleClick = async () => {
		try {
			const res = await fetch("/api/queue/next", {
				method: "GET",
				credentials: "include",
			});

			if (res.ok) {
				setTimestamp(Date.now());
				router.push("/");
			}
			else {
				console.error("Wallpaper queue next failed");
			}
		}
		catch (err) {
			console.error("Error calling /api/queue/next", err);
		}
	};

	return (
		<button onClick={handleClick} className="w-1/3 h-[50px] bg-stone-600 text-white rounded-xl shadow-lg flex items-center justify-center text-2xl font-semibold transition-all duration-200 ease-in-out hover:bg-stone-700">
			Next
		</button>
	);
}

export function ButtonWallpaperShuffle({ setTimestamp }: { setTimestamp: React.Dispatch<React.SetStateAction<number>> }) {
	const router = useRouter();

	const handleClick = async () => {
		try {
			const res = await fetch("/api/queue/shuffle", {
				method: "GET",
				credentials: "include",
			});

			if (res.ok) {
				setTimestamp(Date.now());
				router.push("/");
			}
			else {
				console.error("Wallpaper queue shuffle failed");
			}
		}
		catch (err) {
			console.error("Error calling /api/queue/shuffle", err);
		}
	};

	return (
		<button onClick={handleClick} className="w-1/3 h-[50px] bg-stone-600 text-white rounded-xl shadow-lg flex items-center justify-center text-2xl font-semibold transition-all duration-200 ease-in-out hover:bg-stone-700">
			Shuffle
		</button>
	);
}
