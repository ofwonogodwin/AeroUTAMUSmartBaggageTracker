"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  MapPin,
  Plane,
  Car,
  Utensils,
  Luggage,
  Info,
  Maximize,
  Satellite,
  Map,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { loadGoogleMapsAPI } from "@/utils/googleMapsLoader";

// Google Maps types declaration
interface GoogleMap {
  setMapTypeId: (mapTypeId: string) => void;
}

interface GoogleMarker {
  setMap: (map: GoogleMap | null) => void;
  setVisible: (visible: boolean) => void;
  addListener: (event: string, handler: () => void) => void;
}

interface GoogleMapsAPI {
  Map: new (element: HTMLElement, options: unknown) => GoogleMap;
  Marker: new (options: unknown) => GoogleMarker;
  InfoWindow: new (options: unknown) => {
    open: (map: GoogleMap, marker: GoogleMarker) => void;
  };
  Size: new (width: number, height: number) => unknown;
  Point: new (x: number, y: number) => unknown;
}

declare global {
  interface Window {
    google: {
      maps: GoogleMapsAPI;
    };
  }
}

interface AirportLocation {
  id: string;
  name: string;
  type:
    | "terminal"
    | "gate"
    | "baggage"
    | "restaurant"
    | "shop"
    | "service"
    | "parking";
  lat: number;
  lng: number;
  description: string;
  icon: string;
}

// Entebbe International Airport coordinates and locations
const AIRPORT_CENTER = { lat: 0.0424, lng: 32.4435 };

const airportLocations: AirportLocation[] = [
  {
    id: "main-terminal",
    name: "Main Terminal Building",
    type: "terminal",
    lat: 0.0424,
    lng: 32.4435,
    description:
      "Main passenger terminal with check-in counters and departure gates",
    icon: "✈️",
  },
  {
    id: "baggage-claim",
    name: "Baggage Claim Area",
    type: "baggage",
    lat: 0.042,
    lng: 32.444,
    description: "International and domestic baggage claim area",
    icon: "🧳",
  },
  {
    id: "departure-gates",
    name: "Departure Gates",
    type: "gate",
    lat: 0.0428,
    lng: 32.443,
    description: "Gates 1-8 for domestic and international flights",
    icon: "🚪",
  },
  {
    id: "security-checkpoint",
    name: "Security Checkpoint",
    type: "service",
    lat: 0.0422,
    lng: 32.4432,
    description: "Main security screening area",
    icon: "🔒",
  },
  {
    id: "restaurant-1",
    name: "Airport Restaurant",
    type: "restaurant",
    lat: 0.0426,
    lng: 32.4438,
    description: "International cuisine and local dishes",
    icon: "🍽️",
  },
  {
    id: "parking",
    name: "Main Parking Area",
    type: "parking",
    lat: 0.041,
    lng: 32.442,
    description: "Short and long-term parking",
    icon: "🚗",
  },
];

interface EntebbeAirportMapProps {
  height?: string;
  showControls?: boolean;
}

