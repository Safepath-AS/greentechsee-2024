import { Marker, Popup, useMap } from "react-leaflet";
import { useOnMessage } from "./useOnMessage";
import { useRef, useState } from "react";
import { Popup as PopupType } from "leaflet";
import { Hospital } from "./api";

export interface ClosestHospitalResponse {
  type: "hospital";
  hospital: Hospital;
}

export const HospitalMarkers = () => {
  const popupRef = useRef<PopupType>(null);
  const map = useMap();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);

  useOnMessage((message) => {
    if (message.data?.type === "hospital") {
      const hospital = message.data.hospital;
      setHospitals((prev) => [...prev, hospital]);

      map.flyTo([hospital.latitude, hospital.longitude], 13, {
        duration: 2,
      });
      setTimeout(() => {
        popupRef.current?.toggle();
      }, 1500);
    }
  });

  return (
    <>
      {hospitals.map((hospital) => (
        <Marker
          key={hospital.name}
          position={[hospital.latitude, hospital.longitude]}
        >
          <Popup ref={popupRef}>{hospital.name}</Popup>
        </Marker>
      ))}
    </>
  );
};
