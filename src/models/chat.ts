import Message from './message'

type Chat = {
	id: number
	timestamp: string
	title: string
	threadId: string
	messages: Message[]
}

export default Chat
