"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/FormElements";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Plane, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      await login(formData);
      // Redirect is handled in AuthContext after successful login
    } catch {
      const errorMessage = "Login failed. Please check your credentials.";
      setErrors({ general: errorMessage });
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Uganda Airlines Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url(https://caa.go.ug/wp-content/uploads/2023/06/Uganda-Airlines.jpg)",
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center items-center space-x-3 mb-6">
              <div className="bg-white p-3 rounded-full shadow-lg">
                <Plane className="h-12 w-12 text-blue-600" />
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-bold text-white">AERO UTAMU</h1>
                <p className="text-blue-100 text-sm">Smart Baggage Tracker</p>
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-blue-100">Sign in to track your journey</p>
          </div>

          {/* Login Form */}
          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8 border border-white/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* General Error */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-600">{errors.general}</p>
                </div>
              )}

              {/* Username Field */}
              <Input
                label="Username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                error={errors.username}
                required
              />

              {/* Password Field */}
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
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
                className="w-full"
                isLoading={isSubmitting}
                disabled={!formData.username || !formData.password}
              >
                {isSubmitting ? "Signing in..." : "Sign In as Passenger"}
              </Button>
            </form>

            {/* Additional Links */}
            <div className="mt-6 space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Create one here
                  </Link>
                </p>
              </div>

              <div className="text-center">
                <Link
                  href="/staff-login"
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Staff Login →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
