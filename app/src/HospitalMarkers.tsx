import { Marker, Popup, useMap } from "react-leaflet";
import { useOnMessage } from "./useOnMessage";
import { useRef } from "react";
import L, { Popup as PopupType } from "leaflet";
import { Hospital, useHospitals } from "./api";

import iconFile from "./assets/hospital.svg";
const icon = new L.Icon({
  iconUrl: iconFile,
  iconSize: [24, 24],
});

export interface ClosestHospitalResponse {
  type: "hospital";
  hospital: Hospital;
}

export const HospitalMarkers = () => {
  const popupRef = useRef<PopupType>(null);
  const map = useMap();
  const { hospitals } = useHospitals();

  console.log("rendered hospitals");

  useOnMessage((message) => {
    if (message.data?.type === "hospital") {
      const hospital = message.data.hospital;

      map.flyTo([hospital.latitude, hospital.longitude], 13, {
        duration: 2,
      });
      setTimeout(() => {
        popupRef.current?.toggle();
      }, 1500);
    }
  }, "hospital");

  return (
    <>
      {hospitals?.map((hospital, index) => (
        <Marker
          key={index}
          position={[hospital.latitude, hospital.longitude]}
          icon={icon}
        >
          <Popup ref={popupRef}>{hospital.name}</Popup>
        </Marker>
      ))}
    </>
  );
};
