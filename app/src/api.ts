import { useQuery } from "@tanstack/react-query";
import { serverConfig } from "./serverConfig";
import { Message } from "./ChatContext";

export interface ApiFunction {
  type: "function";
  function: string;
  arguments: string;
}

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
  return async (text: string, history: Array<Message>) => {
    const data = await post(`/?query=${text}`, history);
    return data as Message | ApiFunction | undefined;
  };
};

export interface Hospital {
  latitude: number;
  longitude: number;
  name: string;
  commune: string;
}

export const getClosestHospital = (latitude: number, longitude: number) => {
  return get(`/hospitals/closest?lat=${latitude}&lon=${longitude}`);
};

export interface Airport {
  latitude: number;
  longitude: number;
  name: string;
  commune: string;
}

export const getClosestAirport = (latitude: number, longitude: number) => {
  return get(`/airports/closest?lat=${latitude}&lon=${longitude}`);
};

export interface SarBase {
  latitude: number;
  longitude: number;
  name: string;
  commune: string;
}

export const getClosestSarBase = (latitude: number, longitude: number) => {
  return get(`/sar_bases/closest?lat=${latitude}&lon=${longitude}`);
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

export const getUserLocation = () => {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};
