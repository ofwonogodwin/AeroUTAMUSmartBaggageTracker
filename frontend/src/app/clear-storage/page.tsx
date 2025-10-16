'use client'

import { useEffect } from 'react'
import { storage } from '@/lib/utils'

export default function ClearStorage() {
    const clearLocalStorage = () => {
        if (typeof window !== 'undefined') {
            localStorage.clear()
            sessionStorage.clear()
            console.log('Cleared all storage!')
            alert('Storage cleared! Please refresh and try registration again.')
        }
    }

    const clearAuthData = () => {
        storage.remove('auth_tokens')
        storage.remove('user')
        console.log('Cleared auth data!')
        alert('Auth data cleared! Please try registration again.')
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Clear Storage</h1>
            <div className="space-y-4">
                <button 
                    onClick={clearAuthData}
                    className="px-4 py-2 bg-yellow-600 text-white rounded mr-4"
                >
                    Clear Auth Data Only
                </button>
                <button 
                    onClick={clearLocalStorage}
                    className="px-4 py-2 bg-red-600 text-white rounded"
                >
                    Clear All Storage
                </button>
            </div>
            <div className="mt-8">
                <h2 className="text-lg font-semibold mb-2">Current API URL:</h2>
                <p className="text-sm bg-gray-100 p-2 rounded">
                    {process.env.NEXT_PUBLIC_API_URL || 'Not set'}
                </p>
            </div>
        </div>
    )
}