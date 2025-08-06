"use client"

import { useState } from "react";
import { SleepProps } from "@/app/sleep/types/Sleep";
import { DAYS_OF_WEEK } from "@/app/sleep/lib/consts";
import { getEndTime } from "@/app/sleep/lib/utils";
import { fetchSleepUpdate } from "@/app/sleep/lib/api";

export default function SleepCard({
	sleep,
	setIsOpen,
	setError
}: {
	sleep: SleepProps,
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
	setError: React.Dispatch<React.SetStateAction<string>>,
}) {
	const [sleepProps] = useState<SleepProps>(sleep);
	const endTime = getEndTime(sleep.startTime, sleep.duration);
	const [isEnabled, setIsEnabled] = useState<boolean>(sleep.isEnabled);

	const handleToggleActive = async () => {
		setIsEnabled(!isEnabled);
		console.log("Toggled");

		const data: SleepProps = {
			...sleepProps,
			isEnabled: !isEnabled
		}

		fetchSleepUpdate(data, setIsOpen, setError);
	}

	return (
		<div className="relative">
			<div className="w-[640px] cursor-pointer flex items-center gap-4 bg-stone-800 rounded-xl px-4 py-3 my-2 hover:bg-stone-700 transition">
				{/* Left section (info) */}
				<div className="flex flex-col flex-grow text-white">
					{/* Top row */}
					<div className="flex gap-12 mb-4">
						<div>
							<div className="text-m text-neutral-400 font-light">Start</div>
							<div className="text-xl font-mono">{sleep.startTime}</div>
						</div>
						<div>
							<div className="text-m text-neutral-400 font-light">End</div>
							<div className="text-xl font-mono">{endTime}</div>
						</div>
						<div>
							<div className="text-m text-neutral-400 font-light">Duration (mins)</div>
							<div className="text-xl font-mono">{sleep.duration}</div>
						</div>
					</div>

					{/* Bottom row (days of week) */}
					<div className="flex gap-3 text-xl uppercase">
						{DAYS_OF_WEEK.map((day) => (
							<span
								key={day}
								className={`px-3 py-1 rounded-lg font-mono ${sleep.days.includes(day)
									? "bg-green-500 text-white"
									: "bg-neutral-600 text-neutral-400"
									}`}
							>
								{day}
							</span>
						))}
					</div>
				</div>

				{/* Toggle (vertically centered) */}
				<div className="self-stretch flex items-center">
					<label onClick={(e) => e.stopPropagation()} className="inline-flex items-center cursor-pointer">
						<input
							type="checkbox"
							className="sr-only"
							checked={isEnabled}
							onChange={handleToggleActive}
						/>
						<div className={`w-12 h-6 rounded-full transition-colors duration-300 ${isEnabled ? "bg-green-500" : "bg-neutral-400"}`}>
							<div className={`w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-300 ${isEnabled ? "translate-x-6" : "translate-x-0"}`} />
						</div>
					</label>
				</div>
			</div>
		</div>
	);
}
