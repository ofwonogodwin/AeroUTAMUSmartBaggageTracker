'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Button } from '@/components/ui/Button'
import AccountDropdown from '@/components/AccountDropdown'
import {
  Plane,
  QrCode,
  Shield,
  Users,
  CheckCircle,
  MapPin,
  ArrowRight
} from 'lucide-react'

export default function Home() {
  const { isLoading, isAuthenticated, user } = useAuth()

  if (isLoading) {
    return <LoadingSpinner size="lg" className="min-h-screen" />
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Plane className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                Smart Baggage Tracker
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/track">
                <Button size="sm" variant="outline">Track Baggage</Button>
              </Link>

              <AccountDropdown />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Track Your Baggage
              <span className="text-blue-600"> In Real-Time</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {isAuthenticated 
                ? `Welcome back${user?.first_name ? `, ${user.first_name}` : ''}! Track your baggage in real-time at Entebbe International Airport.`
                : 'Experience seamless baggage tracking at Entebbe International Airport. Know exactly where your luggage is from check-in to arrival.'
              }
            </p>

            {isAuthenticated && (
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Link href="/track">
                  <Button size="lg" className="flex items-center space-x-2">
                    <QrCode className="h-5 w-5" />
                    <span>Track Your Baggage</span>
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                {user?.is_staff_member && (
                  <Link href="/staff">
                    <Button size="lg" variant="outline" className="flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>Staff Dashboard</span>
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Floating animation */}
        <div className="absolute top-20 left-10 animate-bounce">
          <Plane className="h-12 w-12 text-blue-400 opacity-20" />
        </div>
        <div className="absolute top-32 right-20 animate-pulse">
          <QrCode className="h-8 w-8 text-gold opacity-30" />
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Simple, secure, and real-time baggage tracking
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Check-In
              </h3>
              <p className="text-gray-600">
                Get your unique QR code when you check in your baggage
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Security Check
              </h3>
              <p className="text-gray-600">
                Track your baggage through security screening
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Plane className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                In-Flight
              </h3>
              <p className="text-gray-600">
                Monitor your baggage during the flight journey
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Arrival
              </h3>
              <p className="text-gray-600">
                Get notified when your baggage arrives at destination
              </p>
            </div>
          </div>
        </div>
      </div>


      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Plane className="h-6 w-6" />
            <span className="text-lg font-semibold">Smart Baggage Tracker</span>
          </div>
          <p className="text-gray-400">
            Entebbe International Airport • Hackathon 2025
          </p>
        </div>
      </footer>
    </div>
  )
}
