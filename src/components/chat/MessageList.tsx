import Chat from "../../models/chat";

interface MessageListProps {
    chat: Chat | null
}
const MessageList = (props: MessageListProps) => {
    return (
        <div className="flex flex-col">
            {props.chat?.messages.map((message, index) =>
                (message.role == "user" || message.role == "assistant") && <div key={index} className="message-container">
                    <div className="message-role">
                        {message.role == "user" ? "You" : "Assistant"}
                    </div>
                    <div className="message-content">
                        {message.content}
                    </div>
                </div>
            )}
        </div>
    );
}
export default MessageList;
