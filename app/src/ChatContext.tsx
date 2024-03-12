import { PropsWithChildren, createContext, useRef, useState } from "react";

export type MessageReceivedCallback = (
  message: Message
) => void | Promise<void>;

interface Message {
  author: string;
  content: string;
  you?: boolean;
}

interface ChatContextData {
  messages: Message[];
  addMessage: (message: Message) => void;
  send: (message: string) => void;
  subscribe: (callback: MessageReceivedCallback) => void;
  unsubscribe: (callback: MessageReceivedCallback) => void;
}

export const ChatContext = createContext<ChatContextData>({
  messages: [],
  addMessage: () => {},
  send: () => {},
  subscribe: () => {},
  unsubscribe: () => {},
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
    notifySubscribers(message);
  };

  const send = (message: string) => {
    addMessage({ author: "You", content: message, you: true });
  };

  const subscribersRef = useRef<Array<MessageReceivedCallback>>([]);

  const subscribe = (callback: MessageReceivedCallback) => {
    subscribersRef.current.push(callback);
  };

  const unsubscribe = (callback: MessageReceivedCallback) => {
    subscribersRef.current = subscribersRef.current.filter(
      (cb) => cb !== callback
    );
  };

  const notifySubscribers = (message: Message) => {
    subscribersRef.current.forEach((subscriber) => {
      subscriber(message);
    });
  };

  return (
    <ChatContext.Provider
      value={{ messages, addMessage, send, subscribe, unsubscribe }}
    >
      {children}
    </ChatContext.Provider>
  );
};
