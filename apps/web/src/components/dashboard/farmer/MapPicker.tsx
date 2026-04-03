"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix icon issue
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapPickerProps {
  position: [number, number] | null;
  setPosition: (pos: [number, number]) => void;
}

function MapEvents({ setPosition }: { setPosition: (pos: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default function MapPicker({ position, setPosition }: MapPickerProps) {
  return (
    <div className="h-48 w-full rounded-2xl overflow-hidden border border-neut-200 mt-4 relative z-0">
      <MapContainer 
        center={position || [20.5937, 78.9629]} 
        zoom={position ? 12 : 4} 
        scrollWheelZoom={false} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapEvents setPosition={setPosition} />
        {position && <Marker position={position} icon={markerIcon} />}
      </MapContainer>
    </div>
  );
}
