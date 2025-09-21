"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@/context/UserContext";
import { Result, safeAsync } from "@/lib/result";

function fetchLogout(): Promise<Result<void>> {
	return safeAsync(async () => {
		const res = await fetch("/api/auth/logout", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
		});

		if (!res.ok) {
			const data = await res.json();
			throw new Error(`${data.message}`);
		}
	}, "fetchLogout");
}

export default function NavbarName() {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const { user, setUser } = useUser();
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Close dropdown on outside click
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleLogout = async () => {
		setLoading(true);

		const result = await fetchLogout();
		if (result.success) {
			setUser(null);
			setIsOpen(false);
			router.push("/");
		}

		setLoading(false);
	};

	const handleLogin = async () => {
		router.push("/login");
	};

	if (user != null) {
		return (
			<div ref={dropdownRef} className="relative">
				<button
					onClick={() => setIsOpen((prev) => !prev)}
					className="flex items-center gap-2 text-lg hover:text-neutral-400"
				>
					Hello, {user?.dispName}
					<span
						className={`transition-transform ${
							isOpen ? "" : "rotate-90"
						}`}
					>
						▼
					</span>
				</button>

				<div
					className={`absolute right-0 mt-2 p-1 w-full bg-stone-600 text-white rounded-xl shadow-lg z-10 transform transition-all duration-200 origin-top ${
						isOpen
							? "scale-100 opacity-100"
							: "scale-95 opacity-0 pointer-events-none"
					}`}
				>
					<button
						onClick={(e) => {
							e.stopPropagation();
							handleLogout();
						}}
						disabled={loading}
						className={`w-full text-left px-4 py-1 text-lg rounded-xl ${
							loading
								? "text-white cursor-not-allowed"
								: "hover:bg-stone-700"
						}`}
					>
						Logout
					</button>
				</div>
			</div>
		);
	} else {
		return (
			<button
				onClick={handleLogin}
				className="flex items-center gap-2 text-lg hover:text-neutral-400"
			>
				Login
			</button>
		);
	}
}
