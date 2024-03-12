import { forwardRef, useState } from "react";
import { GeoLocator } from "./GeoLocator";
import "./Map.css";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { GeoLocation } from "./GeoLocation";
import { Map as LeafletMap } from "leaflet";
import { WhatAreYouSinkingAbout } from "./WhatAreYouSinkingAbout";

export const Map = forwardRef<LeafletMap>((_props, ref) => {
  const [userLocation, setUserLocation] = useState<GeoLocation | undefined>();

  return (
    <MapContainer
      ref={ref}
      // Middle of Norway
      center={[63, 10.3951]}
      zoom={6}
      style={{ height: "100vh" }}
      className="map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoLocator onLocationFound={setUserLocation} />
      <WhatAreYouSinkingAbout />
      {userLocation && (
        <Marker position={[userLocation.latitude, userLocation.longitude]} />
      )}
    </MapContainer>
  );
});
