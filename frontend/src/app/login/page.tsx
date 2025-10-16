'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/FormElements'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Plane, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const { login, isLoading } = useAuth()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setErrors({})

        try {
            await login(formData)
            // Force refresh to ensure authentication state updates
            window.location.href = '/'
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Login failed'
            setErrors({ general: errorMessage })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    if (isLoading) {
        return <LoadingSpinner size="lg" className="min-h-screen" />
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="flex justify-center items-center space-x-2 mb-4">
                        <Plane className="h-10 w-10 text-blue-600" />
                        <h1 className="text-2xl font-bold text-gray-900">Smart Baggage Tracker</h1>
                    </div>
                    <h2 className="text-xl text-gray-600">Passenger Login</h2>
                    <p className="text-sm text-gray-500 mt-2">Sign in to track your baggage</p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* General Error */}
                        {errors.general && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                <p className="text-sm text-red-600">{errors.general}</p>
                            </div>
                        )}

                        {/* Username Field */}
                        <Input
                            label="Username"
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter your username"
                            error={errors.username}
                            required
                        />

                        {/* Password Field */}
                        <div className="relative">
                            <Input
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                error={errors.password}
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            size="lg"
                            className="w-full"
                            isLoading={isSubmitting}
                            disabled={!formData.username || !formData.password}
                        >
                            {isSubmitting ? 'Signing in...' : 'Sign In as Passenger'}
                        </Button>
                    </form>

                    {/* Additional Links */}
                    <div className="mt-6 space-y-4">
                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Don&apos;t have an account?{' '}
                                <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                                    Create one here
                                </Link>
                            </p>
                        </div>

                        <div className="text-center">
                            <Link href="/staff-login" className="text-sm text-blue-600 hover:text-blue-700">
                                Staff Login
                            </Link>
                        </div>

                        <div className="text-center">
                            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
                                ← Back to Home
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Quick Demo Credentials */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <h3 className="text-sm font-medium text-yellow-800 mb-2">Demo Credentials:</h3>
                    <div className="text-xs text-yellow-700 space-y-1">
                        <p><strong>Passenger:</strong> passenger1 / passenger123</p>
                        <p><strong>Staff:</strong> staff1 / staff123</p>
                        <p><strong>Admin:</strong> admin / admin123</p>
                    </div>
                </div>
            </div>
        </div>
    )
}