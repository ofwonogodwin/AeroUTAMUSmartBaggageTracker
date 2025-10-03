"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/FormElements";
import SignOutButton from "@/components/SignOutButton";
import { baggageAPI } from "@/lib/api";
import { Baggage } from "@/types";

import {
  Plane,
  QrCode,
  Shield,
  MapPin,
  ArrowRight,
  Luggage,
  Search,
  CheckCircle,
  Users,
} from "lucide-react";

export default function Home() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<Baggage | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  // Handle baggage search
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!searchQuery.trim()) {
      setSearchError("Please enter a QR code or baggage ID");
      return;
    }

    setIsSearching(true);
    setSearchError("");
    setSearchResult(null);

    try {
      // Try to search by QR code first
      const result = await baggageAPI.getByQrCode(searchQuery.trim());
      setSearchResult(result);
    } catch {
      // If QR code search fails, try searching in the general baggage list
      try {
        const searchResults = await baggageAPI.getAll({
          search: searchQuery.trim(),
        });
        if (searchResults.results && searchResults.results.length > 0) {
          setSearchResult(searchResults.results[0]);
        } else {
          setSearchError("No baggage found with that ID or QR code");
        }
      } catch {
        setSearchError(
          "Baggage not found. Please check your ID or QR code and try again."
        );
      }
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search from SearchInput component
  const handleSearchFromInput = (value: string) => {
    setSearchQuery(value);
    handleSearch();
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" className="min-h-screen" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Luggage className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  AERO UTAMU
                </h1>
                <p className="text-xs text-gray-500">Smart Baggage Tracker</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/track"
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                Track Baggage
              </Link>
              <Link
                href="/map"
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                Airport Map
              </Link>
              <Link
                href="/support"
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                Support
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              {/* Debug info - remove after testing */}
              {process.env.NODE_ENV === "development" && (
                <div className="text-xs bg-yellow-100 p-1 rounded">
                  Auth: {isAuthenticated ? "Yes" : "No"} | User:{" "}
                  {user ? user.username : "None"}
                </div>
              )}

              {isAuthenticated && user ? (
                <SignOutButton variant="full" />
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-blue-600"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-20 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
            Track your baggage
            <br />
            <span className="text-blue-600">anywhere, anytime</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {isAuthenticated
              ? `Welcome back, ${
                  user?.first_name || "traveler"
                }! Track your luggage in real-time across Entebbe International Airport and beyond.`
              : "Real-time baggage tracking from Entebbe International Airport. Know exactly where your luggage is, from check-in to baggage claim."}
          </p>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
            {isAuthenticated ? (
              <>
                <Link href="/track">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 px-8 py-3"
                  >
                    <QrCode className="h-5 w-5 mr-2" />
                    Track My Baggage
                  </Button>
                </Link>
                <Link href="/map">
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 py-3 border-purple-200 text-purple-600 hover:bg-purple-50"
                  >
                    <MapPin className="h-5 w-5 mr-2" />
                    Airport Map
                  </Button>
                </Link>
                {user?.is_staff_member && (
                  <Link href="/staff">
                    <Button
                      size="lg"
                      variant="outline"
                      className="px-8 py-3 border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      <Users className="h-5 w-5 mr-2" />
                      Staff Dashboard
                    </Button>
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link href="/track">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 px-8 py-3"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    Track Baggage
                  </Button>
                </Link>
                <Link href="/map">
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 py-3 border-purple-200 text-purple-600 hover:bg-purple-50"
                  >
                    <MapPin className="h-5 w-5 mr-2" />
                    Airport Map
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Sign In
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Quick Track Section */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mb-16 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Track
            </h3>
            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row gap-3"
            >
              <div className="flex-1">
                <SearchInput
                  type="text"
                  placeholder="Enter QR code or baggage ID"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onSearch={handleSearchFromInput}
                  isLoading={isSearching}
                />
              </div>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3"
                disabled={isSearching || !searchQuery.trim()}
              >
                {isSearching ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                  <Search className="h-5 w-5 mr-2" />
                )}
                {isSearching ? "Searching..." : "Track"}
              </Button>
            </form>

            {/* Search Results */}
            {searchError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{searchError}</p>
              </div>
            )}

            {searchResult && (
              <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-green-800 mb-1">
                      Baggage Found! 🎉
                    </h4>
                    <p className="text-green-600 text-sm">
                      ID: {searchResult.id}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      searchResult.current_status === "ARRIVED"
                        ? "bg-green-100 text-green-800"
                        : searchResult.current_status === "IN_FLIGHT"
                        ? "bg-blue-100 text-blue-800"
                        : searchResult.current_status === "LOADED"
                        ? "bg-purple-100 text-purple-800"
                        : searchResult.current_status === "SECURITY_CLEARED"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {searchResult.current_status_display}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Passenger</p>
                    <p className="font-medium text-gray-900">
                      {searchResult.passenger_name}
                    </p>
                  </div>
                  {searchResult.flight_number && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Flight</p>
                      <p className="font-medium text-gray-900">
                        {searchResult.flight_number}
                      </p>
                    </div>
                  )}
                  {searchResult.destination && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Destination</p>
                      <p className="font-medium text-gray-900">
                        {searchResult.destination}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Last Updated</p>
                    <p className="font-medium text-gray-900">
                      {new Date(searchResult.updated_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-green-200">
                  <Link href={`/track?id=${searchResult.id}`}>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      <MapPin className="h-4 w-4 mr-2" />
                      View Full Tracking Details
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="pb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why choose AERO UTAMU?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional baggage tracking with real-time updates and 24/7
              monitoring
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <QrCode className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                QR Code Scanning
              </h3>
              <p className="text-gray-600">
                Scan QR codes instantly with your camera or upload images for
                quick baggage identification.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Real-time Tracking
              </h3>
              <p className="text-gray-600">
                Monitor your baggage location and status updates in real-time
                from check-in to arrival.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Secure & Reliable
              </h3>
              <p className="text-gray-600">
                Industry-standard security with 99.9% uptime ensuring your
                baggage data is always protected.
              </p>
            </div>

            {/* Feature 4 - Airport Map */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plane className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Interactive Airport Map
              </h3>
              <p className="text-gray-600">
                Navigate Entebbe Airport easily with our interactive map showing
                gates, baggage areas, and services.
              </p>
            </div>
          </div>
        </div>

        {/* Status Updates Section */}
        <div className="pb-20">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 sm:p-12">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Stay updated at every step
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Get real-time notifications about your baggage status
              </p>

              <div className="grid sm:grid-cols-4 gap-4 text-center">
                <div className="bg-white p-4 rounded-xl">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">
                    Checked In
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl">
                  <Shield className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">
                    Security Cleared
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl">
                  <Plane className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">In Flight</p>
                </div>
                <div className="bg-white p-4 rounded-xl">
                  <MapPin className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Arrived</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Luggage className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    AERO UTAMU
                  </h3>
                  <p className="text-sm text-gray-500">Smart Baggage Tracker</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Professional baggage tracking services for Entebbe International
                Airport. Real-time monitoring with industry-leading accuracy.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Services</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link href="/track" className="hover:text-blue-600">
                    Track Baggage
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:text-blue-600">
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Account</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link href="/login" className="hover:text-blue-600">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-blue-600">
                    Register
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-gray-500">
              © 2025 AERO UTAMU Smart Baggage Tracker. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
