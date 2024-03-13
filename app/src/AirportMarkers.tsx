import { Marker, Popup, useMap } from "react-leaflet";
import { useOnMessage } from "./useOnMessage";
import { useRef, useState } from "react";
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
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const map = useMap();
  const { airports } = useAirports();

  useOnMessage((message) => {
    if (message.data?.type === "airport") {
      const airport = message.data.airport;
      map.flyTo([airport.latitude, airport.longitude], 13, {
        duration: 2,
      });
      setSelectedId(airport.id);
      setTimeout(() => {
        popupRef.current?.toggle();
      }, 3000);
    }
  }, "airport");

  return (
    <>
      {airports?.map((airport) => (
        <Marker
          key={airport.id}
          position={[airport.latitude, airport.longitude]}
          icon={icon}
        >
          <Popup {...(selectedId === airport.id && { ref: popupRef })}>
            {airport.name}
          </Popup>
        </Marker>
      ))}
    </>
  );
};
