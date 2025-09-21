import { useEffect, useState } from "react";
import { ButtonScheduleEdit } from "./Buttons";
import { fetchSleepStatus } from "../lib/api";
import { Result } from "@/lib/result";


export default function ScheduleDiv({
	deviceId
} : {
	deviceId: number
}) {
	const [isSleep, setIsSleep] = useState<boolean>(false);
	const [isFetchSleepStatus, setIsFetchSleepStatus] = useState<boolean>(true);
	
	useEffect(() => {
			if (!isFetchSleepStatus) return;
	
			const fetch = async () => {
				const result: Result<boolean> = await fetchSleepStatus(deviceId);
				if (result.success) {
					setIsSleep(result.data);					
				}
	
				setIsFetchSleepStatus(false);
			};
	
			fetch();
		}, [isFetchSleepStatus, deviceId]);
	
	return (
		<div className="w-full max-w-4xl p-4 sm:p-6 mx-auto bg-stone-800 rounded-2xl flex flex-col justify-center">
			<h2 className="text-xl sm:text-xl text-white mb-2 self-start uppercase tracking-widest font-extrabold">
				Sleep Schedule
			</h2>
			<div className="w-full h-px bg-white opacity-30 mb-6" />
			<div className="flex space-x-2">
				<p className="text-l text-white mb-4 p-0.5 tracking-wider font-semibold">
					Current Status:
				</p>
				{isSleep ? (
					<p className="text-l text-green-400 bg-gray-500 rounded-2xl px-4 py-1 mb-4 tracking-widest font-extrabold">
						SLEEPING 💤
					</p>
				) : (
					<p className="text-l text-white bg-gray-500 rounded-2xl px-4 py-1 mb-4 tracking-widest font-extrabold">
						AWAKE
					</p>
				)}
			</div>
			
			<ButtonScheduleEdit deviceId={deviceId} />
		</div>
	);
}
