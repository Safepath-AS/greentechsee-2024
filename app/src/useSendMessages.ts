import { useContext } from "react";
import { ChatContext } from "./ChatContext";

export const useSendMessage = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useSendMessage must be used within a ChatProvider");
  }

  return context.send;
};
