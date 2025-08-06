"use client"

import { useEffect, useState } from "react";
import { SleepProps } from "@/app/sleep/types/Sleep";
import { DAYS_OF_WEEK } from "@/app/sleep/lib/consts";
import { fetchSleepDelete, fetchSleepUpdate } from "@/app/sleep/lib/api";
import { getEndTime } from "@/app/sleep/lib/utils";

export default function ModalSleepUpdate({
	selectedSleep,
	setIsOpen
}: {
	selectedSleep: SleepProps,
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
	const [id] = useState<number>(selectedSleep.id);
	const [startTime, setStartTime] = useState<string>(selectedSleep.startTime);
	const [endTime, setEndTime] = useState<string>("12:01");
	const [duration, setDuration] = useState<number>(selectedSleep.duration);
	const [days, setDays] = useState<string[]>(selectedSleep.days);
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

	const handleClickUpdate = async () => {
		const newSleep: SleepProps = {
			id: id,
			startTime: startTime,
			duration: duration,
			days: days,
			isEnabled: true
		};

		fetchSleepUpdate(newSleep, setIsOpen, setError);
	};

	const handleClickDelete = async () => {
		fetchSleepDelete(id, setIsOpen, setError);
	}

	useEffect(() => {
		setEndTime(getEndTime(startTime, duration));
	}, [startTime, duration])

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
						Update Sleep Schedule
					</h2>

					{/* Error messages */}
					{error && (
						<p className="text-l text-red-500 mb-4">{error}</p>
					)}

					<div className="grid grid-cols-2 gap-4 mb-6">
						{/* Row 1 */}
						<label className="self-center text-right tracking-wide font-semibold">Start Time</label>
						<input
							type="time"
							value={startTime}
							onChange={e => setStartTime(e.target.value)}
							className="border p-2 rounded w-[95px]"
						/>

						{/* Row 2 */}
						<label className="self-center text-right tracking-wide font-semibold">End Time</label>
						<input
							type="time"
							value={endTime}
							className="border p-2 rounded w-[95px]"
							disabled
						/>

						{/* Row 3 */}
						<label className="self-center text-right tracking-wide font-semibold">Duration (min)</label>
						<input
							type="number"
							min="1"
							max="1440"
							value={duration}
							onChange={e => setDuration(parseInt(e.target.value))}
							className="border p-2 rounded w-[95px]"
						/>

						{/* Row 4 */}
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

					{/* Create / Update button */}
					<button
						onClick={handleClickUpdate}
						className="bg-green-600 text-white hover:bg-green-700 hover:text-neutral-300 px-6 py-2 rounded-lg w-full mb-4"
					>
						Update
					</button>
					<button
						onClick={handleClickDelete}
						className="bg-red-600 text-white hover:bg-red-700 hover:text-neutral-300 px-6 py-2 rounded-lg w-full"
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	)
}
