import { useChatContext } from "./useChatContext";

export const useAddMessage = () => {
  const context = useChatContext();
  return context.addMessage;
};
