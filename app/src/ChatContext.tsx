import { PropsWithChildren, createContext, useState } from "react";

interface Message {
  author: string;
  content: string;
  you?: boolean;
}

interface ChatContextData {
  messages: Message[];
  addMessage: (message: Message) => void;
  send: (message: string) => void;
}

export const ChatContext = createContext<ChatContextData>({
  messages: [],
  addMessage: () => {},
  send: () => {},
});

export const ChatProvider = ({ children }: PropsWithChildren) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      author: "AI",
      content: "Hi there!",
    },
  ]);

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const send = (message: string) => {
    addMessage({ author: "You", content: message, you: true });
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage, send }}>
      {children}
    </ChatContext.Provider>
  );
};
