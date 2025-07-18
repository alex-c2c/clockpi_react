'use client'


import { useUser } from "@/context/UserContext";


export default function App() {
	const { user } = useUser();

	return (
		<>
			<h1>Home</h1>
			{user ? (
				<p>Welcome {user.display_name}</p>
			) : (
				<p>not logged in!</p>
			)
			}
		</>
	);
}
