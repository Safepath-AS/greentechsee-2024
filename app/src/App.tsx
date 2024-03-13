import { useEffect, useRef } from "react";
import "./App.css";
import { Chat } from "./Chat";
import { Map } from "./Map";
import { Map as LeafletMap } from "leaflet";

function App() {
  const mapRef = useRef<LeafletMap>(null);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.getContainer().setAttribute("tabindex", "1");
    }
  }, []);

  return (
    <div className="main">
      <Chat
        onBlur={() => {
          mapRef.current?.getContainer().focus();
        }}
      />
      <Map ref={mapRef} />
    </div>
  );
}

export default App;
