'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useUser } from "@/context/UserContext";

export default function Navbar() {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const { user, setUser } = useUser();

	const handleLogout = async () => {
		// Implement your logout logic here (e.g., clear cookies, call API, redirect)
		try {
			const res = await fetch("/api/auth/logout", {
				method: "POST",
				credentials: "include",
			});

			if (res.ok) {
				setUser({ username: null })
				router.push("/");
			}
		}
		catch (err) {
			console.error("Login error:", err);
		}
	};

	return (
		<nav className="bg-white shadow-md">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16 items-center">
					{/* Logo */}
					<div className="flex-shrink-0 text-xl font-bold text-blue-600">
						<Link href="/">Clock Pi</Link>
					</div>

					{/* Mobile menu toggle */}
					<div className="md:hidden">
						<button
							onClick={() => setIsOpen(!isOpen)}
							className="text-gray-700 focus:outline-none"
							aria-label="Toggle menu"
						>
							<svg
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								{isOpen ? (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								) : (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 6h16M4 12h16M4 18h16"
									/>
								)}
							</svg>
						</button>
					</div>

					{/* Desktop logout button */}
					<div className="hidden md:flex">
						{user ? (
							<>
								<span className="text-black">Hello, {user.username}!</span>
								<button
									onClick={handleLogout}
									className="text-gray-700 hover:text-red-600 transition"
								>
									Logout
								</button>
							</>
						) : (
							<Link className="text-gray-700 hover:text-red-600 transition" href="/login">
								Login
							</Link>
						)}
					</div>
				</div>

				{/* Mobile menu (with logout) */}
				{isOpen && (
					<div className="md:hidden px-4 pb-4">
						{user ? (
							<button
								onClick={handleLogout}
								className="block py-2 text-gray-700 hover:text-red-600 w-full text-left"
							>
								Logout
							</button>
						) : (
							<Link className="block py-2 text-gray-700 hover:text-red-600 w-full text-left" href="/login">
								Login
							</Link>
						)}

					</div>
				)}
			</div>
		</nav>
	);
}
