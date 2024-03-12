import { useQuery } from "@tanstack/react-query";
import { serverConfig } from "./serverConfig";

const fetchApi = async (endpoint: string) =>
  fetch(`${serverConfig.apiUrl}${endpoint}`);

const get = async (endpoint: string) => {
  const response = await fetchApi(endpoint);
  const data = await response.json();
  return data;
};

export const useSendQuery = () => {
  return (text: string) => {
    return get(`/?query=${text}`);
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
