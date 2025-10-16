'use client'

import { useState } from 'react'
import { authAPI } from '@/lib/api'

export default function TestRegistration() {
    const [result, setResult] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const testRegistration = async () => {
        setIsLoading(true)
        try {
            const testData = {
                username: 'testuser' + Date.now(),
                email: 'test@example.com',
                first_name: 'Test',
                last_name: 'User',
                password: 'testpass123',
                password_confirm: 'testpass123',
                role: 'PASSENGER' as const
            }

            console.log('Sending registration data:', testData)
            const response = await authAPI.register(testData)
            console.log('Registration response:', response)
            setResult(JSON.stringify(response, null, 2))
        } catch (error: any) {
            console.error('Registration error:', error)
            setResult(`Error: ${error.message}\nResponse: ${JSON.stringify(error.response?.data, null, 2)}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Test Registration API</h1>
            <button 
                onClick={testRegistration}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
                {isLoading ? 'Testing...' : 'Test Registration'}
            </button>
            
            {result && (
                <div className="mt-4">
                    <h2 className="text-lg font-semibold mb-2">Result:</h2>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                        {result}
                    </pre>
                </div>
            )}
        </div>
    )
}