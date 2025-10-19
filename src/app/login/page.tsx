"use client"

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { UserProp } from "@/types/User";
import { Result, safeAsync } from "@/lib/result";

function fetchLogin(username: string, password: string): Promise<Result<UserProp>> {
	return safeAsync(async () => {
		const res = await fetch("/flask/auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ username, password })
		});
		
		if (!res.ok) {
			const data = await res.json();
			throw new Error(`${data.message}`);
		}
		
		return res.json();
	}, "fetchLogin");
}

export default function LoginPage() {
	const searchParams = useSearchParams()
	const redirectPath = searchParams?.get("redirect") || "/"
	const router = useRouter();
	const { setUser } = useUser();
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [error, setError] = useState<string>("");

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError("");
		
		const result = await fetchLogin(username, password);
		
		if (result.success) {
			const user: UserProp = result.data;
			setUser(user);
			router.push(redirectPath);
		}
		else {
			setUser(null);
			setError(result.error);
		}
	};

	return (
		<div className="h-screen flex items-center justify-center bg-stone-900">
			<div className="w-full max-w-md bg-stone-800 p-8 rounded-2xl shadow">
				<h1 className="text-2xl font-extrabold mb-6 text-center text-white">Login</h1>
				<form onSubmit={handleSubmit} className="space-y-4">
					{error && <p className="text-red-500 text-sm">{error}</p>}

					<div>
						<label htmlFor="username" className="block text-sm font-semibold text-white">
							Username
						</label>
						<input
							id="username"
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
							className="mt-1 block w-full px-3 py-2 border border-gray-400 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					<div>
						<label htmlFor="password" className="block text-sm font-semibold text-white">
							Password
						</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="mt-1 block w-full px-3 py-2 border border-gray-400 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					<button type="submit" className="font-bold w-full bg-stone-600 text-white py-2 px-4 rounded-md hover:bg-stone-700 transition">
						Login
					</button>
				</form>
			</div>
		</div>
	);
}
