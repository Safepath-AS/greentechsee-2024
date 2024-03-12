import { PropsWithChildren, createContext, useRef, useState } from "react";
import { WhatAreYouSinkingAboutResponse } from "./WhatAreYouSinkingAbout";
import { useSendQuery } from "./api";

export type MessageReceivedCallback = (
  message: Message
) => void | Promise<void>;

export interface Message {
  author: string;
  content: string;
  you?: boolean;
  data?: WhatAreYouSinkingAboutResponse;
}

interface ChatContextData {
  messages: Message[];
  waiting: boolean;
  addMessage: (message: Message) => void;
  send: (message: string) => void;
  subscribe: (callback: MessageReceivedCallback) => void;
  unsubscribe: (callback: MessageReceivedCallback) => void;
}

export const ChatContext = createContext<ChatContextData>({
  messages: [],
  waiting: false,
  addMessage: () => {},
  send: () => {},
  subscribe: () => {},
  unsubscribe: () => {},
});

export const ChatProvider = ({ children }: PropsWithChildren) => {
  const sendQuery = useSendQuery();

  const [waiting, setWaiting] = useState(false);
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

  const send = async (message: string) => {
    addMessage({ author: "You", content: message, you: true });

    setWaiting(true);
    try {
      const result = await sendQuery(message, messages);
      if (result) {
        addMessage(result as Message);
      } else {
        addMessage({ author: "AI", content: "Failed, please try again." });
      }
    } catch (error) {
      addMessage({ author: "AI", content: "Failed, please try again." });
      console.error(error);
    }

    setWaiting(false);
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
      value={{ messages, waiting, addMessage, send, subscribe, unsubscribe }}
    >
      {children}
    </ChatContext.Provider>
  );
};
