import { useChatContext } from "./useChatContext";

export const useMessages = () => {
  const context = useChatContext();
  return context.messages;
};
