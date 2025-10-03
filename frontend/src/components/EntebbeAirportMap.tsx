"use client";

import { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Plane,
  Coffee,
  Car,
  Utensils,
  Luggage,
  Info,
  Navigation,
  Layers,
  Maximize,
  Minimize,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface MapLocation {
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
  x: number; // percentage from left
  y: number; // percentage from top
  description: string;
  icon: React.ReactNode;
}

const mapLocations: MapLocation[] = [
  // Main Terminal
  {
    id: "main-terminal",
    name: "Main Terminal",
    type: "terminal",
    x: 50,
    y: 40,
    description: "Main passenger terminal building",
    icon: <Plane className="w-4 h-4" />,
  },

  // Gates
  {
    id: "gate-1",
    name: "Gate 1",
    type: "gate",
    x: 30,
    y: 35,
    description: "International Departures Gate 1",
    icon: <Navigation className="w-4 h-4" />,
  },
  {
    id: "gate-2",
    name: "Gate 2",
    type: "gate",
    x: 35,
    y: 35,
    description: "International Departures Gate 2",
    icon: <Navigation className="w-4 h-4" />,
  },
  {
    id: "gate-3",
    name: "Gate 3",
    type: "gate",
    x: 65,
    y: 35,
    description: "International Departures Gate 3",
    icon: <Navigation className="w-4 h-4" />,
  },
  {
    id: "gate-4",
    name: "Gate 4",
    type: "gate",
    x: 70,
    y: 35,
    description: "International Departures Gate 4",
    icon: <Navigation className="w-4 h-4" />,
  },

  // Baggage Areas
  {
    id: "baggage-claim-1",
    name: "Baggage Claim 1",
    type: "baggage",
    x: 25,
    y: 55,
    description: "International Arrivals Baggage Claim",
    icon: <Luggage className="w-4 h-4" />,
  },
  {
    id: "baggage-claim-2",
    name: "Baggage Claim 2",
    type: "baggage",
    x: 75,
    y: 55,
    description: "Domestic Arrivals Baggage Claim",
    icon: <Luggage className="w-4 h-4" />,
  },
  {
    id: "baggage-screening",
    name: "Baggage Screening",
    type: "baggage",
    x: 50,
    y: 25,
    description: "Security Baggage Screening Area",
    icon: <Luggage className="w-4 h-4" />,
  },

  // Services
  {
    id: "check-in",
    name: "Check-in Counters",
    type: "service",
    x: 50,
    y: 65,
    description: "Airline Check-in Counters",
    icon: <Info className="w-4 h-4" />,
  },
  {
    id: "security",
    name: "Security Checkpoint",
    type: "service",
    x: 50,
    y: 50,
    description: "Passenger Security Screening",
    icon: <Info className="w-4 h-4" />,
  },
  {
    id: "immigration",
    name: "Immigration",
    type: "service",
    x: 40,
    y: 45,
    description: "Immigration and Passport Control",
    icon: <Info className="w-4 h-4" />,
  },
  {
    id: "customs",
    name: "Customs",
    type: "service",
    x: 60,
    y: 60,
    description: "Customs Declaration and Inspection",
    icon: <Info className="w-4 h-4" />,
  },

  // Restaurants & Shops
  {
    id: "restaurant-1",
    name: "Pearl Restaurant",
    type: "restaurant",
    x: 20,
    y: 40,
    description: "International cuisine restaurant",
    icon: <Utensils className="w-4 h-4" />,
  },
  {
    id: "restaurant-2",
    name: "Uganda Coffee House",
    type: "restaurant",
    x: 80,
    y: 40,
    description: "Local coffee and light meals",
    icon: <Coffee className="w-4 h-4" />,
  },
  {
    id: "shop-1",
    name: "Duty Free Shop",
    type: "shop",
    x: 45,
    y: 30,
    description: "Duty-free shopping for departing passengers",
    icon: <Info className="w-4 h-4" />,
  },
  {
    id: "shop-2",
    name: "Souvenir Shop",
    type: "shop",
    x: 55,
    y: 30,
    description: "Uganda souvenirs and gifts",
    icon: <Info className="w-4 h-4" />,
  },

  // Parking
  {
    id: "parking-1",
    name: "Short-term Parking",
    type: "parking",
    x: 15,
    y: 70,
    description: "Short-term vehicle parking",
    icon: <Car className="w-4 h-4" />,
  },
  {
    id: "parking-2",
    name: "Long-term Parking",
    type: "parking",
    x: 85,
    y: 70,
    description: "Long-term vehicle parking",
    icon: <Car className="w-4 h-4" />,
  },
];

const locationTypeColors = {
  terminal: "bg-blue-600 border-blue-700",
  gate: "bg-green-600 border-green-700",
  baggage: "bg-purple-600 border-purple-700",
  restaurant: "bg-orange-600 border-orange-700",
  shop: "bg-pink-600 border-pink-700",
  service: "bg-gray-600 border-gray-700",
  parking: "bg-yellow-600 border-yellow-700",
};

interface EntebbeAirportMapProps {
  highlightBaggageAreas?: boolean;
  className?: string;
}

export default function EntebbeAirportMap({
  highlightBaggageAreas = false,
  className = "",
}: EntebbeAirportMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(
    null
  );
  const [filterType, setFilterType] = useState<string>("all");

  const filteredLocations =
    filterType === "all"
      ? mapLocations
      : mapLocations.filter((loc) => loc.type === filterType);

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <MapPin className="h-6 w-6 mr-2 text-blue-600" />
          Entebbe International Airport Map
        </h2>
        <p className="text-gray-600">
          Navigate the airport easily with our interactive map
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="mb-4 flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={filterType === "all" ? "primary" : "outline"}
          onClick={() => setFilterType("all")}
          className="text-xs"
        >
          All Locations
        </Button>
        <Button
          size="sm"
          variant={filterType === "baggage" ? "primary" : "outline"}
          onClick={() => setFilterType("baggage")}
          className="text-xs bg-purple-600 hover:bg-purple-700"
        >
          <Luggage className="w-3 h-3 mr-1" />
          Baggage Areas
        </Button>
        <Button
          size="sm"
          variant={filterType === "gate" ? "primary" : "outline"}
          onClick={() => setFilterType("gate")}
          className="text-xs bg-green-600 hover:bg-green-700"
        >
          Gates
        </Button>
        <Button
          size="sm"
          variant={filterType === "restaurant" ? "primary" : "outline"}
          onClick={() => setFilterType("restaurant")}
          className="text-xs bg-orange-600 hover:bg-orange-700"
        >
          <Utensils className="w-3 h-3 mr-1" />
          Dining
        </Button>
        <Button
          size="sm"
          variant={filterType === "service" ? "primary" : "outline"}
          onClick={() => setFilterType("service")}
          className="text-xs bg-gray-600 hover:bg-gray-700"
        >
          Services
        </Button>
      </div>

      {/* Map Container */}
      <div className="relative bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border-2 border-gray-200 aspect-[4/3] overflow-hidden">
        {/* Airport Runways (background) */}
        <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-400 transform -translate-y-1/2 opacity-30"></div>
        <div className="absolute top-1/3 left-1/4 right-1/4 h-1 bg-gray-400 transform -translate-y-1/2 opacity-20"></div>

        {/* Terminal Building Outline */}
        <div className="absolute left-1/4 top-1/4 right-1/4 bottom-1/3 bg-gray-100 border-2 border-gray-300 rounded-lg opacity-20"></div>

        {/* Map Locations */}
        {filteredLocations.map((location) => (
          <div
            key={location.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-110 ${
              highlightBaggageAreas && location.type === "baggage"
                ? "animate-pulse"
                : ""
            }`}
            style={{ left: `${location.x}%`, top: `${location.y}%` }}
            onClick={() => setSelectedLocation(location)}
          >
            <div
              className={`w-8 h-8 rounded-full border-2 text-white flex items-center justify-center shadow-lg ${
                locationTypeColors[location.type]
              } ${
                selectedLocation?.id === location.id
                  ? "ring-4 ring-blue-300"
                  : ""
              }`}
            >
              {location.icon}
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
              <div className="bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                {location.name}
              </div>
            </div>
          </div>
        ))}

        {/* Compass */}
        <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg">
          <div className="w-8 h-8 flex items-center justify-center">
            <div className="text-xs font-bold">N</div>
            <div className="absolute w-4 h-4 border-t-2 border-gray-600 transform rotate-45"></div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
        {Object.entries(locationTypeColors).map(([type, colorClass]) => (
          <div key={type} className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${colorClass}`}></div>
            <span className="capitalize">{type}</span>
          </div>
        ))}
      </div>

      {/* Location Details */}
      {selectedLocation && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 flex items-center">
            {selectedLocation.icon}
            <span className="ml-2">{selectedLocation.name}</span>
          </h3>
          <p className="text-blue-700 text-sm mt-1">
            {selectedLocation.description}
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSelectedLocation(null)}
            className="mt-2 text-xs"
          >
            Close
          </Button>
        </div>
      )}
    </div>
  );
}
