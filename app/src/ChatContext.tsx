import { PropsWithChildren, createContext, useRef, useState } from "react";
import { WhatAreYouSinkingAboutResponse } from "./WhatAreYouSinkingAbout";
import { getClosestHospital, getUserLocation, useSendQuery } from "./api";
import { ClosestHospitalResponse } from "./ClosestHospital";

export type MessageReceivedCallback = (
  message: Message
) => void | Promise<void>;

export interface Message {
  type: "message";
  author: string;
  content: string;
  you?: boolean;
  data?: WhatAreYouSinkingAboutResponse | ClosestHospitalResponse;
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
      type: "message",
      author: "AI",
      content: "Hi there!",
    },
  ]);

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
    notifySubscribers(message);
  };

  const send = async (message: string) => {
    addMessage({ type: "message", author: "You", content: message, you: true });

    setWaiting(true);
    try {
      const result = await sendQuery(message, messages);
      if (result) {
        if (result.type === "message") {
          addMessage(result as Message);
        } else if (result.type === "function") {
          // '{"latitude":62.737235,"longitude":7.160731}'
          const args = JSON.parse(result.arguments.replace(/'/g, '"'));

          if (result.function === "get_closest_hospital") {
            // Empty arguments
            let position: {
              latitude: number;
              longitude: number;
            };
            if (Object.keys(args).length === 0) {
              const geo = await getUserLocation();
              position = {
                latitude: geo.coords.latitude,
                longitude: geo.coords.longitude,
              };
            } else {
              position = {
                latitude: args.latitude as number,
                longitude: args.longitude as number,
              };
            }

            const hospital = await getClosestHospital(
              position.latitude,
              position.longitude
            );
            console.log(hospital);
            addMessage({
              type: "message",
              author: "AI",
              content: `The closest hospital is ${hospital.name} in ${hospital.commune}.`,
              data: {
                type: "hospital",
                hospital: hospital,
              },
            });
          }
        }
      } else {
        addMessage({
          type: "message",
          author: "AI",
          content: "Failed, please try again.",
        });
      }
    } catch (error) {
      addMessage({
        type: "message",
        author: "AI",
        content: "Failed, please try again.",
      });
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
