import React from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    helperText?: string
}

export function Input({
    label,
    error,
    helperText,
    className,
    id,
    ...props
}: InputProps) {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
        <div className="space-y-1">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-gray-700"
                >
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={cn(
                    'block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-black',
                    error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
                    className
                )}
                {...props}
            />
            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
            {helperText && !error && (
                <p className="text-sm text-gray-500">{helperText}</p>
            )}
        </div>
    )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string
    error?: string
    helperText?: string
    options: { value: string; label: string }[]
}

export function Select({
    label,
    error,
    helperText,
    options,
    className,
    id,
    ...props
}: SelectProps) {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
        <div className="space-y-1">
            {label && (
                <label
                    htmlFor={selectId}
                    className="block text-sm font-medium text-gray-700"
                >
                    {label}
                </label>
            )}
            <select
                id={selectId}
                className={cn(
                    'block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-black',
                    error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
                    className
                )}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
            {helperText && !error && (
                <p className="text-sm text-gray-500">{helperText}</p>
            )}
        </div>
    )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    error?: string
    helperText?: string
}

export function Textarea({
    label,
    error,
    helperText,
    className,
    id,
    ...props
}: TextareaProps) {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
        <div className="space-y-1">
            {label && (
                <label
                    htmlFor={textareaId}
                    className="block text-sm font-medium text-gray-700"
                >
                    {label}
                </label>
            )}
            <textarea
                id={textareaId}
                className={cn(
                    'block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-black',
                    error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
                    className
                )}
                {...props}
            />
            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
            {helperText && !error && (
                <p className="text-sm text-gray-500">{helperText}</p>
            )}
        </div>
    )
}