import { Marker, Popup, useMap } from "react-leaflet";
import { useOnMessage } from "./useOnMessage";
import { useRef } from "react";
import L, { Popup as PopupType } from "leaflet";
import { Airport, useAirports } from "./api";

import iconFile from "./assets/travel.svg";
const icon = new L.Icon({
  iconUrl: iconFile,
  iconSize: [24, 24],
});

export interface ClosestAirportResponse {
  type: "airport";
  airport: Airport;
}

export const AirportMarkers = () => {
  const popupRef = useRef<PopupType>(null);
  const map = useMap();
  const { airports } = useAirports();

  useOnMessage((message) => {
    if (message.data?.type === "airport") {
      const airport = message.data.airport;
      map.flyTo([airport.latitude, airport.longitude], 13, {
        duration: 2,
      });
      setTimeout(() => {
        popupRef.current?.toggle();
      }, 1500);
    }
  });

  return (
    <>
      {airports?.map((airport) => (
        <Marker
          key={airport.name}
          position={[airport.latitude, airport.longitude]}
          icon={icon}
        >
          <Popup ref={popupRef}>{airport.name}</Popup>
        </Marker>
      ))}
    </>
  );
};
