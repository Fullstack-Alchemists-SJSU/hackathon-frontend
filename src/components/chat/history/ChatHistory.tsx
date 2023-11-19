import {useState} from 'react'
import Chat from '../../../models/chat'
import './chathistory.css'
import ChatList from './ChatList'
import {usePub} from '../../../hooks/event'
import {createNewChat} from '../../../services/chatservice'
import {getEmail} from '../../../utils/localstorage'
interface ChatHistoryProps {
	onChatSelected: (chat: Chat) => void
	chats: Chat[]
}
const ChatHistory = (props: ChatHistoryProps) => {
	const publish = usePub()
	const [email, _] = useState(getEmail())

	const handleNewChat = async () => {
		try {
			const chatResponse = await createNewChat(email as string)
			publish('newChat', {...chatResponse.data, messages: []})
		} catch (e) {
			console.log(e)
		}
	}

	return (
		<div className='chat-history-container'>
			<button className='new-chat-button' onClick={handleNewChat}>
				New Chat
			</button>
			<ChatList
				chatList={props.chats}
				onChatClick={(chat) => props.onChatSelected(chat)}
			/>
		</div>
	)
}

export default ChatHistory
