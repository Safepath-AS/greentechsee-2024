import { forwardRef } from "react";
import { UserLocationMarker } from "./UserLocationMarker";
import "./Map.css";
import { MapContainer, TileLayer } from "react-leaflet";
import { Map as LeafletMap } from "leaflet";
import { WhatAreYouSinkingAbout } from "./WhatAreYouSinkingAbout";
import { HospitalMarkers } from "./HospitalMarkers";
import { AirportMarkers } from "./AirportMarkers";
import { SarBaseMarkers } from "./SarBaseMarkers";
import { EmergencyPortMarkers } from "./EmergencyPortMarkers";
import { EmergencyDepotMarkers } from "./EmergencyDepotMarkers";
import MarkerClusterGroup from "react-leaflet-cluster";

export const Map = forwardRef<LeafletMap>((_props, ref) => {
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
      <MarkerClusterGroup disableClusteringAtZoom={8} chunkLoading>
        <UserLocationMarker />
        <HospitalMarkers />
        <AirportMarkers />
        <SarBaseMarkers />
        <EmergencyPortMarkers />
        <EmergencyDepotMarkers />
        <WhatAreYouSinkingAbout />
      </MarkerClusterGroup>
    </MapContainer>
  );
});
