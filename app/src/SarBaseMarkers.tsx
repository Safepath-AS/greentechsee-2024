import { Marker, Popup, useMap } from "react-leaflet";
import { useOnMessage } from "./useOnMessage";
import { useRef, useState } from "react";
import L, { Popup as PopupType } from "leaflet";
import { SarBase, useSarBases } from "./api";

import iconFile from "./assets/helicopter.svg";
const icon = new L.Icon({
  iconUrl: iconFile,
  iconSize: [24, 24],
});
export interface ClosestSarBaseResponse {
  type: "sarBase";
  sarBase: SarBase;
}

export const SarBaseMarkers = () => {
  const popupRef = useRef<PopupType>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const map = useMap();
  const { sarBases } = useSarBases();

  useOnMessage((message) => {
    if (message.data?.type === "sarBase") {
      const sarBase = message.data.sarBase;

      map.flyTo([sarBase.latitude, sarBase.longitude], 13, {
        duration: 2,
      });
      setSelectedId(sarBase.id);
      setTimeout(() => {
        popupRef.current?.toggle();
      }, 3000);
    }
  }, "sarBase");

  return (
    <>
      {sarBases?.map((sarBase) => (
        <Marker
          key={sarBase.id}
          position={[sarBase.latitude, sarBase.longitude]}
          icon={icon}
        >
          <Popup {...(selectedId === sarBase.id && { ref: popupRef })}>
            {sarBase.name}
          </Popup>
        </Marker>
      ))}
    </>
  );
};
