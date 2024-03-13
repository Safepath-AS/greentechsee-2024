import { PropsWithChildren, createContext, useRef, useState } from "react";
import { WhatAreYouSinkingAboutResponse } from "./WhatAreYouSinkingAbout";
import {
  getClosestAirport,
  getClosestEmergencyPort,
  getClosestHospital,
  getClosestSarBase,
  getUserLocation,
  useSendQuery,
} from "./api";
import { ClosestHospitalResponse } from "./HospitalMarkers";
import { ClosestAirportResponse } from "./AirportMarkers";
import { ClosestSarBaseResponse } from "./SarBaseMarkers";
import { UserLocationResponse } from "./UserLocationMarker";
import { ClosestEmergencyPortResponse } from "./EmergencyPortMarkers";
import { ClosestEmergencyDepotResponse } from "./EmergencyDepotMarkers";
import { useTranslation } from "react-i18next";

export type MessageReceivedCallback = (
  message: Message
) => void | Promise<void>;

export type MessageData =
  | UserLocationResponse
  | WhatAreYouSinkingAboutResponse
  | ClosestHospitalResponse
  | ClosestAirportResponse
  | ClosestSarBaseResponse
  | ClosestEmergencyPortResponse
  | ClosestEmergencyDepotResponse;
export type MessageDataType = MessageData["type"];

export type MessageContent =
  | string
  | { t: string; values: { [key: string]: string } };

export interface Message {
  type: "message";
  author: string;
  content: MessageContent;
  you?: boolean;
  data?: MessageData;
}

interface ChatContextData {
  messages: Message[];
  waiting: boolean;
  addMessage: (message: Message) => void;
  send: (message: string) => void;
  subscribe: (
    callback: MessageReceivedCallback,
    type?: MessageDataType
  ) => void;
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
  const { t, i18n } = useTranslation();
  const sendQuery = useSendQuery();

  const [waiting, setWaiting] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      type: "message",
      author: "AI",
      content: { t: "init", values: {} },
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
      const result = await sendQuery(
        message,
        messages.map(({ content, ...rest }) => ({
          content:
            typeof content === "string"
              ? content
              : t(content.t, content.values),
          ...rest,
        }))
      );
      if (result) {
        if (result.type === "message") {
          addMessage(result as Message);
        } else if (result.type === "function") {
          // '{"latitude":62.737235,"longitude":7.160731}'
          const args = JSON.parse(result.arguments.replace(/'/g, '"'));

          if (result.function === "change_language") {
            if (!["en", "no"].includes(args.language)) {
              addMessage({
                type: "message",
                author: "AI",
                content: { t: "language_not_supported", values: {} },
              });
            } else {
              i18n.changeLanguage(args.language);
              addMessage({
                type: "message",
                author: "AI",
                content: { t: "language_changed", values: {} },
              });
            }
          } else if (result.function === "get_user_location") {
            const position = await getPosition();
            addMessage({
              type: "message",
              author: "AI",
              content: { t: "current_location_response", values: {} },
              data: {
                type: "userLocation",
                location: {
                  latitude: position.latitude,
                  longitude: position.longitude,
                },
              },
            });
          } else if (result.function === "get_closest_hospital") {
            const position = await getPosition(args);
            console.log(args);
            const needsHelipad = !!args.needs_helipad;

            const hospital = await getClosestHospital(
              position.latitude,
              position.longitude,
              needsHelipad
            );
            addMessage({
              type: "message",
              author: "AI",
              content: {
                t: "closest_hospital_response",
                values: {
                  name: hospital.name.trim(),
                  commune: hospital.commune.trim(),
                },
              },
              data: {
                type: "hospital",
                hospital: hospital,
              },
            });
          } else if (result.function === "get_closest_airport") {
            const position = await getPosition(args);

            const airport = await getClosestAirport(
              position.latitude,
              position.longitude
            );
            addMessage({
              type: "message",
              author: "AI",
              content: {
                t: "closest_airport_response",
                values: {
                  name: airport.name.trim(),
                  commune: airport.commune.trim(),
                },
              },
              data: {
                type: "airport",
                airport: airport,
              },
            });
          } else if (result.function === "get_closest_sar_base") {
            const position = await getPosition(args);

            const sarBase = await getClosestSarBase(
              position.latitude,
              position.longitude
            );
            addMessage({
              type: "message",
              author: "AI",
              content: {
                t: "closest_sar_base_response",
                values: {
                  name: sarBase.name.trim(),
                  commune: sarBase.commune.trim(),
                },
              },
              data: {
                type: "sarBase",
                sarBase: sarBase,
              },
            });
          } else if (result.function === "get_closest_emergency_port") {
            const position = await getPosition(args);

            const emergencyPort = await getClosestEmergencyPort(
              position.latitude,
              position.longitude
            );
            addMessage({
              type: "message",
              author: "AI",
              content: {
                t: "closest_emergency_port_response",
                values: {
                  name: emergencyPort.name.trim(),
                  commune: emergencyPort.commune.trim(),
                },
              },
              data: {
                type: "emergencyPort",
                emergencyPort: emergencyPort,
              },
            });
          } else if (result.function === "get_closest_emergency_depot") {
            const position = await getPosition(args);

            const emergencyDepot = await getClosestSarBase(
              position.latitude,
              position.longitude
            );
            addMessage({
              type: "message",
              author: "AI",
              content: {
                t: "closest_emergency_depot_response",
                values: {
                  name: emergencyDepot.name.trim(),
                  commune: emergencyDepot.commune.trim(),
                },
              },
              data: {
                type: "emergencyDepot",
                emergencyDepot: emergencyDepot,
              },
            });
          }
        }
      } else {
        addMessage({
          type: "message",
          author: "AI",
          content: { t: "error", values: {} },
        });
      }
    } catch (error) {
      addMessage({
        type: "message",
        author: "AI",
        content: { t: "error", values: {} },
      });
      console.error(error);
    }

    setWaiting(false);
  };

  const subscribersRef = useRef<
    Array<{ callback: MessageReceivedCallback; type?: MessageDataType }>
  >([]);

  const subscribe = (
    callback: MessageReceivedCallback,
    type?: MessageDataType
  ) => {
    subscribersRef.current.push({ callback, type });
  };

  const unsubscribe = (callback: MessageReceivedCallback) => {
    subscribersRef.current = subscribersRef.current.filter(
      ({ callback: cb }) => cb !== callback
    );
  };

  const notifySubscribers = (message: Message) => {
    subscribersRef.current.forEach(({ callback, type }) => {
      if (!type || type === message.data?.type) {
        callback(message);
      }
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

const getPosition = async (args?: {
  latitude?: number;
  longitude?: number;
}) => {
  // Empty arguments
  let position: {
    latitude: number;
    longitude: number;
  };
  if (!args || args.latitude === undefined || args.longitude === undefined) {
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
  return position;
};
