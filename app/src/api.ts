import { useQuery } from "@tanstack/react-query";
import { serverConfig } from "./serverConfig";
import { Message } from "./ChatContext";

const get = async (endpoint: string) => {
  const response = await fetch(`${serverConfig.apiUrl}${endpoint}`);
  const data = await response.json();
  return data;
};

const post = async (endpoint: string, body: unknown) => {
  const response = await fetch(`${serverConfig.apiUrl}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return data;
};

export const useSendQuery = () => {
  return (text: string, history: Array<Message>) => {
    return post(`/?query=${text}`, history);
  };
};

export const useRandomNumber = () => {
  const result = useQuery({
    queryKey: ["randomNumber"],
    queryFn: async () => await get("/random"),
  });

  const randomNumber = result.data as number | undefined;

  return {
    randomNumber,
    ...result,
  };
};
