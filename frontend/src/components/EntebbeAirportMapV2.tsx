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
    description: "Security screening for all departing passengers",
    icon: "🔒",
  },
  {
    id: "customs-immigration",
    name: "Customs & Immigration",
    type: "service",
    lat: 0.0419,
    lng: 32.4438,
    description: "International arrivals immigration and customs control",
    icon: "🛂",
  },
  {
    id: "restaurants",
    name: "Dining Area",
    type: "restaurant",
    lat: 0.0425,
    lng: 32.4428,
    description: "Restaurants, cafes, and duty-free shopping",
    icon: "🍽️",
  },
  {
    id: "parking",
    name: "Main Parking",
    type: "parking",
    lat: 0.0415,
    lng: 32.4445,
    description: "Short-term and long-term parking facilities",
    icon: "🅿️",
  },
  {
    id: "car-rental",
    name: "Car Rental",
    type: "service",
    lat: 0.0418,
    lng: 32.4448,
    description: "Car rental services and taxi pickup point",
    icon: "🚗",
  },
];

// POI data for markers
const POI_DATA = airportLocations.map((location) => ({
  name: location.name,
  description: location.description,
  position: { lat: location.lat, lng: location.lng },
  category:
    location.type === "terminal"
      ? "terminal"
      : location.type === "gate"
      ? "gate"
      : location.type === "baggage"
      ? "baggage"
      : location.type === "service"
      ? "security"
      : location.type === "restaurant"
      ? "food"
      : "other",
}));

// Map styles for roadmap view
const roadmapStyles = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
];

interface EntebbeAirportMapProps {
  className?: string;
  height?: string;
  showControls?: boolean;
}

export default function EntebbeAirportMapV2({
  className = "",
  height = "600px",
  showControls = true,
}: EntebbeAirportMapProps = {}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [mapType, setMapType] = useState<"roadmap" | "satellite">("satellite");
  const [map, setMap] = useState<GoogleMap | null>(null);
  const [markers, setMarkers] = useState<GoogleMarker[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const initializeMap = useCallback(() => {
    if (!mapRef.current || !window.google) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: AIRPORT_CENTER,
      zoom: 16,
      mapTypeId: mapType === "satellite" ? "satellite" : "roadmap",
      styles: mapType === "roadmap" ? roadmapStyles : [],
      zoomControl: true,
      mapTypeControl: true,
      scaleControl: true,
      streetViewControl: true,
      rotateControl: true,
      fullscreenControl: true,
    });

    setMap(map);

    // Create markers for each POI
    const newMarkers: GoogleMarker[] = [];

    POI_DATA.forEach((poi) => {
      const marker = new window.google.maps.Marker({
        position: poi.position,
        map: map,
        title: poi.name,
        icon: {
          url:
            poi.category === "gate"
              ? "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
              : poi.category === "check-in"
              ? "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
              : poi.category === "baggage"
              ? "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
              : poi.category === "security"
              ? "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
              : poi.category === "food"
              ? "https://maps.google.com/mapfiles/ms/icons/purple-dot.png"
              : "https://maps.google.com/mapfiles/ms/icons/orange-dot.png",
          scaledSize: new window.google.maps.Size(32, 32),
        },
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="p-3 min-w-[200px]">
            <h3 class="font-bold text-lg mb-2">${poi.name}</h3>
            <p class="text-gray-600 mb-2">${poi.description}</p>
            <span class="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              ${poi.category.charAt(0).toUpperCase() + poi.category.slice(1)}
            </span>
          </div>
        `,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);
  }, [mapType]);

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
  }, [mapType, initializeMap]);

  const filterLocations = (type: string) => {
    setSelectedFilter(type);
    markers.forEach((marker, index) => {
      const location = airportLocations[index];
      if (type === "all" || location.type === type) {
        marker.setVisible(true);
      } else {
        marker.setVisible(false);
      }
    });
  };

  const changeMapType = (type: "roadmap" | "satellite") => {
    setMapType(type);
    if (map) {
      map.setMapTypeId(type);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const filterButtons = [
    { id: "all", label: "All Locations", icon: <MapPin className="w-4 h-4" /> },
    { id: "terminal", label: "Terminals", icon: <Plane className="w-4 h-4" /> },
    { id: "baggage", label: "Baggage", icon: <Luggage className="w-4 h-4" /> },
    {
      id: "restaurant",
      label: "Dining",
      icon: <Utensils className="w-4 h-4" />,
    },
    { id: "service", label: "Services", icon: <Info className="w-4 h-4" /> },
    { id: "parking", label: "Parking", icon: <Car className="w-4 h-4" /> },
  ];

  if (error) {
    return (
      <div
        className={`bg-red-50 border border-red-200 rounded-lg ${className}`}
        style={{ height }}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-6">
            <MapPin className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Map Unavailable
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="font-medium mb-1">📝 Setup Required:</p>
              <p>Check your Google Maps API key in .env.local</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !isLoaded) {
    return (
      <div className={`bg-gray-100 rounded-lg ${className}`} style={{ height }}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Entebbe Airport Map...</p>
            <p className="text-sm text-gray-500 mt-2">
              Satellite view with interactive markers
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative bg-white rounded-lg shadow-lg overflow-hidden ${className} ${
        isFullscreen ? "fixed inset-0 z-50" : ""
      }`}
    >
      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
        <div className="bg-white rounded-lg shadow p-2">
          <div className="flex space-x-1">
            <Button
              size="sm"
              variant={mapType === "satellite" ? "primary" : "outline"}
              onClick={() => changeMapType("satellite")}
              className="text-xs"
            >
              <Satellite className="w-3 h-3 mr-1" />
              Satellite
            </Button>
            <Button
              size="sm"
              variant={mapType === "roadmap" ? "primary" : "outline"}
              onClick={() => changeMapType("roadmap")}
              className="text-xs"
            >
              <Map className="w-3 h-3 mr-1" />
              Map
            </Button>
          </div>
        </div>
      </div>

      {/* Fullscreen Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          size="sm"
          variant="outline"
          onClick={toggleFullscreen}
          className="bg-white hover:bg-gray-50"
        >
          <Maximize className="w-4 h-4" />
        </Button>
      </div>

      {/* Filter Buttons */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="bg-white rounded-lg shadow p-3">
          <div className="flex flex-wrap gap-2 justify-center">
            {filterButtons.map((filter) => (
              <Button
                key={filter.id}
                size="sm"
                variant={selectedFilter === filter.id ? "primary" : "outline"}
                onClick={() => filterLocations(filter.id)}
                className="text-xs flex items-center"
              >
                {filter.icon}
                <span className="ml-1 hidden sm:inline">{filter.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Google Map Container */}
      <div
        ref={mapRef}
        style={{ height: isFullscreen ? "100vh" : height }}
        className="w-full"
      />

      {/* Fallback for no API key */}
      {(typeof window === "undefined" || !window.google) &&
        !process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
          <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
            <div className="text-center p-8">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Entebbe International Airport Map
              </h3>
              <p className="text-gray-600 mb-4">
                Interactive map with Google Maps integration
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                <p className="font-medium">📍 Airport Location:</p>
                <p>Latitude: 0.0424°N, Longitude: 32.4435°E</p>
                <p className="mt-2">
                  <strong>Note:</strong> Full Google Maps integration requires
                  API key configuration.
                </p>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
