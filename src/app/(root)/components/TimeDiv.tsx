"use client";

import { useEffect, useState } from "react";

export default function TimeDiv() {
	const [time, setTime] = useState(new Date());
	const [showColon, setShowColon] = useState(true);

	useEffect(() => {
		const interval = setInterval(() => {
			setTime(new Date());
			setShowColon(prev => !prev);
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	const [hour, minute] = time
		.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
		.split(":");

	return (
		<div className="w-[800px] bg-stone-800 rounded-2xl p-6 flex flex-col justify-center">
			<h2 className="text-xl text-white mb-2 self-start uppercase tracking-widest font-extrabold">
				Current Time
			</h2>
			<div className="w-full h-px bg-white opacity-30 mb-6" />

			{/* Time Label with animation */}
			<div className="text-5xl text-center">
				{hour}
				<span className="inline-block w-[0.5ch] transition-opacity duration-200" style={{ opacity: showColon ? 1 : 0 }}>
					:
				</span>
				{minute}
			</div>
		</div>

	);
}
