'use client'

import React, { createContext, useContext, useState } from 'react'


type User = {
	username: string,
	display_name: string
}

const UserContext = createContext<{
	user: User | null
	setUser: React.Dispatch<React.SetStateAction<User|null>>
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
	initialUser: User
}) => {
	const [user, setUser] = useState<User|null>(initialUser)

	return (
		<UserContext value={{ user, setUser }}>
			{children}
		</UserContext>
	)
}
