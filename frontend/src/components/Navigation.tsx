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
    <nav className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg shadow-md">
              <Plane className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-stone-800">
                AERO UTAMU
              </span>
              <p className="text-xs text-amber-600 font-medium">{title}</p>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            {showTrackButton && (
              <Link href="/track">
                <button className="text-sm text-stone-600 hover:text-blue-600 px-3 py-2 rounded-md transition-all duration-200 hover:scale-105">
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
                    className="text-stone-600 hover:text-blue-600"
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
