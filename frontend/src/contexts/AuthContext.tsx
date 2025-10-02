'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, LoginCredentials, RegisterData, AuthTokens } from '@/types'
import { authAPI } from '@/lib/api'
import { storage } from '@/lib/utils'
import toast from 'react-hot-toast'

interface AuthContextType {
    user: User | null
    tokens: AuthTokens | null
    isLoading: boolean
    isAuthenticated: boolean
    login: (credentials: LoginCredentials) => Promise<void>
    staffLogin: (credentials: LoginCredentials) => Promise<void>
    register: (data: RegisterData) => Promise<void>
    logout: () => Promise<void>
    refreshUserInfo: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
    children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null)
    const [tokens, setTokens] = useState<AuthTokens | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const isAuthenticated = !!user && !!tokens

    // Initialize auth state from storage
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const storedTokens = storage.get('auth_tokens')
                const storedUser = storage.get('user')

                if (storedTokens && storedUser) {
                    setTokens(storedTokens)
                    setUser(storedUser)

                    // Verify token is still valid by fetching user info
                    try {
                        const { user: currentUser } = await authAPI.getUserInfo()
                        setUser(currentUser)
                        storage.set('user', currentUser)
                    } catch (error) {
                        // Token is invalid, clear storage
                        storage.remove('auth_tokens')
                        storage.remove('user')
                        setTokens(null)
                        setUser(null)
                    }
                }
            } catch (error) {
                console.error('Auth initialization error:', error)
            } finally {
                setIsLoading(false)
            }
        }

        initializeAuth()
    }, [])

    const login = async (credentials: LoginCredentials) => {
        try {
            setIsLoading(true)
            const response = await authAPI.login(credentials)

            setUser(response.user)
            setTokens(response.tokens)

            // Store in localStorage
            storage.set('user', response.user)
            storage.set('auth_tokens', response.tokens)

            toast.success('Successfully logged in!')
        } catch (error: any) {
            const message = error.response?.data?.error || 'Login failed'
            toast.error(message)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const staffLogin = async (credentials: LoginCredentials) => {
        try {
            setIsLoading(true)
            const response = await authAPI.staffLogin(credentials)

            setUser(response.user)
            setTokens(response.tokens)

            // Store in localStorage
            storage.set('user', response.user)
            storage.set('auth_tokens', response.tokens)

            toast.success('Staff login successful!')
        } catch (error: any) {
            const message = error.response?.data?.error || 'Staff login failed'
            toast.error(message)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const register = async (data: RegisterData) => {
        try {
            setIsLoading(true)
            const response = await authAPI.register(data)

            setUser(response.user)
            setTokens(response.tokens)

            // Store in localStorage
            storage.set('user', response.user)
            storage.set('auth_tokens', response.tokens)

            toast.success('Account created successfully!')
        } catch (error: any) {
            const message = error.response?.data?.error || 'Registration failed'
            toast.error(message)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const logout = async () => {
        try {
            if (tokens?.refresh) {
                await authAPI.logout(tokens.refresh)
            }
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            // Clear state and storage regardless of API call success
            setUser(null)
            setTokens(null)
            storage.remove('user')
            storage.remove('auth_tokens')
            toast.success('Successfully logged out')
        }
    }

    const refreshUserInfo = async () => {
        try {
            if (isAuthenticated) {
                const { user: currentUser } = await authAPI.getUserInfo()
                setUser(currentUser)
                storage.set('user', currentUser)
            }
        } catch (error) {
            console.error('Failed to refresh user info:', error)
        }
    }

    const value: AuthContextType = {
        user,
        tokens,
        isLoading,
        isAuthenticated,
        login,
        staffLogin,
        register,
        logout,
        refreshUserInfo,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}