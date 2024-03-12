import { useEffect } from "react";
import { MessageReceivedCallback } from "./ChatContext";
import { useChatContext } from "./useChatContext";

export const useOnMessage = (callback: MessageReceivedCallback) => {
  const context = useChatContext();

  useEffect(() => {
    context.subscribe(callback);
    return () => {
      context.unsubscribe(callback);
    };
  }, [callback, context]);
};
