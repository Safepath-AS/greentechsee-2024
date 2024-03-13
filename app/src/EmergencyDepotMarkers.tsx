import { Marker, Popup, useMap } from "react-leaflet";
import { useOnMessage } from "./useOnMessage";
import { useRef, useState } from "react";
import L, { Popup as PopupType } from "leaflet";
import { EmergencyDepot, useEmergencyDepots } from "./api";

import iconFile from "./assets/oil.svg";
const icon = new L.Icon({
  iconUrl: iconFile,
  iconSize: [24, 24],
});

export interface ClosestEmergencyDepotResponse {
  type: "emergencyDepot";
  emergencyDepot: EmergencyDepot;
}

export const EmergencyDepotMarkers = () => {
  const popupRef = useRef<PopupType>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const map = useMap();
  const { emergencyDepots } = useEmergencyDepots();

  useOnMessage((message) => {
    if (message.data?.type === "emergencyDepot") {
      const emergencyDepot = message.data.emergencyDepot;
      map.flyTo([emergencyDepot.latitude, emergencyDepot.longitude], 13, {
        duration: 2,
      });
      setSelectedId(emergencyDepot.id);
      setTimeout(() => {
        popupRef.current?.toggle();
      }, 3000);
    }
  }, "emergencyDepot");

  return (
    <>
      {emergencyDepots?.map((emergencyDepot) => (
        <Marker
          key={emergencyDepot.id}
          position={[emergencyDepot.latitude, emergencyDepot.longitude]}
          icon={icon}
        >
          <Popup {...(selectedId === emergencyDepot.id && { ref: popupRef })}>
            🛢️ <b>{emergencyDepot.name}</b>
          </Popup>
        </Marker>
      ))}
    </>
  );
};
