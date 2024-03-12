import { useChatContext } from "./useChatContext";

export const useWaiting = () => {
  const context = useChatContext();
  return context.waiting;
};
