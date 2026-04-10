'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import { Truck, Navigation } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface TrackingMapProps {
  lat: number;
  lng: number;
  driverName?: string;
  vehicleNumber?: string;
  status?: string;
  pickupLocation?: string;
  dropLocation?: string;
  pickupLat?: number;
  pickupLng?: number;
  dropLat?: number;
  dropLng?: number;
  className?: string;
}

// Fix for default marker icon in Next.js
const truckIcon = new Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/713/713311.png',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

const locationIcon = new Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15],
});

// Component to update map view when position changes
function MapUpdater({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  map.setView([lat, lng], map.getZoom(), { animate: true });
  return null;
}

export function TrackingMap({
  lat,
  lng,
  driverName,
  vehicleNumber,
  status,
  pickupLocation,
  dropLocation,
  pickupLat,
  pickupLng,
  dropLat,
  dropLng,
  className,
}: TrackingMapProps) {
  const center: LatLngExpression = [lat || 20.5937, lng || 78.9629]; // Default to India center
  const pickup: LatLngExpression | null = pickupLat && pickupLng ? [pickupLat, pickupLng] : null;
  const drop: LatLngExpression | null = dropLat && dropLng ? [dropLat, dropLng] : null;

  return (
    <div className={`relative rounded-xl overflow-hidden border-2 border-gray-200 ${className}`}>
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: '400px', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Update map view when driver moves */}
        <MapUpdater lat={lat} lng={lng} />

        {/* Pickup location marker */}
        {pickup && (
          <Marker position={pickup} icon={locationIcon}>
            <Popup>
              <div className="p-2">
                <strong className="text-green-700">📍 Pickup Location</strong>
                <p className="text-sm mt-1">{pickupLocation || 'Farm Location'}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Drop location marker */}
        {drop && (
          <Marker position={drop} icon={locationIcon}>
            <Popup>
              <div className="p-2">
                <strong className="text-blue-700">🎯 Delivery Location</strong>
                <p className="text-sm mt-1">{dropLocation || 'Buyer Location'}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Driver/Truck marker */}
        <Marker position={[lat, lng]} icon={truckIcon}>
          <Popup>
            <div className="p-3 min-w-[200px]">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="w-4 h-4 text-brand-primary" />
                <strong className="text-base">{driverName || 'Driver'}</strong>
              </div>
              {vehicleNumber && (
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-semibold">Vehicle:</span> {vehicleNumber}
                </p>
              )}
              {status && (
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-semibold">Status:</span> {status.replace('_', ' ')}
                </p>
              )}
              <div className="flex items-center gap-1 mt-2 text-xs text-brand-primary">
                <Navigation className="w-3 h-3" />
                <span>Live Tracking</span>
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Status overlay */}
      {status && (
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
            <span className="text-sm font-semibold text-gray-900">
              {status.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
