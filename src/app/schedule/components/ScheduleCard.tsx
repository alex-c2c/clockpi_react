"use client";

import { useEffect, useState } from "react";

import { ScheduleProps } from "@/app/schedule/types/Schedule";
import { DAYS_OF_WEEK } from "@/app/schedule/lib/consts";
import { getEndTime } from "@/app/schedule/lib/utils";
import { fetchScheduleUpdate } from "@/app/schedule/lib/api";
import { Result } from "@/lib/result";

export default function ScheduleCard({
	schedule,
	setError,
}: {
	schedule: ScheduleProps;
	setError: React.Dispatch<React.SetStateAction<string>>;
}) {
	const [scheduleProps] = useState<ScheduleProps>(schedule);
	const endTime = getEndTime(schedule.startTime, schedule.duration);
	const [isEnabled, setIsEnabled] = useState<boolean>(schedule.isEnabled);
	const [isMobile, setIsMobile] = useState<boolean>(false);

	const handleToggleActive = async () => {
		setIsEnabled(!isEnabled);

		const data: ScheduleProps = {
			...scheduleProps,
			isEnabled: !isEnabled,
		};

		const result: Result<void> = await fetchScheduleUpdate(data);
		if (!result.success) {
			setError(result.error);
		}
	};

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 768); // or your desired mobile breakpoint
		};

		handleResize(); // set on mount
		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<div className="relative">
			<div className="cursor-pointer flex items-center gap-4 bg-stone-800 rounded-xl px-4 py-3 my-2 hover:bg-stone-700 transition">
				{/* Left section (info) */}
				<div className="flex flex-col flex-grow text-white">
					{/* Top row */}
					<div className="flex flex-wrap justify-between items-start mb-2 w-full">
						<div className="flex gap-12 sm:gap-16 flex-wrap">
							<div>
								<div className="text-m text-neutral-400 font-light">
									Start
								</div>
								<div className="text-xl font-mono">
									{schedule.startTime}
								</div>
							</div>
							<div>
								<div className="text-m text-neutral-400 font-light">
									End
								</div>
								<div className="text-xl font-mono">
									{endTime}
								</div>
							</div>
							<div>
								<div className="text-m text-neutral-400 font-light">
									Duration
								</div>
								<div className="text-xl font-mono">
									{schedule.duration}
								</div>
							</div>
						</div>

						{/* Toggle aligned to right */}
						<div className="flex items-center sm:mt-4">
							<label
								onClick={(e) => e.stopPropagation()}
								className="inline-flex items-center cursor-pointer"
							>
								<input
									type="checkbox"
									className="sr-only"
									checked={isEnabled}
									onChange={handleToggleActive}
								/>
								<div
									className={`w-12 h-6 rounded-full transition-colors duration-300 ${
										isEnabled
											? "bg-green-500"
											: "bg-neutral-400"
									}`}
								>
									<div
										className={`w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-300 ${
											isEnabled
												? "translate-x-6"
												: "translate-x-0"
										}`}
									/>
								</div>
							</label>
						</div>
					</div>

					{/* Bottom row (days of week) */}
					<div className="flex justify-between w-full text-xl uppercase text-center gap-2">
						{DAYS_OF_WEEK.map((day) => (
							<span
								key={day}
								className={`flex-1 py-1 rounded-lg font-mono ${
									schedule.days.includes(day.slice(0, 3))
										? "bg-green-500 text-white"
										: "bg-neutral-600 text-neutral-400"
								}`}
							>
								{isMobile ? day.slice(0, 1) : day.slice(0, 3)}
							</span>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
