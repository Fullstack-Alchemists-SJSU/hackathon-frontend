import Chat from '../models/chat'

export const getChats = () => {
	const chats = localStorage.getItem('chats')
	if (chats) {
		return JSON.parse(chats)
	}
	return []
}

export const addNewChat = (chat: Chat) => {
	const chats = getChats()
	chats.push(chat)
	localStorage.setItem('chats', JSON.stringify(chats))
}

export const setChats = (chats: Chat[]) => {
	localStorage.setItem('chats', JSON.stringify(chats))
}

export const setEmail = (email: string) => {
	localStorage.setItem('email', email)
}

export const getEmail = () => {
	return localStorage.getItem('email')
}
