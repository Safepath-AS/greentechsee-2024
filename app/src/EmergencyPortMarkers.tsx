import { Marker, Popup, useMap } from "react-leaflet";
import { useOnMessage } from "./useOnMessage";
import { useRef } from "react";
import L, { Popup as PopupType } from "leaflet";
import { EmergencyPort, useEmergencyPorts } from "./api";

import iconFile from "./assets/boat.svg";
const icon = new L.Icon({
  iconUrl: iconFile,
  iconSize: [24, 24],
});

export interface ClosestEmergencyPortResponse {
  type: "emergencyPort";
  emergencyPort: EmergencyPort;
}

export const EmergencyPortMarkers = () => {
  const popupRef = useRef<PopupType>(null);
  const map = useMap();
  const { emergencyPorts } = useEmergencyPorts();

  useOnMessage((message) => {
    if (message.data?.type === "emergencyPort") {
      const emergencyPort = message.data.emergencyPort;
      map.flyTo([emergencyPort.latitude, emergencyPort.longitude], 13, {
        duration: 2,
      });
      setTimeout(() => {
        popupRef.current?.toggle();
      }, 1500);
    }
  }, "emergencyPort");

  return (
    <>
      {emergencyPorts?.map((emergencyPort, index) => (
        <Marker
          key={index}
          position={[emergencyPort.latitude, emergencyPort.longitude]}
          icon={icon}
        >
          <Popup ref={popupRef}>{emergencyPort.name}</Popup>
        </Marker>
      ))}
    </>
  );
};
