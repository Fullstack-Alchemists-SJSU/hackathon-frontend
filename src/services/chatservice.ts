import axios from "axios";
import Message from "../models/message";

export const newChatCompletion = (messages: Message[]) => {
    return axios.post("https://api.openai.com/v1/chat/completions", {
        model: "gpt-3.5-turbo-16k-0613",
        messages: messages.map((message) => (
            {
                role:message.role,
                content: message.content
            }
        )),
    }, {
        headers:{
            "Authorization": `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        }
    })
}