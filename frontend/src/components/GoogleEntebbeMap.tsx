"use client";

import { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Plane,
  Utensils,
  Luggage,
  Info,
  Car,
  Satellite,
  Map as MapIcon,
  Maximize,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

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
];

interface EntebbeAirportMapProps {
  className?: string;
  height?: string;
}

export default function EntebbeAirportMap({
  className = "",
  height = "600px",
}: EntebbeAirportMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [mapType, setMapType] = useState<"roadmap" | "satellite">("satellite");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [useGoogleMaps, setUseGoogleMaps] = useState(true);

  // Google Maps integration
  useEffect(() => {
    const loadGoogleMaps = () => {
      // Check if we should use Google Maps (has API key)
      const hasApiKey =
        process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY &&
        process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY !== "YOUR_API_KEY";

      if (!hasApiKey) {
        setUseGoogleMaps(false);
        setIsLoaded(true);
        return;
      }

      if ((window as any).google && (window as any).google.maps) {
        initializeMap();
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      script.onerror = () => {
        setUseGoogleMaps(false);
        setIsLoaded(true);
      };
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current) return;

      const google = (window as any).google;
      const map = new google.maps.Map(mapRef.current, {
        center: AIRPORT_CENTER,
        zoom: 16,
        mapTypeId: mapType,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: true,
        rotateControl: true,
        fullscreenControl: true,
      });

      // Add markers for airport locations
      airportLocations.forEach((location) => {
        const marker = new google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map: map,
          title: location.name,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="#2563eb" stroke="white" stroke-width="3"/>
                <text x="20" y="26" text-anchor="middle" font-size="16" fill="white">${location.icon}</text>
              </svg>
            `)}`,
            scaledSize: new google.maps.Size(40, 40),
            anchor: new google.maps.Point(20, 20),
          },
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; max-width: 250px;">
              <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px; font-weight: 600;">
                ${location.icon} ${location.name}
              </h3>
              <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.4;">
                ${location.description}
              </p>
            </div>
          `,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });
      });

      setIsLoaded(true);
    };

    loadGoogleMaps();
  }, [mapType]);

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

  if (!isLoaded) {
    return (
      <div className={`bg-gray-100 rounded-lg ${className}`} style={{ height }}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Entebbe Airport Map...</p>
            <p className="text-sm text-gray-500 mt-2">
              {useGoogleMaps
                ? "Loading Google Maps..."
                : "Preparing interactive map..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Fallback to iframe Google Maps if API integration fails
  if (!useGoogleMaps) {
    return (
      <div
        className={`relative bg-white rounded-lg shadow-lg overflow-hidden ${className} ${
          isFullscreen ? "fixed inset-0 z-50" : ""
        }`}
      >
        {/* Map Controls for iframe version */}
        <div className="absolute top-4 right-4 z-10">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="bg-white hover:bg-gray-50"
          >
            <Maximize className="w-4 h-4" />
          </Button>
        </div>

        {/* Google Maps Embed */}
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.647123456789!2d32.4435!3d0.0424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177da3d8d8d8d8d8%3A0x1234567890abcdef!2sEntebbe%20International%20Airport!5e1!3m2!1sen!2sug!4v1696345678901!5m2!1sen!2sug"
          width="100%"
          height={isFullscreen ? "100vh" : height}
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full"
        />

        {/* Location Info Overlay */}
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
              <Plane className="w-5 h-5 mr-2 text-blue-600" />
              Entebbe International Airport
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p className="font-medium text-gray-800">📍 Key Locations:</p>
                <ul className="mt-1 space-y-1">
                  <li>✈️ Main Terminal Building</li>
                  <li>🧳 Baggage Claim Areas</li>
                  <li>🚪 Departure Gates 1-8</li>
                  <li>🔒 Security Checkpoints</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-gray-800">🏢 Services:</p>
                <ul className="mt-1 space-y-1">
                  <li>🍽️ Restaurants & Cafes</li>
                  <li>🛍️ Duty-Free Shopping</li>
                  <li>🅿️ Parking Facilities</li>
                  <li>🚗 Car Rental & Taxis</li>
                </ul>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                <strong>Coordinates:</strong> 0.0424°N, 32.4435°E |
                <strong> IATA:</strong> EBB |<strong> ICAO:</strong> HUEN
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full Google Maps API integration
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
              onClick={() => setMapType("satellite")}
              className="text-xs"
            >
              <Satellite className="w-3 h-3 mr-1" />
              Satellite
            </Button>
            <Button
              size="sm"
              variant={mapType === "roadmap" ? "primary" : "outline"}
              onClick={() => setMapType("roadmap")}
              className="text-xs"
            >
              <MapIcon className="w-3 h-3 mr-1" />
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
          onClick={() => setIsFullscreen(!isFullscreen)}
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
                onClick={() => setSelectedFilter(filter.id)}
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
    </div>
  );
}
