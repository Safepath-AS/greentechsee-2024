import { useChatContext } from "./useChatContext";

export const useSendMessage = () => {
  const context = useChatContext();
  return context.send;
};
