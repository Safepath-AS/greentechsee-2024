import { useMap } from "react-leaflet";
import { useOnMessage } from "./useOnMessage";
import { useAddMessage } from "./useAddMessage";
import { GeoLocation } from "./GeoLocation";

interface GeoLocatorProps {
  onLocationFound: (location: GeoLocation) => void;
}

export const GeoLocator = ({ onLocationFound }: GeoLocatorProps) => {
  const map = useMap();
  const addMessage = useAddMessage();

  useOnMessage((message) => {
    if (message.author === "You") {
      if (message.content.toLowerCase().includes("location")) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          map.flyTo([latitude, longitude], 13, {
            duration: 2,
          });
          addMessage({
            author: "AI",
            content: "Moving the map to your current location.",
          });
          onLocationFound({ latitude, longitude });
        });
      }
    }
  });

  return <></>;
};
