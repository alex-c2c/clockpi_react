"use client"

import { useState } from "react";
import { ScheduleProps } from "@/app/schedule/types/Schedule";
import { DAYS_OF_WEEK } from "@/app/schedule/lib/consts";
import { getEndTime } from "@/app/schedule/lib/utils";
import { fetchScheduleUpdate } from "@/app/schedule/lib/api";

export default function ScheduleCard({
	schedule,
	setError
}: {
	schedule: ScheduleProps,
	setError: React.Dispatch<React.SetStateAction<string>>,
}) {
	const [scheduleProps] = useState<ScheduleProps>(schedule);
	const endTime = getEndTime(schedule.startTime, schedule.duration);
	const [isEnabled, setIsEnabled] = useState<boolean>(schedule.isEnabled);

	const handleToggleActive = async () => {
		setIsEnabled(!isEnabled);

		const data: ScheduleProps = {
			...scheduleProps,
			isEnabled: !isEnabled
		}
		
		const err: string = await fetchScheduleUpdate(data);		
		if (err) {
			setError(err);
		}
	}

	return (
		<div className="relative">
			<div className="w-[640px] cursor-pointer flex items-center gap-4 bg-stone-800 rounded-xl px-4 py-3 my-2 hover:bg-stone-700 transition">
				{/* Left section (info) */}
				<div className="flex flex-col flex-grow text-white">
					<h1>ID: {schedule.id}</h1>
					{/* Top row */}
					<div className="flex gap-12 mb-4">
						<div>
							<div className="text-m text-neutral-400 font-light">Start</div>
							<div className="text-xl font-mono">{schedule.startTime}</div>
						</div>
						<div>
							<div className="text-m text-neutral-400 font-light">End</div>
							<div className="text-xl font-mono">{endTime}</div>
						</div>
						<div>
							<div className="text-m text-neutral-400 font-light">Duration (mins)</div>
							<div className="text-xl font-mono">{schedule.duration}</div>
						</div>
					</div>

					{/* Bottom row (days of week) */}
					<div className="flex gap-3 text-xl uppercase">
						{DAYS_OF_WEEK.map((day) => (
							<span
								key={day}
								className={`px-3 py-1 rounded-lg font-mono ${schedule.days.includes(day)
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
