import {useEffect, useState} from 'react'
import MessageContainer from './components/chat/MessageContainer'
import ChatHistory from './components/chat/history/ChatHistory'
import Layout from './components/layout/Layout'
import Nav from './components/nav/Nav'
import Chat from './models/chat'
import {useSub} from './hooks/event'
import {
	addNewChat,
	getChats,
	getEmail,
	setChats as saveChats,
	setEmail as saveEmail,
} from './utils/localstorage'
import Email from './components/email/Email'
import {getChatByEmail} from './services/chatservice'

function App() {
	const [email, setEmail] = useState(getEmail())
	const [chats, setChatsState] = useState<Chat[]>(getChats())
	const [selectedChat, setSelectedChat] = useState<Chat | null>(null)

	useEffect(() => {
		if (!chats || chats.length === 0) {
			if (email) {
				getChatByEmail(email)
					.then((response) => {
						setChatsState(response.data)
						saveChats(response.data)
					})
					.catch((error) => {
						console.log(error)
					})
			}
		}
	}, [])

	const handleChatSelected = (chat: Chat) => {
		console.log('selected chat', chat)
		setSelectedChat(chat)
	}

	useSub('newChat', (data) => {
		debugger
		setChatsState((prevChats) => [...prevChats, data])
		addNewChat(data)
		setSelectedChat(data)
	})

	useSub('newMessage', (data) => {
		setChatsState((prevChats) => {
			const chats = [...prevChats]
			chats.forEach((chat) => {
				if (data.message.chat === chat.id) {
					if (
						chat.messages &&
						chat.messages.find(
							(message) =>
								message.timestamp === data.message.timestamp
						) === undefined
					) {
						chat.messages?.push(data.message)
					} else {
						chat = {...chat, messages: [data.message]}
					}
				}
			})
			saveChats(chats)
			return chats
		})
	})

	useSub('deleteChat', (data) => {
		setSelectedChat(null)
		setChatsState((prevChats) => {
			const chats = prevChats.filter(
				(chat) => chat.timestamp !== data.timestamp
			)
			saveChats(chats)
			return chats
		})
	})

	const handleSubmitEmail = (email: string) => {
		setEmail(email)
		saveEmail(email)
	}

	return (
		<div className='flex flex-col min-h-[100vh]'>
			<Nav />
			{email ? (
				<Layout>
					<ChatHistory
						chats={chats}
						onChatSelected={handleChatSelected}
					/>
					<MessageContainer selectedChat={selectedChat} />
				</Layout>
			) : (
				<Email handleEmailSubmit={handleSubmitEmail} />
			)}
		</div>
	)
}

export default App
