import { Marker, Popup, useMap } from "react-leaflet";
import { useOnMessage } from "./useOnMessage";
import { useRef } from "react";
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
  const map = useMap();
  const { emergencyDepots } = useEmergencyDepots();

  useOnMessage((message) => {
    if (message.data?.type === "emergencyDepot") {
      const emergencyDepot = message.data.emergencyDepot;
      map.flyTo([emergencyDepot.latitude, emergencyDepot.longitude], 13, {
        duration: 2,
      });
      setTimeout(() => {
        popupRef.current?.toggle();
      }, 1500);
    }
  }, "emergencyDepot");

  return (
    <>
      {emergencyDepots?.map((emergencyDepot, index) => (
        <Marker
          key={index}
          position={[emergencyDepot.latitude, emergencyDepot.longitude]}
          icon={icon}
        >
          <Popup ref={popupRef}>{emergencyDepot.name}</Popup>
        </Marker>
      ))}
    </>
  );
};
