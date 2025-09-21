"use client"

import React, { createContext, useContext, useState } from "react"
import { UserProp } from "@/types/User";

const UserContext = createContext<{
	user: UserProp | null
	setUser: React.Dispatch<React.SetStateAction<UserProp | null>>
}>({
	user: null,
	setUser: () => { },
})

export const useUser = () => useContext(UserContext)

export const UserProvider = ({
	children,
	initialUser,
}: {
	children: React.ReactNode
	initialUser: UserProp | null
}) => {
	const [user, setUser] = useState<UserProp | null>(initialUser)

	return (
		<UserContext value={{ user, setUser }}>
			{children}
		</UserContext>
	)
}
