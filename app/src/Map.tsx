import { useState } from "react";
import { GeoLocator } from "./GeoLocator";
import "./Map.css";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { GeoLocation } from "./GeoLocation";

export const Map = () => {
  const [userLocation, setUserLocation] = useState<GeoLocation | undefined>();
  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      style={{ height: "100vh" }}
      className="map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoLocator onLocationFound={setUserLocation} />
      {userLocation && (
        <Marker position={[userLocation.latitude, userLocation.longitude]} />
      )}
    </MapContainer>
  );
};
