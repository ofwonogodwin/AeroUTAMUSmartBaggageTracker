// User and Authentication Types
export interface User {
    id: number
    username: string
    email: string
    first_name?: string
    last_name?: string
    role: 'STAFF' | 'PASSENGER' | 'ADMIN'
    employee_id?: string
    department?: string
    is_staff_member: boolean
    can_update_baggage_status?: boolean
}

export interface LoginCredentials {
    username: string
    password: string
}

export interface RegisterData {
    username: string
    email: string
    first_name?: string
    last_name?: string
    password: string
    password_confirm: string
    role?: 'STAFF' | 'PASSENGER'
    employee_id?: string
    department?: string
}

export interface AuthTokens {
    access: string
    refresh: string
}

export interface AuthResponse {
    user: User
    tokens: AuthTokens
    message?: string
}

// Baggage Types
export type BaggageStatus =
    | 'CHECKED_IN'
    | 'SECURITY_CLEARED'
    | 'LOADED'
    | 'IN_FLIGHT'
    | 'ARRIVED'

export interface Baggage {
    id: string
    passenger_name: string
    passenger_email?: string
    flight_number?: string
    destination?: string
    qr_code: string
    qr_code_image_url?: string
    current_status: BaggageStatus
    current_status_display: string
    created_at: string
    updated_at: string
    status_timeline?: StatusUpdate[]
}

export interface BaggageCreateData {
    passenger_name: string
    passenger_email?: string
    flight_number?: string
    destination?: string
}

export interface StatusUpdate {
    id: number
    status: BaggageStatus
    status_display: string
    timestamp: string
    updated_by?: number
    updated_by_name?: string
    notes?: string
    location?: string
}

export interface StatusUpdateCreateData {
    status: BaggageStatus
    notes?: string
    location?: string
}

// API Response Types
export interface APIResponse<T = any> {
    message?: string
    data?: T
    error?: string
    errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
    count: number
    next: string | null
    previous: string | null
    results: T[]
}

// Dashboard Types
export interface DashboardStats {
    total_baggage: number
    status_counts: Record<BaggageStatus, {
        count: number
        display: string
    }>
    recent_updates: StatusUpdate[]
}

// WebSocket Types
export interface WebSocketMessage {
    type: 'connection_established' | 'baggage_update' | 'error' | 'status_update' | 'notification'
    data?: any
    baggage?: Baggage
    message?: string
}

export interface BaggageUpdateMessage {
    baggage_id: string
    qr_code: string
    status: BaggageStatus
    status_display: string
    timestamp: string
    updated_by: string
    notes?: string
    location?: string
}

// Component Props Types
export interface QRScannerProps {
    onScan: (qrCode: string) => void
    onError?: (error: string) => void
}

export interface BaggageTimelineProps {
    baggage: Baggage
    showHeader?: boolean
}

export interface StatusBadgeProps {
    status: BaggageStatus
    size?: 'sm' | 'md' | 'lg'
}

export interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

// Form Types
export interface SearchFilters {
    search?: string
    status?: BaggageStatus | ''
    page?: number
    page_size?: number
}

// Error Types
export interface APIError {
    message: string
    status?: number
    errors?: Record<string, string[]>
}

// Navigation Types
export interface NavItem {
    name: string
    href: string
    icon?: React.ComponentType<{ className?: string }>
    current?: boolean
    requiresAuth?: boolean
    roles?: User['role'][]
}

// QR Code Types
export interface QRCodeData {
    baggage_id: string
    qr_code: string
    passenger_name: string
}

// Notification Types
export interface Toast {
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message?: string
    duration?: number
}

// PWA Types
export interface PWAInstallPrompt {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}