"use client"

import { useEffect, useState } from "react";

import { ScheduleProps } from "../types/Schedule";
import { DAYS_OF_WEEK } from "../lib/consts";
import { fetchScheduleCreate } from "../lib/api";
import { checkDataValidity, getEndTime } from "../lib/utils";
import { Result } from "@/lib/result"

export default function ModalScheduleCreate({
	deviceId,
	setIsOpen,
	setIsFetchSchedules: setIsFetchData
}: {
	deviceId: number
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
	setIsFetchSchedules: React.Dispatch<React.SetStateAction<boolean>>
}) {
	const [startTime, setStartTime] = useState<string>("12:00");
	const [duration, setDuration] = useState<number>(1);
	const [endTime, setEndTime] = useState<string>("12:01");
	const [days, setDays] = useState<string[]>([]);
	const [error, setError] = useState("");

	const toggleDay = (day: string) => {
		setDays(prev =>
			prev.includes(day)
				? prev.filter(d => d !== day)
				: [...prev, day]
		);
	};

	const handleClickClose = async () => {
		setIsOpen(false);
	}

	const handleClickCreate = async () => {
		// validate data before fetching API
		const dataError: string | null = checkDataValidity(startTime, duration, days);
		if (dataError != null) {
			setError(dataError);
			return;
		}

		// convert data to object
		const newSchedule: ScheduleProps = {
			id: 0,
			startTime: startTime,
			duration: duration,
			days: days,
			isEnabled: true
		};

		// fetch API and await result
		const result: Result<void> = await fetchScheduleCreate(deviceId, newSchedule);
		if (!result.success) {
			setError(result.error);
		}
		else {
			setIsOpen(false);
			setIsFetchData(true);
		}
	};

	useEffect(() => {
		setEndTime(getEndTime(startTime, duration));
	}, [startTime, duration])

	useEffect(() => {
		const handleEscKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setIsOpen(false);
			}
		};

		window.addEventListener('keydown', handleEscKeyDown);

		return () => {
			window.removeEventListener('keydown', handleEscKeyDown);
		};
	}, [setIsOpen]);

	return (
		<div className="relative">
			<div className="fixed inset-0 z-50 flex items-center justify-center">
				{/* Overlay Background */}
				<div
					onClick={handleClickClose}
					className="absolute inset-0 bg-black opacity-50">
				</div>

				{/* Model Content */}
				<div className="relative bg-stone-700 p-6 rounded-2xl shadow-lg text-center items-center justify-center">
					{/* Header */}
					<h2 className="text-2xl text-white uppercase tracking-wider font-semibold mb-4">
						New Schedule
					</h2>

					{/* Error messages */}
					{error && (
						<p className="text-l text-red-500 mb-4">{error}</p>
					)}

					<div className="grid grid-cols-2 gap-4 mb-6">
						{/* Start time */}
						<label className="self-center text-right tracking-wide font-semibold">Start Time</label>
						<input
							type="time"
							value={startTime}
							onChange={e => setStartTime(e.target.value)}
							className="border p-2 rounded w-[95px]"
						/>

						{/* End time */}
						<label className="self-center text-right tracking-wide font-semibold">End Time</label>
						<input
							type="time"
							value={endTime}
							className="border p-2 rounded w-[95px]"
							disabled
						/>

						{/* Duration */}
						<label className="self-center text-right tracking-wide font-semibold">Duration (min)</label>
						<input
							type="number"
							min="1"
							max="1440"
							value={duration}
							onChange={e => setDuration(parseInt(e.target.value))}
							className="border p-2 rounded w-[95px]"
						/>

						{/* Days */}
						<label className="self-start text-right tracking-wide font-semibold">Days</label>
						<div className="flex flex-col gap-2">
							{DAYS_OF_WEEK.map((day) => (
								<button
									key={day}
									onClick={() => toggleDay(day)}
									className={`px-3 py-1 rounded-lg w-[95px] ${days.includes(day)
										? "bg-green-500 text-white hover:bg-green-600"
										: "bg-neutral-600 text-neutral-400 hover:bg-neutral-500"
										}`}
								>
									{day.toUpperCase()}
								</button>
							))}
						</div>
					</div>

					{/* Create button */}
					<button
						onClick={handleClickCreate}
						className="bg-green-600 text-white hover:bg-green-700 hover:text-neutral-300 px-6 py-2 rounded-lg w-full"
					>
						Create
					</button>
				</div>
			</div>
		</div>
	)
}
