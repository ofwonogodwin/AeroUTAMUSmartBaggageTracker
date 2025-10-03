'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { baggageAPI } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/FormElements'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import QRScanner from '@/components/QRScanner'
import AccountDropdown from '@/components/AccountDropdown'
import { formatDateTime, formatRelativeTime } from '@/lib/utils'
import {
    Plane,
    QrCode,
    Search,
    User,
    MapPin,
    Clock,
    ChevronRight,
    AlertCircle,
    CheckCircle
} from 'lucide-react'
import { Baggage } from '@/types'

export default function TrackPage() {
    const { isAuthenticated, user, isLoading: authLoading } = useAuth()
    const [trackingCode, setTrackingCode] = useState('')
    const [baggage, setBaggage] = useState<Baggage | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [showScanner, setShowScanner] = useState(false)

    const handleSearch = async (qrCode?: string) => {
        const codeToSearch = qrCode || trackingCode
        if (!codeToSearch.trim()) {
            setError('Please enter a tracking code')
            return
        }

        setIsLoading(true)
        setError('')
        setBaggage(null)

        try {
            const result = await baggageAPI.getByQrCode(codeToSearch.trim())
            setBaggage(result)
        } catch (err: any) {
            setError(err.response?.data?.error || 'Baggage not found. Please check your tracking code.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleQRScan = (qrCode: string) => {
        setTrackingCode(qrCode)
        setShowScanner(false)
        handleSearch(qrCode)
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

    if (authLoading) {
        return <LoadingSpinner size="lg" className="min-h-screen" />
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
                            <AccountDropdown />
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
                        {isAuthenticated 
                            ? `Welcome back${user?.first_name ? `, ${user.first_name}` : ''}! Track your baggage using the QR code or manual entry below.`
                            : 'Enter your QR code to get real-time updates on your baggage location'
                        }
                    </p>
                </div>

                {/* Tracking Methods */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* QR Code Scanning Section */}
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <QrCode className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Scan QR Code</h3>
                            <p className="text-gray-600 mb-6">Use your device camera to scan the QR code on your baggage tag</p>
                            
                            <Button
                                onClick={() => setShowScanner(true)}
                                className="w-full bg-blue-600 hover:bg-blue-700"
                                size="lg"
                            >
                                <QrCode className="w-5 h-5 mr-2" />
                                Open Camera Scanner
                            </Button>
                        </div>
                    </div>

                    {/* Manual Entry Section */}
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Manual Entry</h3>
                            <p className="text-gray-600 mb-6">Enter your tracking code manually if you can&apos;t scan</p>
                            
                            <div className="space-y-4">
                                <Input
                                    type="text"
                                    placeholder="Enter QR tracking code"
                                    value={trackingCode}
                                    onChange={(e) => setTrackingCode(e.target.value)}
                                    className="text-center"
                                />
                                <Button
                                    onClick={() => handleSearch()}
                                    className="w-full bg-green-600 hover:bg-green-700"
                                    size="lg"
                                    disabled={!trackingCode.trim() || isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <LoadingSpinner size="sm" className="mr-2" />
                                            Searching...
                                        </>
                                    ) : (
                                        <>
                                            <Search className="w-5 h-5 mr-2" />
                                            Track Baggage
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-8 bg-red-50 border border-red-200 rounded-md p-4">
                        <div className="flex">
                            <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    </div>
                )}

                {/* Baggage Information */}
                {baggage && (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        {/* Header */}
                        <div className="bg-blue-600 text-white px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold">Baggage Found!</h2>
                                    <p className="text-blue-100">Tracking Code: {baggage.qr_code}</p>
                                </div>
                                <CheckCircle className="h-8 w-8" />
                            </div>
                        </div>

                        {/* Baggage Details */}
                        <div className="p-6">
                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Passenger Name</p>
                                    <p className="font-semibold text-gray-900">{baggage.passenger_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Flight Number</p>
                                    <p className="font-semibold text-gray-900">{baggage.flight_number || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Destination</p>
                                    <p className="font-semibold text-gray-900">{baggage.destination || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Current Status</p>
                                    <StatusBadge status={baggage.current_status} />
                                </div>
                            </div>

                            {/* Status Timeline */}
                            {baggage.status_timeline && baggage.status_timeline.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Timeline</h3>
                                    <div className="space-y-4">
                                        {baggage.status_timeline.map((update, index) => (
                                            <div key={update.id} className="flex items-start space-x-4">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                    index === 0 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                                                }`}>
                                                    {getStatusIcon(update.status)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {update.status_display}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {formatRelativeTime(update.timestamp)}
                                                        </p>
                                                    </div>
                                                    <p className="text-sm text-gray-600">
                                                        {formatDateTime(update.timestamp)}
                                                    </p>
                                                    {update.notes && (
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            Note: {update.notes}
                                                        </p>
                                                    )}
                                                    {update.location && (
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            Location: {update.location}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Quick Actions for Authenticated Users */}
                {isAuthenticated && !baggage && (
                    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Link href="/">
                                <Button variant="outline" className="w-full justify-between">
                                    Back to Home
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </Link>
                            {user?.is_staff_member && (
                                <Link href="/staff">
                                    <Button variant="outline" className="w-full justify-between">
                                        Staff Dashboard
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* QR Scanner Modal */}
            <QRScanner
                onScan={handleQRScan}
                onClose={() => setShowScanner(false)}
                isOpen={showScanner}
            />
        </div>
    )
}
