"use client";

import {
	ButtonWallpaperShuffle,
	ButtonWallpaperNext,
	ButtonWallpaperEdit,
} from "@/app/(root)/components/Buttons";
import { fetchQueue } from "@/app/(root)/lib/api";
import CarouselImage from "@/app/(root)/components/CarouselImage";

import { useEffect, useState } from "react";
import Slider from "react-slick";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function NextArrow(props: any) {
	const { className, onClick } = props;
	return (
		<div
			className={`${className} mr-10 mt-2 sm:mr-14 scale-200 sm:scale-300 z-10`}
			onClick={onClick}
		/>
	);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PrevArrow(props: any) {
	const { className, onClick } = props;
	return (
		<div
			className={`${className} ml-10 mt-2 sm:ml-14 scale-200 sm:scale-300 z-100`}
			onClick={onClick}
		/>
	);
}

export default function CarouselDiv() {
	const [error, setError] = useState<string>("");
	const [isFetchQueue, setIsFetchQueue] = useState<boolean>(true);
	const [queue, setQueue] = useState<number[]>([]);

	const settings = {
		className: "center",
		centerMode: true,
		infinite: true,
		centerPadding: "80px",
		slidesToShow: 1,
		speed: 500,
		dots: false,
		nextArrow: <NextArrow />,
		prevArrow: <PrevArrow />,
	};

	useEffect(() => {
		if (!isFetchQueue) return;

		const fetch = async () => {
			const result = await fetchQueue();
			if (result.success) {
				const queue: number[] = result.data;
				setQueue(queue);
				setIsFetchQueue(false);
			} else {
				setError(result.error);
			}
		};

		fetch();
	}, [isFetchQueue]);

	return (
		<div className="w-full max-w-4xl p-4 sm:p-6 mx-auto bg-stone-800 rounded-2xl flex flex-col justify-center">
			<h2 className="text-xl sm:text-xl text-white mb-2 self-start uppercase tracking-widest font-extrabold">
				Wallpapers
			</h2>
			<div className="w-full h-px bg-white opacity-30 mb-4 sm:mb-6" />
			<div className="w-full flex items-center justify-center mb-2 sm:mb-4">
				{error ? (
					<h2 className="text-red-500 text-lg">{error}</h2>
				) : (
					<Slider {...settings} className="w-full">
						{queue?.map((id, index) => (
							<div key={index} className="">
								<CarouselImage wallpaperId={id} index={index} />
							</div>
						))}
					</Slider>
				)}
			</div>
			<div className="flex gap-4">
				<ButtonWallpaperShuffle setIsFetchQueue={setIsFetchQueue} />
				<ButtonWallpaperNext setIsFetchQueue={setIsFetchQueue} />
				<ButtonWallpaperEdit />
			</div>
		</div>
	);
}
