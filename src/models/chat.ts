import Message from "./message";

type Chat = {
    timestamp: string;
    name: string;
    messages: Message[];
}

export default Chat;