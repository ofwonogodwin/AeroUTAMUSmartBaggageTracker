"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import AccountDropdown from "@/components/AccountDropdown";
import {
  Plane,
  QrCode,
  Shield,
  MapPin,
  ArrowRight,
  Clock,
  Luggage,
  Search,
  CheckCircle,
  Users,
} from "lucide-react";

export default function Home() {
  const { isLoading, isAuthenticated, user } = useAuth();

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
                href="/support"
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                Support
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              {isAuthenticated && user ? (
                <AccountDropdown />
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
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Enter QR code or baggage ID"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 px-6 py-3">
                <Search className="h-5 w-5 mr-2" />
                Track
              </Button>
            </div>
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

          <div className="grid md:grid-cols-3 gap-8">
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
