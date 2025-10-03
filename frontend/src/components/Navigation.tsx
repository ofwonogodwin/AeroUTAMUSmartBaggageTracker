"use client";

import Link from "next/link";
import { Plane } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import SignOutButton from "./SignOutButton";
import { Button } from "./ui/Button";

interface NavigationProps {
  title?: string;
  showTrackButton?: boolean;
}

export default function Navigation({
  title = "Smart Baggage Tracker",
  showTrackButton = true,
}: NavigationProps) {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Plane className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">{title}</span>
          </Link>

          <div className="flex items-center space-x-4">
            {showTrackButton && (
              <Link href="/track">
                <button className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md transition-colors">
                  Track Baggage
                </button>
              </Link>
            )}
            {isAuthenticated ? (
              <SignOutButton />
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
