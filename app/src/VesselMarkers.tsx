import { Marker, Popup, useMap } from "react-leaflet";
import { useOnMessage } from "./useOnMessage";
import { useRef, useState } from "react";
import L, { Popup as PopupType } from "leaflet";
import { Vessel, useVessels } from "./api";

import iconFile from "./assets/boat.svg";
import { useTranslation } from "react-i18next";
const icon = new L.Icon({
  iconUrl: iconFile,
  iconSize: [24, 24],
});

export interface ClosestVesselResponse {
  type: "vessel";
  vessel: Vessel;
}

export const VesselMarkers = () => {
  const { t } = useTranslation();
  const popupRef = useRef<PopupType>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const map = useMap();
  const { vessels } = useVessels();

  useOnMessage((message) => {
    if (message.data?.type === "vessel") {
      const vessel = message.data.vessel;
      map.flyTo([vessel.latitude, vessel.longitude], 13, {
        duration: 2,
      });
      setSelectedId(vessel.id);
      setTimeout(() => {
        popupRef.current?.toggle();
      }, 3000);
    }
  }, "vessel");

  return (
    <>
      {vessels?.map((vessel) => (
        <Marker
          key={vessel.id}
          position={[vessel.latitude, vessel.longitude]}
          icon={icon}
        >
          <Popup {...(selectedId === vessel.id && { ref: popupRef })}>
            🚢 <b>{vessel.mmsi}</b>
            <br />
            {t("type")}: {vessel.type}
          </Popup>
        </Marker>
      ))}
    </>
  );
};
