"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/FormElements";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Plane, Shield, Eye, EyeOff } from "lucide-react";

export default function StaffLoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { staffLogin, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      await staffLogin(formData);
      // Force refresh to ensure authentication state updates
      window.location.href = "/staff";
    } catch {
      setErrors({ general: "Staff login failed. Please check credentials." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" className="min-h-screen" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-600 via-gray-700 to-slate-800 relative overflow-hidden">
      {/* Professional Aviation Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 transform rotate-12">
          <Shield className="h-20 w-20 text-white" />
        </div>
        <div className="absolute top-32 right-20 transform -rotate-45">
          <Plane className="h-16 w-16 text-white" />
        </div>
        <div className="absolute bottom-20 left-1/4 transform rotate-90">
          <Shield className="h-24 w-24 text-white" />
        </div>
        <div className="absolute bottom-32 right-10 transform -rotate-12">
          <Plane className="h-18 w-18 text-white" />
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center items-center space-x-3 mb-6">
              <div className="bg-white p-3 rounded-full shadow-lg">
                <Shield className="h-12 w-12 text-slate-700" />
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-bold text-white">STAFF ACCESS</h1>
                <p className="text-slate-200 text-sm">
                  Authorized Personnel Only
                </p>
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              Secure Portal
            </h2>
            <p className="text-slate-300">Airport staff login system</p>
          </div>

          {/* Staff Login Form */}
          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8 border border-white/20">
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
                  type={showPassword ? "text" : "password"}
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
                {isSubmitting ? "Verifying..." : "Access Staff Dashboard"}
              </Button>
            </form>

            {/* Additional Links */}
            <div className="mt-6 space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Not a staff member?{" "}
                  <Link
                    href="/login"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Passenger Login
                  </Link>
                </p>
              </div>

              <div className="text-center">
                <Link
                  href="/login"
                  className="text-sm text-slate-600 hover:text-slate-700"
                >
                  ← Passenger Login
                </Link>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                🔒 Secure area - All access attempts are logged
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
