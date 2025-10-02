'use client'

import { useState } from 'react'
import Link from 'next/link'
import { baggageAPI } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/FormElements'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { formatDateTime, formatRelativeTime } from '@/lib/utils'
import { Baggage, StatusUpdate } from '@/types'
import {
    Plane,
    QrCode,
    Search,
    MapPin,
    Clock,
    User,
    Mail,
    AlertTriangle
} from 'lucide-react'

export default function TrackBaggagePage() {
    const [qrCode, setQrCode] = useState('')
    const [baggage, setBaggage] = useState<Baggage | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!qrCode.trim()) return

        setIsLoading(true)
        setError('')
        setBaggage(null)

        try {
            const baggageData = await baggageAPI.getByQRCode(qrCode.trim())
            setBaggage(baggageData)
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Baggage not found'
            setError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status.toUpperCase()) {
            case 'CHECKED_IN':
                return <User className="h-5 w-5" />
            case 'SECURITY_CLEARED':
                return <Search className="h-5 w-5" />
            case 'LOADED':
                return <MapPin className="h-5 w-5" />
            case 'IN_FLIGHT':
                return <Plane className="h-5 w-5" />
            case 'ARRIVED':
                return <MapPin className="h-5 w-5" />
            default:
                return <Clock className="h-5 w-5" />
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="flex items-center space-x-2">
                            <Plane className="h-8 w-8 text-blue-600" />
                            <span className="text-xl font-bold text-gray-900">
                                Smart Baggage Tracker
                            </span>
                        </Link>

                        <div className="flex items-center space-x-4">
                            <Link href="/login">
                                <Button size="sm" variant="outline">Login</Button>
                            </Link>
                            <Link href="/register">
                                <Button size="sm">Register</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex justify-center items-center space-x-2 mb-4">
                        <QrCode className="h-12 w-12 text-blue-600" />
                        <h1 className="text-3xl font-bold text-gray-900">Track Your Baggage</h1>
                    </div>
                    <p className="text-lg text-gray-600">
                        Enter your QR code to get real-time updates on your baggage location
                    </p>
                </div>

                {/* Search Form */}
                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                    <form onSubmit={handleSearch} className="space-y-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <Input
                                    label="Baggage QR Code"
                                    type="text"
                                    value={qrCode}
                                    onChange={(e) => setQrCode(e.target.value)}
                                    placeholder="Enter your QR code (e.g., BAG-12345678)"
                                    className="text-lg"
                                />
                            </div>
                            <div className="flex items-end">
                                <Button
                                    type="submit"
                                    size="lg"
                                    isLoading={isLoading}
                                    disabled={!qrCode.trim()}
                                    className="w-full sm:w-auto"
                                >
                                    <Search className="h-5 w-5 mr-2" />
                                    Track Baggage
                                </Button>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                <div className="flex items-center">
                                    <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <LoadingSpinner size="lg" />
                        <p className="text-gray-600 mt-4">Searching for your baggage...</p>
                    </div>
                )}

                {/* Baggage Information */}
                {baggage && (
                    <div className="space-y-8">
                        {/* Baggage Details */}
                        <div className="bg-white rounded-lg shadow-md p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Baggage Details</h2>
                                <StatusBadge status={baggage.current_status} size="lg" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <User className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-600">Passenger</p>
                                            <p className="font-medium">{baggage.passenger_name}</p>
                                        </div>
                                    </div>

                                    {baggage.passenger_email && (
                                        <div className="flex items-center space-x-3">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-600">Email</p>
                                                <p className="font-medium">{baggage.passenger_email}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center space-x-3">
                                        <QrCode className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-600">QR Code</p>
                                            <p className="font-medium font-mono">{baggage.qr_code}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {baggage.flight_number && (
                                        <div className="flex items-center space-x-3">
                                            <Plane className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-600">Flight</p>
                                                <p className="font-medium">{baggage.flight_number}</p>
                                            </div>
                                        </div>
                                    )}

                                    {baggage.destination && (
                                        <div className="flex items-center space-x-3">
                                            <MapPin className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-600">Destination</p>
                                                <p className="font-medium">{baggage.destination}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center space-x-3">
                                        <Clock className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-600">Checked In</p>
                                            <p className="font-medium">{formatDateTime(baggage.created_at)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status Timeline */}
                        <div className="bg-white rounded-lg shadow-md p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Baggage Journey</h2>

                            {baggage.status_timeline && baggage.status_timeline.length > 0 ? (
                                <div className="space-y-6">
                                    {baggage.status_timeline.map((update: StatusUpdate, index: number) => (
                                        <div key={update.id} className="flex items-start space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                                                    {getStatusIcon(update.status)}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <StatusBadge status={update.status} />
                                                    <p className="text-sm text-gray-500">
                                                        {formatRelativeTime(update.timestamp)}
                                                    </p>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {formatDateTime(update.timestamp)}
                                                </p>
                                                {update.location && (
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        📍 {update.location}
                                                    </p>
                                                )}
                                                {update.notes && (
                                                    <p className="text-sm text-gray-700 mt-1">{update.notes}</p>
                                                )}
                                                {update.updated_by_name && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Updated by: {update.updated_by_name}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-600">No status updates available.</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Instructions */}
                {!baggage && !isLoading && (
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">How to Track Your Baggage</h2>
                        <div className="space-y-4 text-gray-600">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                                    1
                                </div>
                                <p>Find your baggage QR code on your check-in receipt or luggage tag</p>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                                    2
                                </div>
                                <p>Enter the QR code in the search box above</p>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                                    3
                                </div>
                                <p>View real-time status updates and location information</p>
                            </div>
                        </div>

                        {/* Sample QR codes for demo */}
                        <div className="mt-8 p-4 bg-gray-50 rounded-md">
                            <h3 className="text-sm font-medium text-gray-900 mb-2">Try these demo QR codes:</h3>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p className="font-mono">BAG-12345678</p>
                                <p className="font-mono">BAG-87654321</p>
                                <p className="font-mono">BAG-ABCD1234</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}