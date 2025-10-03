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
  Bell,
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
                <h1 className="text-xl font-semibold text-gray-900">AERO UTAMU</h1>
                <p className="text-xs text-gray-500">Smart Baggage Tracker</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/track" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Track Baggage
              </Link>
              <Link href="/support" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Support
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <AccountDropdown />
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
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
              ? `Welcome back, ${user?.first_name || 'traveler'}! Track your luggage in real-time across Entebbe International Airport and beyond.`
              : "Real-time baggage tracking from Entebbe International Airport. Know exactly where your luggage is, from check-in to baggage claim."}
          </p>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
            {isAuthenticated ? (
              <>
                <Link href="/track">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-3">
                    <QrCode className="h-5 w-5 mr-2" />
                    Track My Baggage
                  </Button>
                </Link>
                {user?.is_staff_member && (
                  <Link href="/staff">
                    <Button size="lg" variant="outline" className="px-8 py-3 border-blue-200 text-blue-600 hover:bg-blue-50">
                      <Users className="h-5 w-5 mr-2" />
                      Staff Dashboard
                    </Button>
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link href="/track">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-3">
                    <Search className="h-5 w-5 mr-2" />
                    Track Baggage
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="px-8 py-3 border-gray-300 text-gray-700 hover:bg-gray-50">
                    Sign In
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Quick Track Section */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mb-16 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Track</h3>
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
              Professional baggage tracking with real-time updates and 24/7 monitoring
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
                Scan QR codes instantly with your camera or upload images for quick baggage identification.
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
                Monitor your baggage location and status updates in real-time from check-in to arrival.
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
                Industry-standard security with 99.9% uptime ensuring your baggage data is always protected.
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
                  <p className="text-sm font-medium text-gray-900">Checked In</p>
                </div>
                <div className="bg-white p-4 rounded-xl">
                  <Shield className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Security Cleared</p>
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
                  <h3 className="text-lg font-semibold text-gray-900">AERO UTAMU</h3>
                  <p className="text-sm text-gray-500">Smart Baggage Tracker</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Professional baggage tracking services for Entebbe International Airport. 
                Real-time monitoring with industry-leading accuracy.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Services</h4>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/track" className="hover:text-blue-600">Track Baggage</Link></li>
                <li><Link href="/support" className="hover:text-blue-600">Support</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Account</h4>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/login" className="hover:text-blue-600">Sign In</Link></li>
                <li><Link href="/register" className="hover:text-blue-600">Register</Link></li>
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
  );
}
          <div
            className="w-96 h-96 border border-blue-400/20 rounded-full animate-spin"
            style={{ animationDuration: "20s" }}
          ></div>
          <div
            className="absolute w-80 h-80 border border-blue-300/10 rounded-full animate-spin"
            style={{ animationDuration: "15s", animationDirection: "reverse" }}
          ></div>
          <div
            className="absolute w-64 h-64 border border-blue-500/30 rounded-full animate-spin"
            style={{ animationDuration: "10s" }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative">
          <div className="text-center">
            {/* Mission Control Style Header */}
            <div className="mb-6">
              <div className="inline-flex items-center px-4 py-2 bg-blue-900/50 border border-blue-400/30 rounded-full backdrop-blur-sm mb-4">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse mr-3"></div>
                <span className="text-blue-200 text-sm font-mono tracking-wider">
                  SYSTEM OPERATIONAL
                </span>
              </div>
            </div>

            <h1 className="text-5xl sm:text-7xl font-black text-white mb-8 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 bg-clip-text text-transparent">
                MISSION CONTROL
              </span>
              <br />
              <span className="text-white">FOR YOUR</span>
              <br />
              <span className="text-gold animate-pulse">LUGGAGE</span>
            </h1>

            <p className="text-xl text-blue-100 mb-12 max-w-4xl mx-auto font-light leading-relaxed">
              {isAuthenticated
                ? `Welcome back to Ground Control${
                    user?.first_name ? `, Commander ${user.first_name}` : ""
                  }! Your baggage is under satellite surveillance across Entebbe International's aerospace network.`
                : "Welcome to the future of luggage tracking. Our aerospace-grade technology ensures your belongings are monitored with NASA-level precision from Entebbe International Airport to any destination across the galaxy."}
            </p>

            {/* Interactive Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-16">
              {isAuthenticated ? (
                <>
                  <Link href="/track">
                    <Button
                      size="lg"
                      className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-4 text-lg font-semibold shadow-2xl transform hover:scale-105 transition-all duration-300"
                    >
                      <QrCode className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform" />
                      <span>Launch Tracking</span>
                      <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  {user?.is_staff_member && (
                    <Link href="/staff">
                      <Button
                        size="lg"
                        className="group bg-gold/90 hover:bg-gold text-black px-8 py-4 text-lg font-semibold backdrop-blur-sm border border-gold/50 transform hover:scale-105 transition-all duration-300"
                      >
                        <Users className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform" />
                        <span>Mission Control</span>
                      </Button>
                    </Link>
                  )}
                </>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/login">
                    <Button
                      size="lg"
                      className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-4 text-lg font-semibold shadow-2xl transform hover:scale-105 transition-all duration-300"
                    >
                      <Zap className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform" />
                      <span>Begin Mission</span>
                      <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/track">
                    <Button
                      size="lg"
                      variant="outline"
                      className="group bg-black/50 border-blue-400/50 text-blue-300 hover:bg-blue-900/30 px-8 py-4 text-lg font-semibold backdrop-blur-sm transform hover:scale-105 transition-all duration-300"
                    >
                      <Navigation className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform" />
                      <span>Quick Scan</span>
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Floating spacecraft elements */}
            <div
              className="absolute top-1/4 left-1/4 animate-bounce"
              style={{ animationDuration: "3s" }}
            >
              <div className="relative">
                <Plane className="h-16 w-16 text-blue-400/40 transform rotate-45" />
                <div className="absolute top-0 right-0 h-2 w-2 bg-blue-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div
              className="absolute top-1/3 right-1/4 animate-pulse"
              style={{ animationDuration: "2s" }}
            >
              <QrCode className="h-12 w-12 text-gold/30" />
            </div>
            <div
              className="absolute bottom-1/4 left-1/3 animate-spin"
              style={{ animationDuration: "8s" }}
            >
              <Globe className="h-10 w-10 text-purple-400/30" />
            </div>
          </div>
        </div>
      </div>

      {/* Mission Operations Section */}
      <div className="relative z-20 bg-gradient-to-b from-black via-slate-900 to-black py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-24">
            <div className="inline-flex items-center px-6 py-3 bg-blue-900/30 border border-blue-400/30 rounded-full backdrop-blur-sm mb-6">
              <Clock className="h-5 w-5 text-blue-400 mr-3" />
              <span className="text-blue-200 font-mono tracking-wider">
                MISSION PROTOCOL
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
              <span className="text-blue-400">AEROSPACE</span> TRACKING SYSTEM
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto font-light">
              Military-grade precision meets commercial aviation. Your luggage
              journey tracked with satellite accuracy.
            </p>
          </div>

          {/* Mission Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Phase 1 - Launch */}
            <div className="group text-center transform hover:scale-105 transition-all duration-500">
              <div className="relative mb-6">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto shadow-2xl group-hover:shadow-blue-500/25 transition-all duration-300">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 h-6 w-6 bg-green-400 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-black">1</span>
                </div>
                {/* Connection line */}
                <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-blue-400 to-transparent"></div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                LAUNCH SEQUENCE
              </h3>
              <p className="text-blue-200 font-light leading-relaxed">
                Baggage enters our tracking matrix with quantum-encrypted QR
                identification
              </p>
            </div>

            {/* Phase 2 - Security */}
            <div className="group text-center transform hover:scale-105 transition-all duration-500">
              <div className="relative mb-6">
                <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto shadow-2xl group-hover:shadow-yellow-500/25 transition-all duration-300">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 h-6 w-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-black">2</span>
                </div>
                {/* Connection line */}
                <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-yellow-400 to-transparent"></div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                SECURITY CLEARANCE
              </h3>
              <p className="text-blue-200 font-light leading-relaxed">
                Advanced screening protocols with real-time status broadcasting
                to your device
              </p>
            </div>

            {/* Phase 3 - Orbital */}
            <div className="group text-center transform hover:scale-105 transition-all duration-500">
              <div className="relative mb-6">
                <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto shadow-2xl group-hover:shadow-purple-500/25 transition-all duration-300">
                  <Plane className="h-10 w-10 text-white transform rotate-45" />
                </div>
                <div className="absolute -top-2 -right-2 h-6 w-6 bg-purple-400 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">3</span>
                </div>
                {/* Connection line */}
                <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-purple-400 to-transparent"></div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                ORBITAL TRANSIT
              </h3>
              <p className="text-blue-200 font-light leading-relaxed">
                Live satellite tracking during flight with atmospheric condition
                monitoring
              </p>
            </div>

            {/* Phase 4 - Landing */}
            <div className="group text-center transform hover:scale-105 transition-all duration-500">
              <div className="relative mb-6">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto shadow-2xl group-hover:shadow-green-500/25 transition-all duration-300">
                  <MapPin className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 h-6 w-6 bg-green-400 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-black">4</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">
                TOUCHDOWN CONFIRMED
              </h3>
              <p className="text-blue-200 font-light leading-relaxed">
                Instant arrival notifications with precise carousel location
                coordinates
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-blue-900/20 border border-blue-400/20 rounded-2xl backdrop-blur-sm">
              <div className="text-4xl font-black text-gold mb-2">99.8%</div>
              <div className="text-blue-200 font-light">Tracking Accuracy</div>
            </div>
            <div className="text-center p-8 bg-purple-900/20 border border-purple-400/20 rounded-2xl backdrop-blur-sm">
              <div className="text-4xl font-black text-purple-400 mb-2">
                &lt; 2s
              </div>
              <div className="text-blue-200 font-light">Update Latency</div>
            </div>
            <div className="text-center p-8 bg-green-900/20 border border-green-400/20 rounded-2xl backdrop-blur-sm">
              <div className="text-4xl font-black text-green-400 mb-2">
                24/7
              </div>
              <div className="text-blue-200 font-light">Mission Control</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Control Footer */}
      <footer className="relative z-20 bg-black border-t border-blue-800/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Mission Logo */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="relative">
                <Plane className="h-12 w-12 text-blue-400 transform rotate-45" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-gold rounded-full animate-pulse"></div>
              </div>
              <div>
                <div className="text-3xl font-black text-white tracking-tight">
                  AERO<span className="text-blue-400">UTAMU</span>
                </div>
                <div className="text-sm text-blue-300 font-mono tracking-widest">
                  MISSION CONTROL SYSTEMS
                </div>
              </div>
            </div>

            {/* Mission Status */}
            <div className="flex justify-center items-center space-x-8 mb-8">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-mono text-sm">
                  ALL SYSTEMS OPERATIONAL
                </span>
              </div>
              <div className="text-blue-400 font-mono text-sm">
                UPTIME: 99.8%
              </div>
            </div>

            {/* Location & Attribution */}
            <div className="text-center space-y-2">
              <p className="text-blue-200 font-light">
                <span className="text-gold font-semibold">
                  Entebbe International Airport
                </span>{" "}
                • Uganda&apos;s Gateway to the Stars
              </p>
              <p className="text-blue-400/60 text-sm font-mono">
                HACKATHON 2025 • BUILT BY HUMANS, FOR HUMANS
              </p>
              <div className="flex justify-center items-center space-x-4 mt-4 text-xs text-blue-400/40">
                <span>LAT: 0.0464°N</span>
                <span>•</span>
                <span>LONG: 32.4419°E</span>
                <span>•</span>
                <span>ALT: 1,155m</span>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="mt-8 flex justify-center space-x-4 opacity-30">
              <Star className="h-4 w-4 text-blue-400 animate-pulse" />
              <Star
                className="h-3 w-3 text-purple-400 animate-pulse"
                style={{ animationDelay: "0.5s" }}
              />
              <Star
                className="h-5 w-5 text-gold animate-pulse"
                style={{ animationDelay: "1s" }}
              />
              <Star
                className="h-3 w-3 text-blue-300 animate-pulse"
                style={{ animationDelay: "1.5s" }}
              />
              <Star
                className="h-4 w-4 text-purple-300 animate-pulse"
                style={{ animationDelay: "2s" }}
              />
            </div>
          </div>
        </div>

        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          ></div>
        </div>
      </footer>
    </div>
  );
}
