import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChatProvider } from "./ChatContext.tsx";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const queryClient = new QueryClient();

const resources = {
  en: {
    translation: {
      type_a_message: "Ask about emergency resources...",
      init: "Hi! I can help you locate emergency resources.",
      thinking: "Thinking...",
      error: "Failed, please try again.",
      language_changed: "OK, I've changed the language.",
      current_location_response: "Here is your current location.",
      closest_hospital_response:
        "The closest hospital is {{name}} in {{commune}}.",
      closest_airport_response:
        "The closest airport is {{name}} in {{commune}}.",
      closest_sar_base_response:
        "The closest search and rescue helicopter base is {{name}} in {{commune}}.",
      closest_emergency_port_response:
        "The closest emergency port is {{name}} in {{commune}}.",
      closest_emergency_depot_response:
        "The closest emergency depot is {{name}} in {{commune}}.",
      automated: "system",
    },
  },
  no: {
    translation: {
      type_a_message: "Spør om nødressurser...",
      init: "Hei! Jeg kan hjelpe deg med å finne nødressurser.",
      thinking: "Tenker...",
      error: "Failed, please try again.",
      language_changed: "OK, jeg har endret språk.",
      current_location_response: "Her er din nåværende posisjon.",
      closest_hospital_response:
        "Nærmeste sykehus $t({{helipad_t}}) er {{name}} i {{commune}}.",
      closest_airport_response: "Nærmeste flyplass er {{name}} i {{commune}}.",
      closest_sar_base_response:
        "Nærmeste søk- og redningshelikopterbase er {{name}} i {{commune}}.",
      closest_emergency_port_response:
        "Nærmeste nødhavn er {{name}} i {{commune}}.",
      closest_emergency_depot_response:
        "Nærmeste nøddepot er {{name}} i {{commune}}.",
      automated: "system",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  interpolation: {
    escapeValue: false,
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChatProvider>
        <App />
      </ChatProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
