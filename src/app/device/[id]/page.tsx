"use client";

import { useEffect, useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";

import EpdDiv from "./components/EpdDiv";
import CarouselDiv from "./components/CarouselDiv";
import ScheduleDiv from "./components/ScheduleDiv";
import { fetchDevice } from "./lib/api";
import { DeviceProps } from "./types/Device";

import { Result } from "@/lib/result";

export default function DevicePage() {
	const router = useRouter();

	const params = useParams<{ id: string }>();
	if (!params || !/^\d+$/.test(params.id)) {
		notFound();
	}

	const deviceId: number = parseInt(params.id);
	const [device, setDevice] = useState<DeviceProps | null>(null);
	const [isFetchDevice, setIsFetchDevice] = useState<boolean>(true);
	const [error, setError] = useState<string>("");

	useEffect(() => {
		if (!isFetchDevice) return;

		const fetch = async () => {
			const result: Result<DeviceProps> = await fetchDevice(deviceId);
			if (result.success) {
				setError("");
				setDevice(result.data);
			} else {
				setError(result.error);
				setDevice(null);
			}

			setIsFetchDevice(false);
		};

		fetch();
	}, [isFetchDevice, deviceId]);

	return (
		<div className="flex gap-4 flex-col items-center bg-stone-1000 my-4">
			<div className="w-full max-w-4xl rounded-xl flex flex-col space-y-4">
				{/* Page Header */}
				<div className="w-full max-w-4xl bg-stone-800 rounded-xl px-4 py-3 flex justify-between items-center">
					<div className="text-3xl text-white font-bold truncate flex items-center gap-4">
						<span
							onClick={() => {
								router.push(`/`);
							}}
							className="cursor-pointer hover:text-neutral-400"
						>
							Devices
						</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 text-neutral-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={3}
								d="M13 5l7 7-7 7M5 5l7 7-7 7"
							/>
						</svg>
						<span
							onClick={() => {
								router.push(`/device/${deviceId}`);
							}}
							className="cursor-pointer hover:text-neutral-400"
						>
							{device?.name}
						</span>
					</div>
				</div>

				{/* Error label */}
				{error && (
					<h2 className="w-[640px] flex my-4 ml-2 text-lg font-mono text-red-500">
						{error}
					</h2>
				)}

				{device && (
					<div className="space-y-4">
						<EpdDiv deviceId={deviceId} />
						<CarouselDiv
							deviceProps={device}
							setIsFetchDevice={setIsFetchDevice}
						/>
						<ScheduleDiv deviceId={deviceId} />
					</div>
				)}
			</div>
		</div>
	);
}
