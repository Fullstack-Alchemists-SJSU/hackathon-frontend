import Markdown from 'react-markdown'
import Chat from '../../models/chat'
import {useRef, useEffect} from 'react'
import {useReactToPrint} from 'react-to-print'

interface MessageListProps {
	chat: Chat | null
	needScroll: boolean
}
const MessageList = (props: MessageListProps) => {
	const messageListRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		scrollToBottom()
	}, [])

	useEffect(() => {
		scrollToBottom()
	}, [props])

	const scrollToBottom = () => {
		messageListRef.current?.lastElementChild?.scrollIntoView({
			behavior: 'smooth',
			block: 'end',
		})
	}

	const handlePrint = useReactToPrint({
		content: () => messageListRef.current,
	})

	return (
		<div>
			<button
				className='bg-blue-700 font-semibold text-white m-2 px-4 rounded-md absolute right-14 top-18 py-2'
				onClick={handlePrint}>
				Print
			</button>
			<div className='flex flex-col' ref={messageListRef}>
				{props.chat?.messages &&
					props.chat?.messages.map(
						(message, index) =>
							(message.role == 'user' ||
								message.role == 'assistant') && (
								<div key={index} className='message-container'>
									<div className='message-role'>
										{message.role == 'user'
											? 'You'
											: 'Assistant'}
									</div>
									<Markdown className='message-content'>
										{message.content}
									</Markdown>
								</div>
							)
					)}
			</div>
		</div>
	)
}
export default MessageList