export default function EntebbeAirportMapV2({
  height = "600px",
  showControls = true,
}: EntebbeAirportMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<GoogleMap | null>(null);
  const markersRef = useRef<GoogleMarker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [mapType, setMapType] = useState<"roadmap" | "satellite">("satellite");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const addMarkers = useCallback(
    (map: GoogleMap) => {
      // Clear existing markers
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

      const filteredLocations =
        selectedFilter === "all"
          ? airportLocations
          : airportLocations.filter((loc) => loc.type === selectedFilter);

      filteredLocations.forEach((location) => {
        const marker = new window.google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map: map,
          title: location.name,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
              `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="15" cy="15" r="12" fill="#2563eb" stroke="white" stroke-width="2"/>
              <text x="15" y="20" text-anchor="middle" fill="white" font-size="12">${location.icon}</text>
            </svg>`
            )}`,
            scaledSize: new window.google.maps.Size(30, 30),
            anchor: new window.google.maps.Point(15, 15),
          },
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
          <div style="padding: 10px; max-width: 200px;">
            <h3 style="margin: 0 0 5px 0; color: #1f2937; font-size: 14px; font-weight: 600;">
              ${location.name}
            </h3>
            <p style="margin: 0; color: #6b7280; font-size: 12px;">
              ${location.description}
            </p>
          </div>
        `,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });

        markersRef.current.push(marker);
      });
    },
    [selectedFilter]
  );

  const initializeMap = useCallback(() => {
    if (!mapRef.current || !window.google) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: AIRPORT_CENTER,
      zoom: 16,
      mapTypeId: mapType,
      disableDefaultUI: false,
      zoomControl: true,
      streetViewControl: false,
      fullscreenControl: true,
    });

    googleMapRef.current = map;
    addMarkers(map);
    setLoading(false);
  }, [mapType, addMarkers]);

  // Load Google Maps API
  useEffect(() => {
    const initMap = async () => {
      try {
        await loadGoogleMapsAPI();
        initializeMap();
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load Google Maps";
        setError(errorMessage);
        setLoading(false);
      }
    };

    initMap();
  }, [initializeMap]);

  // Update markers when filter changes
  useEffect(() => {
    if (googleMapRef.current) {
      addMarkers(googleMapRef.current);
    }
  }, [selectedFilter, addMarkers]);

  // Update map type when changed
  useEffect(() => {
    if (googleMapRef.current) {
      googleMapRef.current.setMapTypeId(mapType);
    }
  }, [mapType]);

  const getLocationIcon = (type: string) => {
    switch (type) {
      case "terminal":
        return <Plane className="h-4 w-4" />;
      case "gate":
        return <MapPin className="h-4 w-4" />;
      case "baggage":
        return <Luggage className="h-4 w-4" />;
      case "restaurant":
        return <Utensils className="h-4 w-4" />;
      case "service":
        return <Info className="h-4 w-4" />;
      case "parking":
        return <Car className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gray-50 rounded-lg border border-gray-200">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Map Unavailable
        </h3>
        <p className="text-gray-600 text-center max-w-md mb-4">{error}</p>
        <div className="text-sm text-gray-500 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="font-medium mb-1">📝 Setup Required:</p>
          <p>
            1. Get a Google Maps API key from{" "}
            <a
              href="https://console.cloud.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Google Cloud Console
            </a>
          </p>
          <p>2. Add it to your .env.local file</p>
          <p>3. Enable Maps JavaScript API</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative bg-white rounded-lg shadow-lg overflow-hidden ${
        isFullscreen ? "fixed inset-0 z-50" : ""
      }`}
      style={{ height: isFullscreen ? "100vh" : height }}
    >
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2 mx-auto"></div>
            <p className="text-gray-600">Loading airport map...</p>
          </div>
        </div>
      )}

      {/* Controls */}
      {showControls && (
        <div className="absolute top-4 left-4 z-20 bg-white rounded-lg shadow-md p-3 space-y-3">
          {/* Filter buttons */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-700">
              Filter Locations:
            </p>
            <div className="flex flex-wrap gap-1">
              {[
                "all",
                "terminal",
                "gate",
                "baggage",
                "restaurant",
                "service",
                "parking",
              ].map((filter) => (
                <Button
                  key={filter}
                  size="sm"
                  variant={selectedFilter === filter ? "primary" : "outline"}
                  onClick={() => setSelectedFilter(filter)}
                  className="text-xs px-2 py-1 h-auto"
                >
                  {getLocationIcon(filter)}
                  <span className="ml-1 capitalize">{filter}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Map type toggle */}
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={mapType === "satellite" ? "primary" : "outline"}
              onClick={() => setMapType("satellite")}
              className="text-xs px-2 py-1 h-auto"
            >
              <Satellite className="h-3 w-3 mr-1" />
              Satellite
            </Button>
            <Button
              size="sm"
              variant={mapType === "roadmap" ? "primary" : "outline"}
              onClick={() => setMapType("roadmap")}
              className="text-xs px-2 py-1 h-auto"
            >
              <Map className="h-3 w-3 mr-1" />
              Map
            </Button>
          </div>
        </div>
      )}

      {/* Fullscreen toggle */}
      <Button
        onClick={toggleFullscreen}
        size="sm"
        variant="outline"
        className="absolute top-4 right-4 z-20 bg-white shadow-md"
      >
        <Maximize className="h-4 w-4" />
      </Button>

      {/* Map container */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-20 bg-white rounded-lg shadow-md p-3 max-w-xs">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">
          🛂 Entebbe International Airport
        </h4>
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <span>✈️</span> <span>Terminal Building</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🧳</span> <span>Baggage Claim</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🚪</span> <span>Gates</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🔒</span> <span>Security</span>
          </div>
        </div>
      </div>
    </div>
  );
}
