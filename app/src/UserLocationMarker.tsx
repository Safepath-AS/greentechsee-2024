import { Marker, useMap } from "react-leaflet";
import { useOnMessage } from "./useOnMessage";
import { GeoLocation } from "./GeoLocation";
import { useState } from "react";

export interface UserLocationResponse {
  type: "userLocation";
  location: GeoLocation;
}

export const UserLocationMarker = () => {
  const [userLocation, setUserLocation] = useState<GeoLocation | undefined>();

  const map = useMap();

  useOnMessage((message) => {
    if (message.data?.type === "userLocation") {
      const { latitude, longitude } = message.data.location;
      map.flyTo([latitude, longitude], 13, {
        duration: 2,
      });
      setUserLocation({ latitude, longitude });
    }
  }, "userLocation");

  return (
    <>
      {userLocation && (
        <Marker position={[userLocation.latitude, userLocation.longitude]} />
      )}
    </>
  );
};
