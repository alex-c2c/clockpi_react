import { cookies } from "next/headers"
import { UserProp } from "@/types/User";

export default async function fetchSessionUser() {
	const session = (await cookies()).get("session")
	if (!session) return null

	const res = await fetch(process.env.FLASK_URL + "/session", {
		method: "GET",
		headers: {
			Cookie: `session=${session.value}`,
		},
		credentials: "include",
		cache: "no-store",
	})

	if (!res.ok) {
		return null
	}

	const data = await res.json();
	const user: UserProp = data;

	return user;
}
