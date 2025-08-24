"use client";

import { fetchEpdClear, fetchEpdRefresh } from "../lib/api";

export default function EpdDiv() {

	return (
		<div className="w-full max-w-4xl p-4 sm:p-6 mx-auto bg-stone-800 rounded-2xl flex flex-col justify-center">
			<h2 className="text-xl sm:text-xl text-white mb-2 self-start uppercase tracking-widest font-extrabold">
				E-Paper Display
			</h2>
			<div className="w-full h-px bg-white opacity-30 mb-4 sm:mb-6" />
			<div className="flex gap-4">
				<button onClick={fetchEpdRefresh} className="w-1/2 h-[50px] bg-stone-600 text-white rounded-xl shadow-lg flex items-center justify-center text-2xl font-semibold transition-all duration-200 ease-in-out hover:bg-stone-700" >
					Refresh EPD
				</button>
				<button onClick={fetchEpdClear} className="w-1/2 h-[50px] aspect-[16/4] bg-stone-600 text-white rounded-xl shadow-lg flex items-center justify-center text-2xl font-semibold transition-all duration-200 ease-in-out hover:bg-stone-700">
					Clear EPD
				</button>
			</div>
		</div>
	);
}
