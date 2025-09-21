"use client";

import { useRouter } from "next/navigation";
import { fetchQueueNext, fetchQueueShuffle } from "../lib/api";

export function ButtonScheduleEdit({deviceId} : {deviceId: number}) {
	const router = useRouter();

	const handleClick = async () => {
		router.push(`/device/${deviceId}/schedule`);
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

export function ButtonWallpaperEdit({deviceId} : {deviceId:number}) {
	const router = useRouter();

	const handleClick = async () => {
		router.push(`/device/${deviceId}/wallpaper`);
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
	deviceId,
	setIsFetchDevice,
}: {
	deviceId: number,
	setIsFetchDevice: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const handleClick = async () => {
		const result = await fetchQueueNext(deviceId);

		if (result.success) {
			setIsFetchDevice(true);
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
	deviceId,
	setIsFetchDevice,
}: {
	deviceId: number,
	setIsFetchDevice: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const handleClick = async () => {
		const result = await fetchQueueShuffle(deviceId);

		if (result.success) {
			setIsFetchDevice(true);
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
