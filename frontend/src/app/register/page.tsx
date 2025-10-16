'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/FormElements'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Plane, Eye, EyeOff, UserPlus } from 'lucide-react'

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        password_confirm: '',
        role: 'PASSENGER' as 'PASSENGER' | 'STAFF',
        employee_id: '',
        department: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const { register, isLoading } = useAuth()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setErrors({})

        // Client-side validation
        const newErrors: Record<string, string> = {}

        if (formData.password !== formData.password_confirm) {
            newErrors.password_confirm = "Passwords don't match"
        }

        if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters"
        }

        if (!formData.username.trim()) {
            newErrors.username = "Username is required"
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required"
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            setIsSubmitting(false)
            return
        }

        try {
            await register(formData)
            // Force refresh to ensure authentication state updates
            window.location.href = '/'
        } catch (error: any) {
            const responseErrors = error.response?.data?.errors || {}
            const errorMessage = error.response?.data?.error || 'Registration failed'

            if (Object.keys(responseErrors).length > 0) {
                setErrors(responseErrors)
            } else {
                setErrors({ general: errorMessage })
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    const roleOptions = [
        { value: 'PASSENGER', label: 'Passenger' },
        { value: 'STAFF', label: 'Staff Member' }
    ]

    const departmentOptions = [
        { value: '', label: 'Select Department' },
        { value: 'Baggage Handling', label: 'Baggage Handling' },
        { value: 'Security', label: 'Security' },
        { value: 'Ground Operations', label: 'Ground Operations' },
        { value: 'Customer Service', label: 'Customer Service' },
        { value: 'Management', label: 'Management' }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="flex justify-center items-center space-x-2 mb-4">
                        <Plane className="h-10 w-10 text-blue-600" />
                        <h1 className="text-2xl font-bold text-gray-900">Smart Baggage Tracker</h1>
                    </div>
                    <h2 className="text-xl text-gray-600">Create your account</h2>
                </div>

                {/* Registration Form */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* General Error */}
                        {errors.general && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                <p className="text-sm text-red-600">{errors.general}</p>
                            </div>
                        )}

                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                <UserPlus className="h-5 w-5 mr-2" />
                                Basic Information
                            </h3>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Input
                                    label="First Name"
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    placeholder="John"
                                    error={errors.first_name?.[0]}
                                />

                                <Input
                                    label="Last Name"
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    placeholder="Doe"
                                    error={errors.last_name?.[0]}
                                />
                            </div>

                            <Input
                                label="Username"
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="johndoe"
                                error={errors.username?.[0]}
                                required
                            />

                            <Input
                                label="Email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                error={errors.email?.[0]}
                                required
                            />

                            <Select
                                label="Account Type"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                options={roleOptions}
                                error={errors.role?.[0]}
                            />
                        </div>

                        {/* Staff Information (conditional) */}
                        {formData.role === 'STAFF' && (
                            <div className="space-y-4 border-t pt-4">
                                <h3 className="text-lg font-medium text-gray-900">Staff Information</h3>

                                <Input
                                    label="Employee ID"
                                    type="text"
                                    name="employee_id"
                                    value={formData.employee_id}
                                    onChange={handleChange}
                                    placeholder="EMP001"
                                    error={errors.employee_id?.[0]}
                                />

                                <Select
                                    label="Department"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    options={departmentOptions}
                                    error={errors.department?.[0]}
                                />
                            </div>
                        )}

                        {/* Password Fields */}
                        <div className="space-y-4 border-t pt-4">
                            <h3 className="text-lg font-medium text-gray-900">Security</h3>

                            <div className="relative">
                                <Input
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="At least 6 characters"
                                    error={errors.password?.[0] || errors.password}
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

                            <div className="relative">
                                <Input
                                    label="Confirm Password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="password_confirm"
                                    value={formData.password_confirm}
                                    onChange={handleChange}
                                    placeholder="Re-enter your password"
                                    error={errors.password_confirm?.[0] || errors.password_confirm}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            size="lg"
                            className="w-full"
                            isLoading={isSubmitting}
                            disabled={!formData.username || !formData.email || !formData.password || !formData.password_confirm}
                        >
                            {isSubmitting ? 'Creating Account...' : 'Create Account'}
                        </Button>
                    </form>

                    {/* Additional Links */}
                    <div className="mt-6 space-y-4">
                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                                    Sign in here
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
            </div>
        </div>
    )
}