import { useState } from "react";
import Chat from "../../../models/chat";
import "./chathistory.css";
import ChatList from "./ChatList";
import { usePub, useSub } from "../../../hooks/event";
interface ChatHistoryProps {
    onChatSelected: (chat: Chat) => void;
    chats: Chat[];
}
const ChatHistory = (props: ChatHistoryProps) => {
    const publish = usePub();
    
    const handleNewChat = () => {
        const chat: Chat = {
            timestamp: new Date().getTime().toString(),
            name: "New Chat",
            messages: [
                {
                    timestamp: new Date().getTime().toString(),
                    role: "system",
                    content: "Assume you are an expert in Finance and Economics, an expert accountant with 25+ years of experience. Assume you are currently a tax auditor for the Deloitte bank. You will now assist other accountant staff at Deloitte. Do not answer any queries which are not tax related"
                }
            ],
        };
        publish("newChat", chat);
        
    }

    const handleDelete = (chat: Chat) => {
        publish("deleteChat", chat);
    }

    return (
        <div className="chat-history-container">
            <button className="new-chat-button" onClick={handleNewChat}>New Chat</button>
            <ChatList chatList={props.chats} onChatClick={(chat) => props.onChatSelected(chat)} onDeleteClick={handleDelete}/>
        </div>
    );
}

export default ChatHistory;