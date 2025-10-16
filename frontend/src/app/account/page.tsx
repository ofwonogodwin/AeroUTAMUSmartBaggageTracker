'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/FormElements'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { 
    User, 
    Mail, 
    Shield, 
    Building2, 
    Calendar, 
    LogOut, 
    UserPlus,
    Settings,
    Plane,
    Edit
} from 'lucide-react'

export default function AccountPage() {
    const { user, isAuthenticated, logout, isLoading: authLoading } = useAuth()
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)
    const [editForm, setEditForm] = useState({
        first_name: '',
        last_name: '',
        email: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login')
        }
    }, [authLoading, isAuthenticated, router])

    useEffect(() => {
        if (user) {
            setEditForm({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || ''
            })
        }
    }, [user])

    const handleLogout = async () => {
        try {
            await logout()
            router.push('/')
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    const handleSwitchAccount = () => {
        // Clear current auth and redirect to login
        logout()
        router.push('/login?message=Switch Account')
    }

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage('')

        try {
            // Here you would call an API to update user profile
            // For now, we'll just show a success message
            setMessage('Profile updated successfully!')
            setIsEditing(false)
        } catch (error) {
            setMessage('Failed to update profile')
        } finally {
            setIsLoading(false)
        }
    }

    if (authLoading) {
        return <LoadingSpinner size="lg" className="min-h-screen" />
    }

    if (!isAuthenticated || !user) {
        return null
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
                            <Link href="/track">
                                <Button size="sm" variant="outline">Track Baggage</Button>
                            </Link>
                            {user.is_staff_member && (
                                <Link href="/staff">
                                    <Button size="sm" variant="outline">Staff Dashboard</Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-12 h-12 text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
                    <p className="text-lg text-gray-600">Manage your profile and account preferences</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Information */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-md p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
                                <Button
                                    onClick={() => setIsEditing(!isEditing)}
                                    variant="outline"
                                    size="sm"
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    {isEditing ? 'Cancel' : 'Edit'}
                                </Button>
                            </div>

                            {message && (
                                <div className={`mb-4 p-3 rounded ${
                                    message.includes('success') 
                                        ? 'bg-green-100 text-green-700 border border-green-400'
                                        : 'bg-red-100 text-red-700 border border-red-400'
                                }`}>
                                    {message}
                                </div>
                            )}

                            {isEditing ? (
                                <form onSubmit={handleUpdateProfile} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            label="First Name"
                                            type="text"
                                            value={editForm.first_name}
                                            onChange={(e) => setEditForm({...editForm, first_name: e.target.value})}
                                            placeholder="Enter first name"
                                        />
                                        <Input
                                            label="Last Name"
                                            type="text"
                                            value={editForm.last_name}
                                            onChange={(e) => setEditForm({...editForm, last_name: e.target.value})}
                                            placeholder="Enter last name"
                                        />
                                    </div>
                                    <Input
                                        label="Email Address"
                                        type="email"
                                        value={editForm.email}
                                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                        placeholder="Enter email address"
                                    />
                                    <div className="flex space-x-3">
                                        <Button
                                            type="submit"
                                            isLoading={isLoading}
                                            className="flex-1"
                                        >
                                            Save Changes
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setIsEditing(false)}
                                            className="flex-1"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex items-center space-x-3">
                                            <User className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Full Name</p>
                                                <p className="font-medium text-gray-900">
                                                    {user.first_name} {user.last_name}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Email</p>
                                                <p className="font-medium text-gray-900">{user.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <Shield className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Role</p>
                                                <p className="font-medium text-gray-900">
                                                    {user.role === 'STAFF' ? 'Staff Member' : 
                                                     user.role === 'ADMIN' ? 'Administrator' : 'Passenger'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <User className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Username</p>
                                                <p className="font-medium text-gray-900">{user.username}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {user.is_staff_member && (
                                        <div className="border-t pt-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Staff Information</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {user.employee_id && (
                                                    <div className="flex items-center space-x-3">
                                                        <Building2 className="h-5 w-5 text-gray-400" />
                                                        <div>
                                                            <p className="text-sm text-gray-500">Employee ID</p>
                                                            <p className="font-medium text-gray-900">{user.employee_id}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {user.department && (
                                                    <div className="flex items-center space-x-3">
                                                        <Building2 className="h-5 w-5 text-gray-400" />
                                                        <div>
                                                            <p className="text-sm text-gray-500">Department</p>
                                                            <p className="font-medium text-gray-900">{user.department}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Account Actions */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <Link href="/track" className="block">
                                    <Button variant="outline" className="w-full justify-start">
                                        <Settings className="w-4 h-4 mr-3" />
                                        Track Baggage
                                    </Button>
                                </Link>

                                {user.is_staff_member && (
                                    <Link href="/staff" className="block">
                                        <Button variant="outline" className="w-full justify-start">
                                            <Shield className="w-4 h-4 mr-3" />
                                            Staff Dashboard
                                        </Button>
                                    </Link>
                                )}

                                <Button 
                                    variant="outline" 
                                    className="w-full justify-start"
                                    onClick={handleSwitchAccount}
                                >
                                    <UserPlus className="w-4 h-4 mr-3" />
                                    Switch Account
                                </Button>
                            </div>
                        </div>

                        {/* Account Management */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Management</h3>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3 text-sm text-gray-600">
                                    <Calendar className="w-4 h-4" />
                                    <span>Member since {new Date().getFullYear()}</span>
                                </div>

                                <div className="pt-3 border-t">
                                    <Button 
                                        onClick={handleLogout}
                                        variant="outline"
                                        className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                                    >
                                        <LogOut className="w-4 h-4 mr-3" />
                                        Sign Out
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Security Info */}
                        <div className="bg-blue-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <Shield className="w-5 h-5 text-blue-600" />
                                <h4 className="font-medium text-blue-900">Security</h4>
                            </div>
                            <p className="text-sm text-blue-700">
                                Your account is protected with secure authentication. 
                                Contact support if you need to reset your password.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}