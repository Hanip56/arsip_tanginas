"use client"; // Ensure this runs only on the client

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLng, LatLngExpression } from "leaflet";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "./ui/input";

// Fix default marker issue in Next.js
const icon = L.icon({
  iconUrl: "/marker-icon.png", // Ensure the file is in the public directory
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type Props = {
  position: LatLngExpression;
  setPosition: Dispatch<SetStateAction<LatLngExpression>>;
};

const Map = ({ position, setPosition }: Props) => {
  const [isClient, setIsClient] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const fetchCoordinates = async (place: string) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${place}`
    );
    const data = await response.json();

    console.log({ data });
    if (data.length > 0) {
      const position: LatLngExpression = [
        parseFloat(data[0].lat),
        parseFloat(data[0].lon),
      ];
      setPosition(position);
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (debouncedSearch) {
      fetchCoordinates(debouncedSearch);
    }
  }, [debouncedSearch]);

  if (!isClient) return null; // Avoid SSR issues

  const MapUpdater = ({ position }: { position: LatLngExpression }) => {
    const map = useMap();
    map.setView(position, 13);
    return null;
  };

  return (
    <>
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Cari nama tempat"
        className="mb-4 text-xs placeholder:text-xs"
      />
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "300px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker
          position={position}
          icon={icon}
          draggable
          eventHandlers={{
            dragend: (event) => {
              const marker = event.target;
              const newPos: LatLng = marker.getLatLng();
              setPosition([newPos.lat, newPos.lng]);
            },
          }}
        >
          <Popup>Hello, this is a marker!</Popup>
        </Marker>
        <MapUpdater position={position} />
      </MapContainer>
    </>
  );
};

export default Map;
