'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { baggageAPI } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/FormElements'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import QRScanner from '@/components/QRScanner'
import AccountDropdown from '@/components/AccountDropdown'
import { formatDateTime } from '@/lib/utils'
import { Baggage, StatusUpdate, DashboardStats } from '@/types'
import {
    Plane,
    Search,
    Package,
    Clock,
    Edit,
    TrendingUp,
    Activity,
    Camera
} from 'lucide-react'

export default function StaffDashboard() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth()
    const router = useRouter()
    
    // State management
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [baggage, setBaggage] = useState<Baggage[]>([])
    const [recentUpdates, setRecentUpdates] = useState<StatusUpdate[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    
    // Search and filter state
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [selectedBaggage, setSelectedBaggage] = useState<Baggage | null>(null)
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const [showScanner, setShowScanner] = useState(false)
    
    // Update form state
    const [updateForm, setUpdateForm] = useState({
        status: '',
        location: '',
        notes: ''
    })

    // Authentication check
    useEffect(() => {
        if (!authLoading && (!isAuthenticated || !user?.is_staff_member)) {
            router.push('/staff-login')
        }
    }, [authLoading, isAuthenticated, user, router])

    // Load dashboard data
    useEffect(() => {
        if (isAuthenticated && user?.is_staff_member) {
            loadDashboardData()
        }
    }, [isAuthenticated, user])

    const loadDashboardData = async () => {
        try {
            setIsLoading(true)
            
            // Load all baggage first
            const baggageData = await baggageAPI.getAll()
            setBaggage(baggageData.results)
            
            // Calculate stats from baggage data
            const stats: DashboardStats = {
                total_baggage: baggageData.results.length,
                status_counts: {
                    CHECKED_IN: { count: 0, display: 'Checked In' },
                    SECURITY_CLEARED: { count: 0, display: 'Security Cleared' },
                    LOADED: { count: 0, display: 'Loaded' },
                    IN_FLIGHT: { count: 0, display: 'In Flight' },
                    ARRIVED: { count: 0, display: 'Arrived' }
                },
                recent_updates: []
            }
            
            // Count statuses and extract recent updates
            const allUpdates: StatusUpdate[] = []
            baggageData.results.forEach(bag => {
                // Count status
                if (stats.status_counts[bag.current_status]) {
                    stats.status_counts[bag.current_status].count++
                }
                
                // Extract updates
                if (bag.status_timeline) {
                    allUpdates.push(...bag.status_timeline)
                }
            })
            
            // Sort by timestamp and take latest 10
            const sortedUpdates = allUpdates
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .slice(0, 10)
            
            stats.recent_updates = sortedUpdates
            setStats(stats)
            setRecentUpdates(sortedUpdates)
            
        } catch (error) {
            console.error('Error loading dashboard data:', error)
            setError('Failed to load dashboard data')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            loadDashboardData()
            return
        }

        try {
            setIsLoading(true)
            const searchData = await baggageAPI.getAll({
                search: searchQuery,
                status: statusFilter ? statusFilter as 'CHECKED_IN' | 'SECURITY_CLEARED' | 'LOADED' | 'IN_FLIGHT' | 'ARRIVED' : undefined
            })
            setBaggage(searchData.results)
        } catch (error) {
            console.error('Search error:', error)
            setError('Search failed')
        } finally {
            setIsLoading(false)
        }
    }

    const openUpdateModal = (baggageItem: Baggage) => {
        setSelectedBaggage(baggageItem)
        setUpdateForm({
            status: baggageItem.current_status,
            location: '',
            notes: ''
        })
        setShowUpdateModal(true)
    }

    const handleStatusUpdate = async () => {
        if (!selectedBaggage) return

        try {
            setIsLoading(true)
            await baggageAPI.updateStatus(selectedBaggage.id, {
                status: updateForm.status as 'CHECKED_IN' | 'SECURITY_CLEARED' | 'LOADED' | 'IN_FLIGHT' | 'ARRIVED',
                location: updateForm.location,
                notes: updateForm.notes
            })
            
            setShowUpdateModal(false)
            setSelectedBaggage(null)
            loadDashboardData() // Refresh data
            
        } catch (error) {
            console.error('Update error:', error)
            setError('Failed to update baggage status')
        } finally {
            setIsLoading(false)
        }
    }

    // Filter baggage based on search query and status filter
    const filteredBaggage = baggage.filter(bag => {
        const matchesSearch = !searchQuery || 
            bag.passenger_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bag.qr_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (bag.flight_number && bag.flight_number.toLowerCase().includes(searchQuery.toLowerCase()))
        
        const matchesStatus = !statusFilter || bag.current_status === statusFilter
        
        return matchesSearch && matchesStatus
    })

    const statusOptions = [
        { value: '', label: 'All Statuses' },
        { value: 'CHECKED_IN', label: 'Checked In' },
        { value: 'SECURITY_CLEARED', label: 'Security Cleared' },
        { value: 'LOADED', label: 'Loaded' },
        { value: 'IN_FLIGHT', label: 'In Flight' },
        { value: 'ARRIVED', label: 'Arrived' }
    ]

    if (authLoading || isLoading) {
        return <LoadingSpinner size="lg" className="min-h-screen" />
    }

    if (!isAuthenticated || !user?.is_staff_member) {
        return null
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <Plane className="h-8 w-8 text-blue-600" />
                            <h1 className="text-xl font-bold text-gray-900">Staff Dashboard</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <AccountDropdown />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Statistics Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <Package className="h-8 w-8 text-blue-500" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Total Baggage</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.total_baggage}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <Clock className="h-8 w-8 text-yellow-500" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">In Transit</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {(stats.status_counts.IN_FLIGHT?.count || 0) + 
                                         (stats.status_counts.LOADED?.count || 0)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <TrendingUp className="h-8 w-8 text-green-500" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Arrived</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {stats.status_counts.ARRIVED?.count || 0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <Activity className="h-8 w-8 text-purple-500" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Recent Updates</p>
                                    <p className="text-2xl font-bold text-gray-900">{recentUpdates.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Search and Filter */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Search & Filter Baggage</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                            <Input
                                type="text"
                                placeholder="Search by passenger name, QR code, or flight number..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        <div className="flex space-x-2">
                            <Select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                options={statusOptions}
                            />
                            <Button onClick={() => setShowScanner(true)} variant="outline" className="flex-shrink-0">
                                <Camera className="h-4 w-4 mr-2" />
                                Scan
                            </Button>
                            <Button onClick={handleSearch} className="flex-shrink-0">
                                <Search className="h-4 w-4 mr-2" />
                                Search
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Baggage List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">Baggage Operations</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                QR Code
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Passenger
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Flight
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredBaggage.map((bag) => (
                                            <tr key={bag.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                                                    {bag.qr_code}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {bag.passenger_name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {bag.flight_number || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <StatusBadge status={bag.current_status} />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => openUpdateModal(bag)}
                                                    >
                                                        <Edit className="h-4 w-4 mr-1" />
                                                        Update
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {recentUpdates.map((update, index) => (
                                    <div key={`${update.id}-${index}`} className="flex items-start space-x-3">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                <Activity className="w-4 h-4 text-blue-600" />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2">
                                                <StatusBadge status={update.status} size="sm" />
                                                <span className="text-xs text-gray-500">
                                                    {formatDateTime(update.timestamp)}
                                                </span>
                                            </div>
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
                                                    by {update.updated_by_name}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Update Status Modal */}
            {showUpdateModal && selectedBaggage && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                            Update Baggage Status
                                        </h3>
                                        <div className="mb-4">
                                            <p className="text-sm text-gray-600">
                                                <strong>QR Code:</strong> {selectedBaggage.qr_code}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <strong>Passenger:</strong> {selectedBaggage.passenger_name}
                                            </p>
                                        </div>
                                        <div className="space-y-4">
                                            <Select
                                                label="New Status"
                                                value={updateForm.status}
                                                onChange={(e) => setUpdateForm({...updateForm, status: e.target.value})}
                                                options={statusOptions.slice(1)} // Remove "All Statuses" option
                                            />
                                            <Input
                                                label="Location"
                                                type="text"
                                                value={updateForm.location}
                                                onChange={(e) => setUpdateForm({...updateForm, location: e.target.value})}
                                                placeholder="e.g., Gate A12, Baggage Claim 3"
                                            />
                                            <Input
                                                label="Notes"
                                                type="text"
                                                value={updateForm.notes}
                                                onChange={(e) => setUpdateForm({...updateForm, notes: e.target.value})}
                                                placeholder="Additional notes (optional)"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <Button
                                    onClick={handleStatusUpdate}
                                    className="w-full sm:w-auto sm:ml-3"
                                    disabled={!updateForm.status}
                                >
                                    Update Status
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowUpdateModal(false)}
                                    className="mt-3 w-full sm:mt-0 sm:w-auto"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* QR Scanner Modal */}
            <QRScanner
                isOpen={showScanner}
                onScan={(code) => {
                    setSearchQuery(code)
                    setShowScanner(false)
                    // Trigger search automatically
                    handleSearch()
                }}
                onClose={() => setShowScanner(false)}
            />

            {error && (
                <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
                    {error}
                </div>
            )}
        </div>
    )
}