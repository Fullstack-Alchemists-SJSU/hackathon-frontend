import { ChangeEvent, useState } from "react";
import Chat from "../../models/chat";
import MessageList from "./MessageList";
import "./chat.css"
import { usePub } from "../../hooks/event";
import Message from "../../models/message";
import { newChatCompletion } from "../../services/chatservice";
import Spinner from "./spinner.svg"
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat";
interface MessageContainerProps {
    selectedChat: Chat | null;
}
const MessageContainer = (props: MessageContainerProps) => {
    const publish = usePub();
    const [message, setMessage] = useState("");
    const [isResponseLoading, setIsResponseLoading] = useState(false);

    const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    }

    const sendMessage = () => {
        setIsResponseLoading(true);
        const newMessage: Message = {
            timestamp: new Date().getTime().toString(),
            content: message,
            role: "user",
        };
        publish("newMessage", {chat: props.selectedChat, message: newMessage})
        setMessage("");
        if(props.selectedChat){
            newChatCompletion(props.selectedChat?.messages).then(response => {
                publish("newMessage", {chat: props.selectedChat, message: {...response.data.choices[0].message, timestamp: new Date().getTime().toString()}})
                setIsResponseLoading(false);
            }).catch(error => {
                console.log(error);
                publish("newMessage", {chat: props.selectedChat, message: {role: "assistant", content: "Something went wrong", timestamp: new Date().getTime().toString()}})
                setIsResponseLoading(false);
            });
        }
    }


    return (
        <div className="chat-container">
            {!props.selectedChat
                ? <div className="flex flex-1 justify-center items-center">Select a previous chat or click the "New Chat" button to start a new chat</div>
                : <>
                    < div className="message-list-container">
                        <MessageList chat={props.selectedChat}/>
                    </div>
                    <div className="flex flex-row">
                        <input disabled={isResponseLoading} className="message-input" type="text" placeholder="Type a message" onChange={handleMessageChange} value={message}/>
                        <button disabled={!message || isResponseLoading} className="send-button" onClick={sendMessage}>
                            {isResponseLoading
                                ? <div className="animate-spin p-2"><img src={Spinner}/></div>
                                : "Send"
                            }
                        </button>
                    </div>
                </>
            }
        </div>
    );
}

export default MessageContainer;