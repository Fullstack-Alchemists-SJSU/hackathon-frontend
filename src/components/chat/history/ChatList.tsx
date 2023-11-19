import Chat from '../../../models/chat'
import Delete from '../delete.svg'

interface ChatListProps {
	chatList: Chat[]
	onChatClick: (chat: Chat) => void
}

const ChatList = (props: ChatListProps) => {
	return (
		<div className='chat-list'>
			{props.chatList.map((chat, index) => (
				<div
					key={index}
					className='chat-list-item'
					onClick={() => props.onChatClick(chat)}>
					<div>{chat.title}</div>
				</div>
			))}
		</div>
	)
}

export default ChatList
