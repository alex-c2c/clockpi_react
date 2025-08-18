"use client"

import { ButtonWallpaperShuffle, ButtonWallpaperNext, ButtonWallpaperEdit } from "@/app/(root)/components/Buttons";
import { useEffect, useState } from "react";
import { fetchQueue } from "../lib/api";
import Slider from "react-slick";
import CarouselImage from "./CarouselImage";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function NextArrow(props: any) {
  const { className, onClick } = props;
  return (
    <div
      className={`${className} mr-10 scale-300 z-10`}
      onClick={onClick}
    />
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PrevArrow(props: any) {
  const { className, onClick } = props;
  return (
    <div
      className={`${className} ml-10 scale-300 z-10`}
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
		centerPadding: "50px",
		slidesToShow: 1,
		speed: 500,
		dots: true,
		nextArrow: <NextArrow />,
		prevArrow: <PrevArrow />,
		customPaging: (i: number) => (
			<div className="text-white hover:text-neutral-400">
				{i + 1}
			</div>
		)
	};

	useEffect(() => {
		if (isFetchQueue) {
			fetchQueue(setQueue, setError);
			setIsFetchQueue(false);
		}
	}, [isFetchQueue]);

	useEffect(() => {

	}, [queue]);

	return (
		<div className="w-[800px] bg-stone-800 rounded-2xl p-6 flex flex-col justify-center">
			<h2 className="text-xl text-white mb-2 self-start uppercase tracking-widest font-extrabold">
				Wallpapers
			</h2>
			<div className="w-full h-px bg-white opacity-30 mb-6" />
			<div className="w-full flex items-center justify-center mb-6">
				{error ? (
					<h2 className="text-red-500 text-lg">
						{error}
					</h2>					
				) : (
				<Slider {...settings} className="w-full">
					{queue?.map((id, index) => (
						<div key={index} className="">
							<CarouselImage wallpaperId={id} index={index}/>
						</div>
					))}
				</Slider>
					
				)}
			</div>
			<div className="flex gap-8 pt-4">
				<ButtonWallpaperShuffle setIsFetchQueue={setIsFetchQueue} />
				<ButtonWallpaperNext setIsFetchQueue={setIsFetchQueue} />
				<ButtonWallpaperEdit />
			</div>
		</div>
	);
}
