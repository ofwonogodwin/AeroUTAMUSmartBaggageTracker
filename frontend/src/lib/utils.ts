import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// API URL configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws'

// Format date for display
export function formatDateTime(date: string | Date) {
    const d = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat('en-UG', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Africa/Kampala'
    }).format(d)
}

// Format date for relative time
export function formatRelativeTime(date: string | Date) {
    const d = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diffInMs = now.getTime() - d.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInDays < 7) return `${diffInDays}d ago`

    return formatDateTime(d)
}

// Get status badge styling
export function getStatusBadgeClass(status: string) {
    const baseClass = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"

    switch (status.toUpperCase()) {
        case 'CHECKED_IN':
            return cn(baseClass, "bg-blue-50 text-blue-700 border-blue-200")
        case 'SECURITY_CLEARED':
            return cn(baseClass, "bg-yellow-50 text-yellow-700 border-yellow-200")
        case 'LOADED':
            return cn(baseClass, "bg-orange-50 text-orange-700 border-orange-200")
        case 'IN_FLIGHT':
            return cn(baseClass, "bg-purple-50 text-purple-700 border-purple-200")
        case 'ARRIVED':
            return cn(baseClass, "bg-green-50 text-green-700 border-green-200")
        default:
            return cn(baseClass, "bg-gray-50 text-gray-700 border-gray-200")
    }
}

// Get status display name
export function getStatusDisplayName(status: string) {
    switch (status.toUpperCase()) {
        case 'CHECKED_IN':
            return 'Checked In'
        case 'SECURITY_CLEARED':
            return 'Security Cleared'
        case 'LOADED':
            return 'Loaded'
        case 'IN_FLIGHT':
            return 'In-Flight'
        case 'ARRIVED':
            return 'Arrived'
        default:
            return status
    }
}

// Generate QR code data URL
export async function generateQRCode(data: string): Promise<string> {
    const QRCode = (await import('qrcode')).default
    return QRCode.toDataURL(data, {
        width: 256,
        margin: 2,
        color: {
            dark: '#003366',
            light: '#FFFFFF'
        }
    })
}

// Storage utilities
export const storage = {
    set: (key: string, value: any) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(key, JSON.stringify(value))
        }
    },
    get: (key: string) => {
        if (typeof window !== 'undefined') {
            const item = localStorage.getItem(key)
            return item ? JSON.parse(item) : null
        }
        return null
    },
    remove: (key: string) => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(key)
        }
    }
}

// Aviation theme colors
export const colors = {
    deepBlue: '#003366',
    skyBlue: '#0096FF',
    gold: '#FFD700',
    lightGray: '#F8FAFC',
    darkGray: '#64748B'
}