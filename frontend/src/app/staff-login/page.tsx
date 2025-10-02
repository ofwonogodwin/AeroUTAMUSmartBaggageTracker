'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/FormElements'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Plane, Shield, Eye, EyeOff } from 'lucide-react'

export default function StaffLoginPage() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const { staffLogin, isLoading } = useAuth()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setErrors({})

        try {
            await staffLogin(formData)
            router.push('/staff') // Redirect to staff dashboard after successful login
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Staff login failed'
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
                        <Shield className="h-10 w-10 text-blue-600" />
                        <h1 className="text-2xl font-bold text-gray-900">Staff Access</h1>
                    </div>
                    <h2 className="text-xl text-gray-600">Secure staff login portal</h2>
                    <p className="text-sm text-gray-500 mt-2">For authorized airport personnel only</p>
                </div>

                {/* Staff Login Form */}
                <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-blue-600">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* General Error */}
                        {errors.general && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                <p className="text-sm text-red-600">{errors.general}</p>
                            </div>
                        )}

                        {/* Staff Badge Notice */}
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                            <div className="flex items-center">
                                <Shield className="h-5 w-5 text-blue-600 mr-2" />
                                <p className="text-sm text-blue-700">
                                    Staff credentials required for access
                                </p>
                            </div>
                        </div>

                        {/* Username Field */}
                        <Input
                            label="Staff Username"
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter your staff username"
                            error={errors.username}
                            required
                        />

                        {/* Password Field */}
                        <div className="relative">
                            <Input
                                label="Staff Password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your staff password"
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
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            isLoading={isSubmitting}
                            disabled={!formData.username || !formData.password}
                        >
                            {isSubmitting ? 'Verifying...' : 'Access Staff Dashboard'}
                        </Button>
                    </form>

                    {/* Additional Links */}
                    <div className="mt-6 space-y-4">
                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Not a staff member?{' '}
                                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                                    Regular Login
                                </Link>
                            </p>
                        </div>

                        <div className="text-center">
                            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
                                ← Back to Home
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Demo Staff Credentials */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <h3 className="text-sm font-medium text-yellow-800 mb-2">Demo Staff Credentials:</h3>
                    <div className="text-xs text-yellow-700 space-y-1">
                        <p><strong>Baggage Handler:</strong> staff1 / staff123</p>
                        <p><strong>Security Officer:</strong> staff2 / staff123</p>
                        <p><strong>Ground Operations:</strong> staff3 / staff123</p>
                        <p><strong>Admin:</strong> admin / admin123</p>
                    </div>
                </div>

                {/* Security Notice */}
                <div className="text-center">
                    <p className="text-xs text-gray-500">
                        This is a secure area. All access attempts are logged and monitored.
                    </p>
                </div>
            </div>
        </div>
    )
}