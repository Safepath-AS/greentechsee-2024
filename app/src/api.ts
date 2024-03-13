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
  id: number;
  latitude: number;
  longitude: number;
  name: string;
  commune: string;
}

export const useHospitals = () => {
  const result = useQuery({
    queryKey: ["hospitals"],
    queryFn: async () => await get("/hospitals"),
  });
  const hospitals = result.data as Hospital[] | undefined;
  return {
    hospitals,
    ...result,
  };
};

export const getClosestHospital = (
  latitude: number,
  longitude: number,
  needs_helipad: boolean = false
) => {
  return get(
    `/hospitals/closest?lat=${latitude}&lon=${longitude}&needs_helipad=${needs_helipad}`
  );
};

export interface Airport {
  id: number;
  latitude: number;
  longitude: number;
  name: string;
  commune: string;
}

export const useAirports = () => {
  const result = useQuery({
    queryKey: ["airports"],
    queryFn: async () => await get("/airports"),
  });
  const airports = result.data as Airport[] | undefined;
  return {
    airports,
    ...result,
  };
};

export const getClosestAirport = (latitude: number, longitude: number) => {
  return get(`/airports/closest?lat=${latitude}&lon=${longitude}`);
};

export interface SarBase {
  id: number;
  latitude: number;
  longitude: number;
  name: string;
  commune: string;
}

export const useSarBases = () => {
  const result = useQuery({
    queryKey: ["sarBases"],
    queryFn: async () => await get("/sar_bases"),
  });
  const airports = result.data as SarBase[] | undefined;
  return {
    sarBases: airports,
    ...result,
  };
};

export const getClosestSarBase = (latitude: number, longitude: number) => {
  return get(`/sar_bases/closest?lat=${latitude}&lon=${longitude}`);
};

export interface EmergencyPort {
  id: number;
  latitude: number;
  longitude: number;
  name: string;
  commune: string;
}

export const useEmergencyPorts = () => {
  const result = useQuery({
    queryKey: ["emergencyPorts"],
    queryFn: async () => await get("/emergency_ports"),
  });
  const emergencyPorts = result.data as EmergencyPort[] | undefined;
  return {
    emergencyPorts,
    ...result,
  };
};

export const getClosestEmergencyPort = (
  latitude: number,
  longitude: number
) => {
  return get(`/emergency_ports/closest?lat=${latitude}&lon=${longitude}`);
};

export interface EmergencyDepot {
  id: number;
  latitude: number;
  longitude: number;
  name: string;
  commune: string;
}

export const useEmergencyDepots = () => {
  const result = useQuery({
    queryKey: ["emergencyDepots"],
    queryFn: async () => await get("/emergency_depots"),
  });
  const emergencyDepots = result.data as EmergencyDepot[] | undefined;
  return {
    emergencyDepots,
    ...result,
  };
};

export const getClosestEmergencyDepot = (
  latitude: number,
  longitude: number
) => {
  return get(`/emergency_depots/closest?lat=${latitude}&lon=${longitude}`);
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
