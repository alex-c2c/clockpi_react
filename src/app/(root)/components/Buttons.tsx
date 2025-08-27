"use client";

import { useRouter } from "next/navigation";
import { fetchQueueNext, fetchQueueShuffle } from "@/app/(root)/lib/api";

export function ButtonScheduleEdit() {
	const router = useRouter();

	const handleClick = async () => {
		router.push("/schedule");
	};

	return (
		<button
			onClick={handleClick}
			className="h-[50px] bg-stone-600 text-white rounded-xl shadow-lg flex items-center justify-center text-2xl font-semibold transition-all duration-200 ease-in-out hover:bg-stone-700"
		>
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
		<button
			onClick={handleClick}
			className="w-1/3 h-[50px] bg-stone-600 text-white rounded-xl shadow-lg flex items-center justify-center text-2xl font-semibold transition-all duration-200 ease-in-out hover:bg-stone-700"
		>
			Edit
		</button>
	);
}

export function ButtonWallpaperNext({
	setIsFetchQueue,
}: {
	setIsFetchQueue: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const handleClick = async () => {
		const result = await fetchQueueNext();

		if (result.success) {
			setIsFetchQueue(true);
		}
	};

	return (
		<button
			onClick={handleClick}
			className="w-1/3 h-[50px] bg-stone-600 text-white rounded-xl shadow-lg flex items-center justify-center text-2xl font-semibold transition-all duration-200 ease-in-out hover:bg-stone-700"
		>
			Next
		</button>
	);
}

export function ButtonWallpaperShuffle({
	setIsFetchQueue,
}: {
	setIsFetchQueue: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const handleClick = async () => {
		const result = await fetchQueueShuffle();

		if (result.success) {
			setIsFetchQueue(true);
		}
	};

	return (
		<button
			onClick={handleClick}
			className="w-1/3 h-[50px] bg-stone-600 text-white rounded-xl shadow-lg flex items-center justify-center text-2xl font-semibold transition-all duration-200 ease-in-out hover:bg-stone-700"
		>
			Shuffle
		</button>
	);
}
