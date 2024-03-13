import { Marker, Popup, useMap } from "react-leaflet";
import { useOnMessage } from "./useOnMessage";
import { useRef, useState } from "react";
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
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const map = useMap();
  const { hospitals } = useHospitals();

  useOnMessage((message) => {
    if (message.data?.type === "hospital") {
      const hospital = message.data.hospital;

      map.flyTo([hospital.latitude, hospital.longitude], 13, {
        duration: 2,
      });
      setSelectedId(hospital.id);
      setTimeout(() => {
        popupRef.current?.toggle();
      }, 3000);
    }
  }, "hospital");

  return (
    <>
      {hospitals?.map((hospital) => (
        <Marker
          key={hospital.id}
          position={[hospital.latitude, hospital.longitude]}
          icon={icon}
        >
          <Popup {...(selectedId === hospital.id && { ref: popupRef })}>
            {hospital.name}
            {hospital.has_helipad ? " 🚁" : ""}
          </Popup>
        </Marker>
      ))}
    </>
  );
};
