"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<Baggage | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  // Immediately redirect unauthenticated users to login
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        console.log(
          "User not authenticated, redirecting to login immediately..."
        );
        router.replace("/login");
      } else {
        console.log("User is authenticated, showing main page");
      }
    }
  }, [isLoading, isAuthenticated, router]);

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
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #faf8f6 0%, #f7f5f3 100%)",
      }}
    >
      {/* Uganda Airlines Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-stone-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg shadow-md">
                <Luggage className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-stone-800">
                  AERO UTAMU
                </h1>
                <p className="text-xs text-amber-600 font-medium">
                  Smart Baggage Tracker
                </p>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/track"
                className="text-stone-600 hover:text-blue-600 font-medium transition-all duration-200 hover:scale-105"
              >
                Track Baggage
              </Link>

              <Link
                href="/support"
                className="text-stone-600 hover:text-blue-600 font-medium transition-all duration-200 hover:scale-105"
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
          <h1 className="text-4xl sm:text-6xl font-bold text-stone-800 mb-6">
            Track your baggage
            <br />
            <span className="text-stone-700">anywhere, anytime</span>
          </h1>

          <p className="text-xl text-stone-600 mb-8 max-w-3xl mx-auto leading-relaxed">
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
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  >
                    <QrCode className="h-5 w-5 mr-2" />
                    Track My Baggage
                  </Button>
                </Link>
                {user?.is_staff_member && (
                  <Link href="/staff">
                    <Button
                      size="lg"
                      variant="outline"
                      className="px-8 py-3 border-stone-300 text-stone-700 hover:bg-stone-50 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
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
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    Track Baggage
                  </Button>
                </Link>

                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 py-3 border-stone-300 text-stone-700 hover:bg-stone-50 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                  >
                    Sign In
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Quick Track Section */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-stone-200 mb-16 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-stone-800 mb-4">
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
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-6 py-3 shadow-md hover:shadow-lg transition-all duration-200"
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
              <div className="mt-4 p-4 bg-red-50 border border-red-300 rounded-lg">
                <p className="text-red-700 text-sm">{searchError}</p>
              </div>
            )}

            {searchResult && (
              <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-300 rounded-lg shadow-md">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-green-800 mb-1">
                      Baggage Found! 🎉
                    </h4>
                    <p className="text-green-700 text-sm font-medium">
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
                    <p className="text-sm text-stone-600 mb-1">Passenger</p>
                    <p className="font-medium text-stone-800">
                      {searchResult.passenger_name}
                    </p>
                  </div>
                  {searchResult.flight_number && (
                    <div>
                      <p className="text-sm text-stone-600 mb-1">Flight</p>
                      <p className="font-medium text-stone-800">
                        {searchResult.flight_number}
                      </p>
                    </div>
                  )}
                  {searchResult.destination && (
                    <div>
                      <p className="text-sm text-stone-600 mb-1">Destination</p>
                      <p className="font-medium text-stone-800">
                        {searchResult.destination}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-stone-600 mb-1">Last Updated</p>
                    <p className="font-medium text-stone-800">
                      {new Date(searchResult.updated_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-green-200">
                  <Link href={`/track?id=${searchResult.id}`}>
                    <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all duration-200">
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
            <h2 className="text-3xl font-bold text-stone-800 mb-4">
              Why choose AERO UTAMU?
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Professional baggage tracking with real-time updates and 24/7
              monitoring from Uganda&apos;s premier airline
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-stone-200 text-center hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                <QrCode className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-stone-800 mb-4">
                QR Code Scanning
              </h3>
              <p className="text-stone-600">
                Scan QR codes instantly with your camera or upload images for
                quick baggage identification.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-stone-200 text-center hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="bg-gradient-to-br from-green-100 to-emerald-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                <MapPin className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-stone-800 mb-4">
                Real-time Tracking
              </h3>
              <p className="text-stone-600">
                Monitor your baggage location and status updates in real-time
                from check-in to arrival.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-stone-200 text-center hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="bg-gradient-to-br from-amber-100 to-yellow-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                <Shield className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-stone-800 mb-4">
                Secure & Reliable
              </h3>
              <p className="text-stone-600">
                Industry-standard security with 99.9% uptime ensuring your
                baggage data is always protected.
              </p>
            </div>

            {/* Feature 4 - Airport Map */}
          </div>
        </div>

        {/* Status Updates Section */}
        <div className="pb-20">
          <div className="bg-gradient-to-r from-blue-50/70 to-amber-50/70 rounded-3xl p-8 sm:p-12 border border-stone-200/50 shadow-lg">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-stone-800 mb-6">
                Stay updated at every step
              </h2>
              <p className="text-lg text-stone-600 mb-8">
                Get real-time notifications about your baggage status throughout
                your journey
              </p>

              <div className="grid sm:grid-cols-4 gap-4 text-center">
                <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-stone-800">
                    Checked In
                  </p>
                </div>
                <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
                  <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-stone-800">
                    Security Cleared
                  </p>
                </div>
                <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
                  <Plane className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-stone-800">
                    In Flight
                  </p>
                </div>
                <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
                  <MapPin className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-stone-800">Arrived</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/90 backdrop-blur-sm border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg shadow-md">
                  <Luggage className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-stone-800">
                    AERO UTAMU
                  </h3>
                  <p className="text-sm text-amber-600 font-medium">
                    Smart Baggage Tracker
                  </p>
                </div>
              </div>
              <p className="text-stone-600 mb-4">
                Professional baggage tracking services for Entebbe International
                Airport. Real-time monitoring with industry-leading accuracy.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-stone-800 mb-4">Services</h4>
              <ul className="space-y-2 text-stone-600">
                <li>
                  <Link
                    href="/track"
                    className="hover:text-blue-600 transition-colors duration-200"
                  >
                    Track Baggage
                  </Link>
                </li>
                <li>
                  <Link
                    href="/support"
                    className="hover:text-blue-600 transition-colors duration-200"
                  >
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-stone-800 mb-4">Account</h4>
              <ul className="space-y-2 text-stone-600">
                <li>
                  <Link
                    href="/login"
                    className="hover:text-blue-600 transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="hover:text-blue-600 transition-colors duration-200"
                  >
                    Register
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-stone-200 mt-8 pt-8 text-center">
            <p className="text-stone-500">
              © 2025 AERO UTAMU Smart Baggage Tracker. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
