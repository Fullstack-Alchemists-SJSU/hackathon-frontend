import { useEffect, useState } from 'react';
import MessageContainer from './components/chat/MessageContainer';
import ChatHistory from './components/chat/history/ChatHistory';
import Layout from './components/layout/Layout';
import Nav from './components/nav/Nav';
import Chat from './models/chat';
import { useSub } from './hooks/event';
import { addNewChat, getChats } from './utils/localstorage';

function App() {
  const [chats, setChats] = useState<Chat[]>(getChats());
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  const handleChatSelected = (chat: Chat) => {
    setSelectedChat(chat);
  }

  useSub("newChat", (data) => {
    setChats([...chats, data]);
    addNewChat(data);
    setSelectedChat(data);
  });

  useEffect(() => {
    console.log("selected: " + JSON.stringify(selectedChat));
  }, [selectedChat])

  useSub("newMessage", (data) => {
    setChats((prevChats) => {
      const chats = [...prevChats]
      chats.forEach((chat) => {
        if (chat.timestamp === data.chat.timestamp && chat.messages.find(message => message.timestamp === data.message.timestamp) === undefined) {
          chat.messages.push(data.message);
        }
      });
      localStorage.setItem("chats", JSON.stringify(chats));
      return chats;
    });
  });

  useSub("deleteChat", (data) => {
    setSelectedChat(null);
    setChats((prevChats) => {
      console.log("equal: " + selectedChat?.timestamp + " " + data.timestamp)
      const chats = prevChats.filter((chat) => chat.timestamp !== data.timestamp)
      localStorage.setItem("chats", JSON.stringify(chats));
      return chats;
    });

  })

  return (
    <div className='flex flex-col min-h-[100vh]'>
      <Nav />
      <Layout>
        <ChatHistory chats={chats} onChatSelected={handleChatSelected}/>
        <MessageContainer selectedChat={selectedChat}/>
      </Layout>
    </div>
  );
}

export default App;
