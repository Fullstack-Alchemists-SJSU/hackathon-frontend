import axios from 'axios'
export const createNewChat = (email: string) => {
	return axios.post('http://localhost:3000/api/chat/', {email})
}

export const getChatByEmail = (email: string) => {
	return axios.get(`http://localhost:3000/api/chat/${email}`)
}

export const getMessagesByChatId = (chatId: number) => {
	return axios.get(`http://localhost:3000/api/chat/${chatId}/messages`)
}
