import { Marker, Popup, useMap } from "react-leaflet";
import { useOnMessage } from "./useOnMessage";
import { useRef, useState } from "react";
import { Popup as PopupType } from "leaflet";
import { SarBase } from "./api";

export interface ClosestSarBaseResponse {
  type: "sarBase";
  sarBase: SarBase;
}

export const ClosestSarBase = () => {
  const popupRef = useRef<PopupType>(null);
  const map = useMap();
  const [sarBases, setSarBases] = useState<SarBase[]>([]);

  useOnMessage((message) => {
    if (message.data?.type === "sarBase") {
      const sarBase = message.data.sarBase;
      setSarBases((prev) => [...prev, sarBase]);

      map.flyTo([sarBase.latitude, sarBase.longitude], 13, {
        duration: 2,
      });
      setTimeout(() => {
        popupRef.current?.toggle();
      }, 1500);
    }
  });

  return (
    <>
      {sarBases.map((sarBase) => (
        <Marker
          key={sarBase.name}
          position={[sarBase.latitude, sarBase.longitude]}
        >
          <Popup ref={popupRef}>{sarBase.name}</Popup>
        </Marker>
      ))}
    </>
  );
};
