import { Marker, Popup, useMap } from "react-leaflet";
import { useOnMessage } from "./useOnMessage";
import { GeoLocation } from "./GeoLocation";
import { useRef, useState } from "react";
import { LatLngExpression, Popup as PopupType } from "leaflet";

export interface WhatAreYouSinkingAboutResponse {
  type: "sinking";
  location: GeoLocation;
}

export const WhatAreYouSinkingAbout = () => {
  const popupRef = useRef<PopupType>(null);
  const map = useMap();
  const [sinkingPos, setSinkingPos] = useState<LatLngExpression | undefined>();

  useOnMessage((message) => {
    if (message.data?.type === "sinking") {
      const { location } = message.data;

      setSinkingPos([location.latitude, location.longitude]);
      map.flyTo([location.latitude, location.longitude], 13, {
        duration: 2,
      });
      setTimeout(() => {
        popupRef.current?.toggle();
      }, 1500);
    }
  }, "sinking");

  return (
    <>
      {sinkingPos && (
        <Marker position={sinkingPos}>
          <Popup ref={popupRef}>🚢 What are you sinking about?</Popup>
        </Marker>
      )}
    </>
  );
};
