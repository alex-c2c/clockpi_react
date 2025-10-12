"use client";

import {
	ButtonWallpaperShuffle,
	ButtonWallpaperNext,
	ButtonWallpaperEdit,
} from "./Buttons";
import CarouselImage from "./CarouselImage";

import Slider from "react-slick";
import { DeviceProps } from "../types/Device";
import { DeviceOrientation } from "../types/enums";

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

export default function CarouselDiv({
	deviceProps,
	setIsFetchDevice
}:{
	deviceProps: DeviceProps;
	setIsFetchDevice: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const settings = {
		className: "center",
		centerMode: true,
		infinite: true,
		centerPadding: deviceProps.orientation === DeviceOrientation.Horizontal ? "80px" : "0px",
		slidesToShow: deviceProps.orientation === DeviceOrientation.Horizontal ? 1 : 3,
		speed: 500,
		dots: false,
		nextArrow: <NextArrow />,
		prevArrow: <PrevArrow />,
	};

	return (
		<div className="w-full max-w-4xl p-4 sm:p-6 mx-auto bg-stone-800 rounded-2xl flex flex-col justify-center">
			<h2 className="text-xl sm:text-xl text-white mb-2 self-start uppercase tracking-widest font-extrabold">
				Wallpapers
			</h2>
			<div className="w-full h-px bg-white opacity-30 mb-4 sm:mb-6" />
			<div className="w-full flex items-center justify-center mb-2 sm:mb-4">
				<Slider {...settings} className="w-full">
					{deviceProps.queue?.map((id, index) => (
						<div key={index} className="">
							<CarouselImage
								index={index}
								deviceId={deviceProps.id}
								orientation={deviceProps.orientation}
								wallpaperId={id}
							/>
						</div>
					))}
				</Slider>
			</div>
			<div className="flex gap-4">
				<ButtonWallpaperShuffle deviceId={deviceProps.id} setIsFetchDevice={setIsFetchDevice} />
				<ButtonWallpaperNext deviceId={deviceProps.id} setIsFetchDevice={setIsFetchDevice} />
				<ButtonWallpaperEdit deviceId={deviceProps.id} />
			</div>
		</div>
	);
}
