import {ChangeEvent, useState, useEffect} from 'react'
import Chat from '../../models/chat'
import MessageList from './MessageList'
import './chat.css'
import {usePub} from '../../hooks/event'
import Spinner from './spinner.svg'
import socket from '../../services/socket'

interface MessageContainerProps {
	selectedChat: Chat | null
}

const MessageContainer = ({selectedChat}: MessageContainerProps) => {
	const publish = usePub()
	const [message, setMessage] = useState('')
	const [connected, setConnected] = useState(false)
	const [isResponseLoading, setIsResponseLoading] = useState(false)
	const [needScroll, setNeedScroll] = useState(false)
	const [persona, setPersona] = useState('')

	useEffect(() => {
		setPersona('')
		socket.on('connect', function () {
			console.log('Connected')
			setConnected(false)
		})

		socket.on('connect_error', function () {
			console.log('Connection Failed')
			setConnected(true)
			if (isResponseLoading) {
				setIsResponseLoading(false)
			}
		})
		socket.on('assistantReply', (message) => {
			publish('newMessage', {
				chat: selectedChat,
				message,
			})
			setIsResponseLoading(false)
			setNeedScroll(!needScroll)
		})

		return () => {
			socket.off('assistantReply')
			socket.off('connect_failed')
		}
	}, [])

	useEffect(() => {
		if (selectedChat) {
			if (!socket.connected) {
				socket.connect()
				setConnected(true)
			}
			if (!selectedChat.messages || selectedChat.messages.length === 0) {
				handleSendMessage('Hi')
			}
		} else {
			if (socket.connected) {
				socket.disconnect()
			}
			setConnected(false)
		}
	}, [selectedChat])

	const handleSendMessage = (message: string) => {
		if (selectedChat) {
			setIsResponseLoading(true)

			socket.emit('newMessage', {
				message,
				chatId: selectedChat.id,
				threadId: selectedChat.threadId,
			})
		}
	}

	const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
		setMessage(e.target.value)
	}

	const sendMessage = () => {
		setIsResponseLoading(true)
		setMessage('')
		if (selectedChat) {
			publish('newMessage', {
				chat: selectedChat,
				message: {
					role: 'user',
					chat: selectedChat.id,
					content: message,
					timestamp: new Date().getTime().toString(),
				},
			})
			setNeedScroll(!needScroll)
			handleSendMessage(message)
		}
	}

	const handlePersonaChange = (e: ChangeEvent<HTMLSelectElement>) => {
		const persona = e.target.value
		setPersona(persona)
		if (persona !== '' && selectedChat) {
			const personaMessage = `Change my persona to ${
				persona === 'researcher'
					? 'Economic Researcher'
					: 'Government Official'
			}`
			publish('newMessage', {
				chat: selectedChat,
				message: {
					role: 'user',
					chat: selectedChat.id,
					content: personaMessage,
					timestamp: new Date().getTime().toString(),
				},
			})
			handleSendMessage(`Change my persona to ${personaMessage}`)
		}
	}

	return (
		<div className='chat-container'>
			{!selectedChat ? (
				<div className='flex flex-1 justify-center items-center'>
					Select a previous chat or click the "New Chat" button to
					start a new chat
				</div>
			) : (
				<>
					<div className='flex flex-row flex-1 justify-end items-center'>
						{connected && (
							<div className='flex-1 bg-gray-500 text-white font-semibold p-2 rounded-md shadow-md items-center max-h-[48px]'>
								⚠️ You are offline. Your messages are safe and
								will be sent once the connection is restored.
								But, the response from the assistant requires
								active internet connection.
							</div>
						)}
						<select
							className='border-2 rounded-md px-4 py-2 mx-2 border-blue-700'
							defaultValue=''
							onChange={handlePersonaChange}>
							<option value=''>Select Your Persona</option>
							<option value='researcher'>
								Economic Researcher
							</option>
							<option value='official'>
								Government Official
							</option>
						</select>
					</div>
					<div className='message-list-container'>
						<MessageList
							chat={selectedChat}
							needScroll={needScroll}
						/>
					</div>
					<div className='flex flex-row'>
						<input
							disabled={isResponseLoading}
							className='message-input'
							type='text'
							placeholder='Type a message'
							onChange={handleMessageChange}
							value={message}
						/>
						<button
							disabled={!message || isResponseLoading}
							className='send-button'
							onClick={sendMessage}>
							{isResponseLoading ? (
								<div className='animate-spin p-2'>
									<img src={Spinner} />
								</div>
							) : (
								'Send'
							)}
						</button>
					</div>
				</>
			)}
		</div>
	)
}

export default MessageContainer
