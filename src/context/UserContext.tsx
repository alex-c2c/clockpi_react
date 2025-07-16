'use client'

import React, { createContext, useContext, useState } from 'react'


type User = {
	username: string | null
}

const UserContext = createContext<{
	user: User
	setUser: React.Dispatch<React.SetStateAction<User>>
}>({
	user: { username: null },
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
	const [user, setUser] = useState<User>(initialUser)

	return (
		<UserContext.Provider value={{ user, setUser }}>
			{children}
		</UserContext.Provider>
	)
}
