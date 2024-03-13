import { useEffect } from "react";
import { MessageDataType, MessageReceivedCallback } from "./ChatContext";
import { useChatContext } from "./useChatContext";

export const useOnMessage = (
  callback: MessageReceivedCallback,
  type?: MessageDataType
) => {
  const context = useChatContext();

  useEffect(() => {
    context.subscribe(callback, type);
    return () => {
      context.unsubscribe(callback);
    };
  }, [callback, context, type]);
};
