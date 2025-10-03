'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { 
    User, 
    LogOut, 
    UserPlus,
    Shield,
    ChevronDown
} from 'lucide-react'

export default function AccountDropdown() {
    const [isOpen, setIsOpen] = useState(false)
    const { user, isAuthenticated, logout } = useAuth()
    const router = useRouter()
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleLogout = async () => {
        try {
            await logout()
            setIsOpen(false)
            router.push('/')
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    const handleSwitchAccount = () => {
        logout()
        setIsOpen(false)
        router.push('/login?message=Switch Account')
    }

    if (!isAuthenticated || !user) {
        return (
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="text-left hidden sm:block">
                        <p className="text-sm font-medium text-gray-900">Account</p>
                        <p className="text-xs text-gray-500">Sign in to track baggage</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        {/* Guest User Header */}
                        <div className="px-4 py-3 border-b border-gray-100">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-gray-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Welcome</p>
                                    <p className="text-sm text-gray-500">Please sign in to continue</p>
                                </div>
                            </div>
                        </div>

                        {/* Account Options */}
                        <div className="py-2">
                            <button
                                onClick={() => {
                                    setIsOpen(false)
                                    router.push('/login')
                                }}
                                className="w-full flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                            >
                                <UserPlus className="w-4 h-4 mr-3" />
                                Login with Another Account
                            </button>

                            <button
                                onClick={() => {
                                    setIsOpen(false)
                                    // For non-authenticated users, this would redirect to login
                                    router.push('/login')
                                }}
                                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                                <LogOut className="w-4 h-4 mr-3" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-left hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">
                        {user.first_name} {user.last_name}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">
                                    {user.first_name} {user.last_name}
                                </p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                                <div className="flex items-center space-x-1 mt-1">
                                    {user.is_staff_member ? (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                            <Shield className="w-3 h-3 mr-1" />
                                            Staff Member
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                            <User className="w-3 h-3 mr-1" />
                                            Passenger
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                        {user.is_staff_member && (
                            <Link href="/staff" onClick={() => setIsOpen(false)}>
                                <div className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                                    <Shield className="w-4 h-4 mr-3" />
                                    Staff Dashboard
                                </div>
                            </Link>
                        )}

                        <div className="border-t border-gray-100 my-2"></div>

                        <button
                            onClick={handleSwitchAccount}
                            className="w-full flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                        >
                            <UserPlus className="w-4 h-4 mr-3" />
                            Login with Another Account
                        </button>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                            <LogOut className="w-4 h-4 mr-3" />
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}