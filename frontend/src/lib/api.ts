import axios, { AxiosResponse } from 'axios'
import {
    AuthResponse,
    LoginCredentials,
    RegisterData,
    User,
    Baggage,
    BaggageCreateData,
    StatusUpdateCreateData,
    StatusUpdate,
    DashboardStats,
    PaginatedResponse,
    SearchFilters
} from '@/types'
import { storage } from '@/lib/utils'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const tokens = storage.get('auth_tokens')
        if (tokens?.access) {
            config.headers.Authorization = `Bearer ${tokens.access}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            const tokens = storage.get('auth_tokens')
            if (tokens?.refresh) {
                try {
                    const response = await axios.post(`${API_URL}/auth/refresh/`, {
                        refresh: tokens.refresh
                    })

                    const newTokens = {
                        access: response.data.access,
                        refresh: tokens.refresh
                    }

                    storage.set('auth_tokens', newTokens)
                    originalRequest.headers.Authorization = `Bearer ${newTokens.access}`

                    return api(originalRequest)
                } catch (refreshError) {
                    // Refresh failed, clear tokens and redirect to login
                    storage.remove('auth_tokens')
                    storage.remove('user')
                    if (typeof window !== 'undefined') {
                        window.location.href = '/login'
                    }
                    return Promise.reject(refreshError)
                }
            }
        }

        return Promise.reject(error)
    }
)

// Auth API
export const authAPI = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response: AxiosResponse<AuthResponse> = await api.post('/auth/login/', credentials)
        return response.data
    },

    staffLogin: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response: AxiosResponse<AuthResponse> = await api.post('/auth/staff-login/', credentials)
        return response.data
    },

    register: async (data: RegisterData): Promise<AuthResponse> => {
        const response: AxiosResponse<AuthResponse> = await api.post('/auth/register/', data)
        return response.data
    },

    logout: async (refreshToken: string): Promise<void> => {
        await api.post('/auth/logout/', { refresh: refreshToken })
    },

    getUserInfo: async (): Promise<{ user: User }> => {
        const response: AxiosResponse<{ user: User }> = await api.get('/auth/user/')
        return response.data
    },

    refreshToken: async (refreshToken: string): Promise<{ access: string }> => {
        const response: AxiosResponse<{ access: string }> = await api.post('/auth/refresh/', {
            refresh: refreshToken
        })
        return response.data
    }
}

// Baggage API
export const baggageAPI = {
    getAll: async (filters?: SearchFilters): Promise<PaginatedResponse<Baggage>> => {
        const params = new URLSearchParams()
        if (filters?.search) params.append('search', filters.search)
        if (filters?.status) params.append('status', filters.status)
        if (filters?.page) params.append('page', filters.page.toString())
        if (filters?.page_size) params.append('page_size', filters.page_size.toString())

        const response: AxiosResponse<PaginatedResponse<Baggage>> = await api.get(`/baggage/?${params}`)
        return response.data
    },

    getById: async (id: string): Promise<Baggage> => {
        const response: AxiosResponse<Baggage> = await api.get(`/baggage/${id}/`)
        return response.data
    },

    getByQRCode: async (qrCode: string): Promise<Baggage> => {
        const response: AxiosResponse<Baggage> = await api.get(`/baggage/qr/${qrCode}/`)
        return response.data
    },

    create: async (data: BaggageCreateData): Promise<{ message: string; baggage: Baggage }> => {
        const response: AxiosResponse<{ message: string; baggage: Baggage }> = await api.post('/baggage/', data)
        return response.data
    },

    updateStatus: async (
        baggageId: string,
        statusData: StatusUpdateCreateData
    ): Promise<{ message: string; baggage: Baggage; status_update: StatusUpdate }> => {
        const response = await api.post(`/baggage/${baggageId}/update/`, statusData)
        return response.data
    },

    getTimeline: async (baggageId: string): Promise<{
        baggage_id: string
        qr_code: string
        passenger_name: string
        current_status: string
        timeline: StatusUpdate[]
    }> => {
        const response = await api.get(`/baggage/${baggageId}/timeline/`)
        return response.data
    }
}

// Staff API
export const staffAPI = {
    getDashboardStats: async (): Promise<DashboardStats> => {
        const response: AxiosResponse<DashboardStats> = await api.get('/staff/dashboard/stats/')
        return response.data
    }
}

// Health check
export const healthAPI = {
    check: async (): Promise<{ status: string; service: string; version: string }> => {
        const response = await api.get('/health/')
        return response.data
    }
}

export default api