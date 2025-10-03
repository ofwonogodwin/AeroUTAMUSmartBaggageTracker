import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({
  label,
  error,
  helperText,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          // Professional Google-like styling
          "block w-full px-4 py-3 text-base rounded-lg border border-gray-300 shadow-sm transition-all duration-200",
          "placeholder-gray-500 text-gray-900 bg-white",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          "hover:border-gray-400 hover:shadow-md",
          // Enhanced sizing and spacing
          "min-h-[48px]",
          // Error states
          error &&
            "border-red-300 focus:border-red-500 focus:ring-red-500 hover:border-red-400",
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-gray-500 mt-1">{helperText}</p>
      )}
    </div>
  );
}

// Professional Search Input Component (Google-like)
interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
  isLoading?: boolean;
}

export function SearchInput({
  onSearch,
  isLoading,
  className,
  onKeyDown,
  ...props
}: SearchInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch) {
      onSearch((e.target as HTMLInputElement).value);
    }
    onKeyDown?.(e);
  };

  return (
    <input
      className={cn(
        // Google Search-like styling
        "w-full px-4 py-3 text-base rounded-full border border-gray-300 shadow-sm transition-all duration-200",
        "placeholder-gray-500 text-gray-900 bg-white",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:shadow-lg",
        "hover:border-gray-400 hover:shadow-md",
        // Enhanced sizing
        "min-h-[50px]",
        // Loading state
        isLoading && "cursor-wait",
        className
      )}
      onKeyDown={handleKeyDown}
      disabled={isLoading}
      {...props}
    />
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
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
  const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          // Professional styling matching Input component
          "block w-full px-4 py-3 text-base rounded-lg border border-gray-300 shadow-sm transition-all duration-200",
          "text-gray-900 bg-white",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          "hover:border-gray-400 hover:shadow-md",
          // Enhanced sizing
          "min-h-[48px]",
          // Error states
          error &&
            "border-red-300 focus:border-red-500 focus:ring-red-500 hover:border-red-400",
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
      {error && <p className="text-sm text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Textarea({
  label,
  error,
  helperText,
  className,
  id,
  ...props
}: TextareaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={cn(
          // Professional styling matching Input component
          "block w-full px-4 py-3 text-base rounded-lg border border-gray-300 shadow-sm transition-all duration-200",
          "placeholder-gray-500 text-gray-900 bg-white",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          "hover:border-gray-400 hover:shadow-md",
          // Enhanced sizing
          "min-h-[100px] resize-vertical",
          // Error states
          error &&
            "border-red-300 focus:border-red-500 focus:ring-red-500 hover:border-red-400",
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}
