"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/FormElements";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Eye, EyeOff, UserPlus } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    password_confirm: "",
    role: "PASSENGER" as "PASSENGER" | "STAFF",
    employee_id: "",
    department: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { register, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Client-side validation
    const newErrors: Record<string, string> = {};

    if (formData.password !== formData.password_confirm) {
      newErrors.password_confirm = "Passwords don't match";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("Submitting registration...");
      await register(formData);
      // Redirect after successful registration
      setTimeout(() => {
        window.location.href = formData.role === "STAFF" ? "/staff" : "/";
      }, 1000);
    } catch (error: any) {
      // Handle specific error cases
      const errorData = error?.response?.data;
      if (errorData) {
        const newErrors: Record<string, string> = {};

        // Handle field-specific errors
        if (errorData.username) {
          newErrors.username = Array.isArray(errorData.username)
            ? errorData.username[0]
            : errorData.username;
        }
        if (errorData.email) {
          newErrors.email = Array.isArray(errorData.email)
            ? errorData.email[0]
            : errorData.email;
        }
        if (errorData.password) {
          newErrors.password = Array.isArray(errorData.password)
            ? errorData.password[0]
            : errorData.password;
        }
        if (errorData.non_field_errors) {
          newErrors.general = Array.isArray(errorData.non_field_errors)
            ? errorData.non_field_errors[0]
            : errorData.non_field_errors;
        }

        // Set specific errors or fallback to general
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
        } else {
          setErrors({
            general:
              "Registration failed. Please check your information and try again.",
          });
        }
      } else {
        setErrors({
          general:
            "Registration failed. Please check your connection and try again.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Safe debug logging (no sensitive data)
    if (name !== "password" && name !== "password_confirm") {
      console.log(`Field changed: ${name}`);
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" className="min-h-screen" />;
  }

  const roleOptions = [
    { value: "PASSENGER", label: "Passenger" },
    { value: "STAFF", label: "Staff Member" },
  ];

  const departmentOptions = [
    { value: "", label: "Select Department" },
    { value: "Baggage Handling", label: "Baggage Handling" },
    { value: "Security", label: "Security" },
    { value: "Ground Operations", label: "Ground Operations" },
    { value: "Customer Service", label: "Customer Service" },
    { value: "Management", label: "Management" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Uganda Airlines Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url(https://www.allugandasafaris.com/wp-content/uploads/2023/01/Uganda-Airlines-Destinations.jpg)",
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
                <UserPlus className="h-12 w-12 text-blue-600" />
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-bold text-white">AERO UTAMU</h1>
                <p className="text-blue-100 text-sm">Smart Baggage Tracker</p>
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              Join Our Journey
            </h2>
            <p className="text-blue-100">Create your account to get started</p>
          </div>

          {/* Registration Form */}
          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8 border border-white/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* General Error */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-600">{errors.general}</p>
                </div>
              )}

              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <UserPlus className="h-5 w-5 mr-2" />
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="First Name"
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="John"
                    error={errors.first_name?.[0]}
                  />

                  <Input
                    label="Last Name"
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Doe"
                    error={errors.last_name?.[0]}
                  />
                </div>

                <Input
                  label="Username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                  error={errors.username?.[0]}
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  error={errors.email?.[0]}
                  required
                />

                <Select
                  label="Account Type"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  options={roleOptions}
                  error={errors.role?.[0]}
                />
              </div>

              {/* Staff Information (conditional) */}
              {formData.role === "STAFF" && (
                <div className="space-y-4 border-t pt-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Staff Information
                  </h3>

                  <Input
                    label="Employee ID"
                    type="text"
                    name="employee_id"
                    value={formData.employee_id}
                    onChange={handleChange}
                    placeholder="EMP001"
                    error={errors.employee_id?.[0]}
                  />

                  <Select
                    label="Department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    options={departmentOptions}
                    error={errors.department?.[0]}
                  />
                </div>
              )}

              {/* Password Fields */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-medium text-gray-900">Security</h3>

                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                    error={errors.password?.[0] || errors.password}
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

                <div className="relative">
                  <Input
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    name="password_confirm"
                    value={formData.password_confirm}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    error={
                      errors.password_confirm?.[0] || errors.password_confirm
                    }
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                isLoading={isSubmitting}
                disabled={
                  !formData.username ||
                  !formData.email ||
                  !formData.password ||
                  !formData.password_confirm
                }
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            {/* Additional Links */}
            <div className="mt-6 space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
