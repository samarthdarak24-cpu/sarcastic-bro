"use client";

import React, { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import 'leaflet/dist/leaflet.css';

// Dynamic import for react-leaflet (No SSR)
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });

interface ProductMapProps {
  products: any[];
}

export function ProductMap({ products }: ProductMapProps) {
  const [L, setL] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Dynamically require Leaflet only on client
    const leaflet = require('leaflet');
    setL(leaflet);
  }, []);

  if (!isClient || !L) return <div className="h-[400px] w-full bg-neut-50 flex items-center justify-center font-bold text-neut-400">Loading Map Hub...</div>;

  const markerIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  // Filter products with valid coordinates
  const markers = products.filter(p => (p.location?.lat || p.lat) && (p.location?.lng || p.lng));

  return (
    <Card className="border-none shadow-startup-soft overflow-hidden bg-white rounded-[2.5rem]">
      <CardHeader className="flex flex-row items-center justify-between pb-4 px-8 pt-8">
        <div>
          <CardTitle className="text-xl font-black">Farm Inventory Map</CardTitle>
          <div className="flex items-center gap-2 mt-1">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-primary animate-pulse" />
            <p className="text-[10px] font-black text-neut-400 uppercase tracking-widest">Geolocation Insights</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 h-[400px]">
        {/* @ts-ignore */}
        <MapContainer center={[20.5937, 78.9629]} zoom={4} style={{ height: '100%', width: '100%' }}>
          {/* @ts-ignore */}
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {markers.map((product) => {
            const pos: [number, number] = [
                product.location?.lat || product.lat, 
                product.location?.lng || product.lng
            ];
            return (
                /* @ts-ignore */
                <Marker key={product.id} position={pos} icon={markerIcon}>
                {/* @ts-ignore */}
                <Popup>
                    <div className="p-2 min-w-[200px]">
                    <div className="flex items-center justify-between gap-4 mb-2">
                        <span className="text-[10px] font-black uppercase text-brand-primary">{product.category}</span>
                        <Badge tone="ink" className="text-[9px] font-black">Grade {product.qualityGrade || 'B'}</Badge>
                    </div>
                    <h4 className="font-black text-sm text-neut-900 mb-1">{product.name}</h4>
                    <div className="flex justify-between items-end mt-4">
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-neut-300 uppercase">Unit Price</span>
                            <span className="text-xs font-black text-neut-900">₹{product.price}</span>
                        </div>
                        <div className="flex flex-col text-right">
                            <span className="text-[8px] font-black text-neut-300 uppercase">Available</span>
                            <span className="text-xs font-black text-neut-900">{product.quantity} kg</span>
                        </div>
                    </div>
                    </div>
                </Popup>
                </Marker>
            );
          })}
        </MapContainer>
      </CardContent>
    </Card>
  );
}
