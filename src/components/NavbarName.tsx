"use client"

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@/context/UserContext";

export default function NavbarName() {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const { user, setUser } = useUser();
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Close dropdown on outside click
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleLogout = async () => {
		try {
			setLoading(true);

			const res = await fetch("/api/auth/logout", {
				method: "POST",
				credentials: "include",
			});

			if (res.ok) {
				setUser(null);
				router.push("/");
			}
			else {
				console.error("Logout failed");
			}
		}
		catch (err) {
			console.error("Login error:", err);
		}
		finally {
			setLoading(false);
		}
	};

	const handleLogin = async () => {
		router.push("/login");
	}

	if (user != null) {
		return (
			<div ref={dropdownRef} className="relative">
				<button onClick={() => setIsOpen((prev) => !prev)} className="flex items-center gap-2 text-sm font-medium hover:text-gray-300">
					{user?.display_name}
					<span className={`transition-transform ${isOpen ? "" : "rotate-90"}`}>▼</span>
				</button>

				<div className={`absolute right-0 mt-2 w-40 bg-stone-600 text-white rounded-xl shadow-lg z-10 transform transition-all duration-200 origin-top ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}`}>
					<button onClick={handleLogout} disabled={loading} className={`w-full text-left px-4 py-2 text-sm rounded-xl ${loading ? "text-white cursor-not-allowed" : "hover:bg-stone-700"}`}>
						Logout
					</button>
				</div>
			</div>
		);
	}
	else {
		return (
			<button onClick={handleLogin} className="text-l font-medium hover:text-gray-300">
				Login
			</button>
		);
	}
}
