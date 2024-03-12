import { useContext } from "react";
import { ChatContext } from "./ChatContext";

export const useMessages = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useMessages must be used within a ChatProvider");
  }

  return context.messages;
};
