"use client"

import { useEffect, useState } from "react";
import { SleepProps } from "@/app/sleep/types/Sleep";
import SleepCard from "@/app/sleep/components/SleepCard";
import ModalSleepCreate from "@/app/sleep/components/ModalSleepCreate";
import ModalSleepUpdate from "@/app/sleep/components/ModalSleepUpdate";


export default function SleepPage() {
	const [error, setError] = useState<string>("");
	const [isCreateSleepModalOpen, setIsCreateSleepModalOpen] = useState<boolean>(false);
	const [isUpdateSleepModalOpen, setIsUpdateSleepModalOpen] = useState<boolean>(false);
	const [selectedSleep, setSelectedSleep] = useState<SleepProps | null>(null);
	const [sleepList, setSleepList] = useState<SleepProps[] | null>(null);

	const fetchSleepList = async () => {
		try {
			const res = await fetch("/api/sleep/", {
				method: "GET",
				credentials: "include",
			});

			if (!res.ok) {
				throw new Error(`HTTP Error! status: ${res.status}`);
			}
			else {
				const j = await res.json();

				console.log(j);
				if (!Array.isArray(j) || j.length == 0) {
					setSleepList(null);
				}
				else {
					setSleepList(j.map((item: SleepProps) => ({
						id: item.id,
						startTime: item.startTime,
						duration: item.duration,
						days: item.days,
						isEnabled: item.isEnabled
					})));
				}
			}
		}
		catch (err) {
			setError(`${err}`);
			console.error(`Error: ${err}`);
		}
	}

	const handleClickCard = (id: number) => {
		const sleep: SleepProps | undefined = sleepList?.find(item => item.id === id);
		console.log(sleep);

		if (sleep === undefined) {
			setSelectedSleep(null);
			setIsUpdateSleepModalOpen(false);
		}
		else {
			setSelectedSleep(sleep);
			setIsUpdateSleepModalOpen(true);
		}
	}

	useEffect(() => {
		fetchSleepList();
	}, [isCreateSleepModalOpen, isUpdateSleepModalOpen]);

	return (
		<div className="flex flex-col items-center pt-4 bg-stone-1000">
			<div className="w-[640px] bg-stone-800 rounded-xl px-6 mb-2 flex flex-col">
				<div className="flex justify-between items-center">

					{/* Sub-Header */}
					<h2 className="text-xl text-white uppercase tracking-widest font-extrabold">
						Sleep Schedule
					</h2>

					{/* "+" button */}
					<div className="relative">
						<button onClick={() => setIsCreateSleepModalOpen(true)} className="text-orange-400 text-3xl font-extrabold py-2 px-4 rounded hover:text-orange-500">
							+
						</button>

						{isCreateSleepModalOpen && (
							<ModalSleepCreate setIsOpen={setIsCreateSleepModalOpen} />
						)}
					</div >
				</div>
			</div>

			{/* Error label */}
			{error && (
				<h2 className="w-[640px] flex mt-4 ml-2 text-lg font-mono text-red-500">{error}</h2>
			)}

			{/* Sleep Card List */}
			{sleepList?.map((sleep, index) => (
				<div onClick={() => handleClickCard(sleep.id)} key={index}>
					<SleepCard
						key={index}
						sleep={sleep}
						setIsOpen={setIsUpdateSleepModalOpen}
						setError={setError}
					/>
				</div>
			))}

			{(isUpdateSleepModalOpen && selectedSleep != null) && (
				<ModalSleepUpdate selectedSleep={selectedSleep} setIsOpen={setIsUpdateSleepModalOpen} />
			)}
		</div>
	);
}
