import { Marker, Popup, useMap } from "react-leaflet";
import { useOnMessage } from "./useOnMessage";
import { useRef, useState } from "react";
import { Popup as PopupType } from "leaflet";
import { Airport } from "./api";

export interface ClosestAirportResponse {
  type: "airport";
  airport: Airport;
}

export const AirportMarkers = () => {
  const popupRef = useRef<PopupType>(null);
  const map = useMap();
  const [airports, setAirports] = useState<Airport[]>([]);

  useOnMessage((message) => {
    if (message.data?.type === "airport") {
      const airport = message.data.airport;
      setAirports((prev) => [...prev, airport]);

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
      {airports.map((airport) => (
        <Marker
          key={airport.name}
          position={[airport.latitude, airport.longitude]}
        >
          <Popup ref={popupRef}>{airport.name}</Popup>
        </Marker>
      ))}
    </>
  );
};
