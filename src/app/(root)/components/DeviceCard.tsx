"use client";

import { useEffect, useRef, useState } from "react";

import { DeviceProps } from "@/app/device/[id]/types/Device";

export default function DeviceCard({
	deviceProps,
	onEdit,
	onDelete
}: {
	deviceProps: DeviceProps,
	onEdit: (id: number) => void,
	onDelete: (id: number) => void
}) {
	const [isMenuOpen, setMenuOpen] = useState<boolean>(false);
	const menuRef = useRef<HTMLDivElement>(null);
	
	// Close menu on outside click
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				menuRef.current &&
				!menuRef.current.contains(event.target as Node)
			) {
				setMenuOpen(false);
			}
		}

		if (isMenuOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isMenuOpen]);
	
	// Close menu on ESC press
	useEffect(() => {
		const handleEscKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setMenuOpen(false);
			}
		};

		window.addEventListener("keydown", handleEscKeyDown);

		return () => {
			window.removeEventListener("keydown", handleEscKeyDown);
		};
	}, [setMenuOpen]);

	return (
		<div className="relative" ref={menuRef}>
			<div className="flex items-center rounded-xl px-4 py-3 my-2 bg-stone-800 hover:bg-stone-600 transition">
				{/* Device name */}
				<div className="text-xl text-white font-semibold truncate">
					{deviceProps.name}
				</div>

				{/* Menu trigger */}
				<button
					type="button"
					className="ml-auto p-2 rounded-full hover:bg-stone-700 transition"
					onClick={(e) => {
						e.stopPropagation();
						setMenuOpen((prev) => !prev)
					}}
				>
					{/* Replace with your SVG icon */}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5 text-white"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M6 12h.01M12 12h.01M18 12h.01"
						/>
					</svg>
				</button>
			</div>

			{/* Dropdown menu */}
			{isMenuOpen && (
				<div className="absolute right-0 w-25 p-1 bg-stone-600 rounded-lg shadow-lg overflow-hidden z-10">
					<button 
						onClick={(e) => {
							e.stopPropagation();
							onEdit(deviceProps.id);
							setMenuOpen(false);
						}}
						className="block w-full px-4 py-2 text-left text-lg rounded-lg text-white hover:bg-stone-700"
					>
						Edit
					</button>
					<button
						onClick={(e) => {
							e.stopPropagation();
							onDelete(deviceProps.id);
							setMenuOpen(false);
						}}
						className="block w-full px-4 py-2 text-left text-lg rounded-lg text-red-500 hover:bg-stone-700">
						Delete
					</button>
				</div>
			)}
		</div>
	);
}
