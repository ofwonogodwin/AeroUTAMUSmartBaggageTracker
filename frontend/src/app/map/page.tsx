"use client";

import Navigation from "@/components/Navigation";
import EntebbeAirportMapV2 from "@/components/EntebbeAirportMapV2";
import {
  MapPin,
  Navigation as NavigationIcon,
  Info,
  Satellite,
} from "lucide-react";

export default function AirportMapPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation title="Airport Navigation" showTrackButton={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <MapPin className="h-12 w-12 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Airport Navigation
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Find your way around Entebbe International Airport with our
            interactive map. Locate gates, baggage claim areas, restaurants,
            shops, and essential services.
          </p>
        </div>

        {/* Quick Tips */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8 border border-blue-200">
          <h2 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
            <Info className="h-5 w-5 mr-2" />
            Navigation Tips
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <strong>• Find Baggage:</strong> Use the &ldquo;Baggage
              Areas&rdquo; filter to quickly locate baggage claim and screening
              areas
            </div>
            <div>
              <strong>• Dining Options:</strong> Click &ldquo;Dining&rdquo; to
              see all restaurants and coffee shops
            </div>
            <div>
              <strong>• Gate Information:</strong> Gates are color-coded in
              green for easy identification
            </div>
            <div>
              <strong>• Click Markers:</strong> Tap any location marker for
              detailed information
            </div>
          </div>
        </div>

        {/* Interactive Google Map */}
        <EntebbeAirportMapV2 height="70vh" />

        {/* Airport Information */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <NavigationIcon className="h-5 w-5 mr-2 text-blue-600" />
              Getting Around
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                • Terminal building connects all departure and arrival gates
              </li>
              <li>
                • Security checkpoint is centrally located for all passengers
              </li>
              <li>
                • Immigration and customs are separate for international flights
              </li>
              <li>• Moving walkways available on main corridors</li>
              <li>• Accessible facilities available throughout the terminal</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Info className="h-5 w-5 mr-2 text-blue-600" />
              Airport Services
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Free WiFi available throughout the terminal</li>
              <li>• Currency exchange services near check-in counters</li>
              <li>• Medical center located on the ground floor</li>
              <li>• Lost & found office near baggage claim</li>
              <li>• Prayer room available for all faiths</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Satellite className="h-5 w-5 mr-2 text-blue-600" />
              Map Features
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Real-time satellite and street view imagery</li>
              <li>• Interactive markers for all key locations</li>
              <li>• Filter locations by type (terminals, dining, etc.)</li>
              <li>• Click markers for detailed information</li>
              <li>• Fullscreen mode for better navigation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
