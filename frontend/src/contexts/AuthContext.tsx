"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, LoginCredentials, RegisterData, AuthTokens } from "@/types";
import { authAPI } from "@/lib/api";
import { storage } from "@/lib/utils";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  staffLogin: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserInfo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!tokens;

  // Debug authentication state
  useEffect(() => {
    console.log("Auth state debug:", {
      hasUser: !!user,
      hasTokens: !!tokens,
      isAuthenticated,
      user: user ? { id: user.id, username: user.username } : null,
      tokens: tokens
        ? { hasAccess: !!tokens.access, hasRefresh: !!tokens.refresh }
        : null,
    });
  }, [user, tokens, isAuthenticated]);

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Clean up any corrupted localStorage data first
        storage.cleanupCorruptedData();

        const storedTokens = storage.get("auth_tokens");
        const storedUser = storage.get("user");

        if (storedTokens && storedUser) {
          console.log("Restoring auth from storage:", {
            user: storedUser,
            hasTokens: !!storedTokens,
            tokenDetails: {
              hasAccess: storedTokens?.access ? "YES" : "NO",
              hasRefresh: storedTokens?.refresh ? "YES" : "NO",
              accessPreview: storedTokens?.access
                ? storedTokens.access.substring(0, 20) + "..."
                : "NONE",
            },
          });
          // Set tokens and user BEFORE token verification to prevent race condition
          setTokens(storedTokens);
          setUser(storedUser);

          // Set loading to false immediately after restoring from storage
          setIsLoading(false);

          // Verify token validity in background
          try {
            console.log("Attempting token verification...");
            const { user: currentUser } = await authAPI.getUserInfo();
            setUser(currentUser);
            storage.set("user", currentUser);
            console.log(
              "Token verification successful - auth should be YES now"
            );
          } catch (error) {
            console.log(
              "Token verification failed - checking if this is a fresh login"
            );

            // Check if this is a recent login (within last 10 seconds)
            const lastLoginTime = storage.get("last_login_time");
            const isRecentLogin =
              lastLoginTime && Date.now() - lastLoginTime < 10000;

            if (isRecentLogin) {
              console.log(
                "This was a recent fresh login - NOT clearing auth state"
              );
              // Don't clear state for fresh logins, token might just need time to propagate
            } else {
              console.log(
                "This is an old session with invalid token - clearing auth state"
              );
              // Token is invalid, clear storage completely
              storage.remove("auth_tokens");
              storage.remove("user");
              storage.remove("last_login_time");
              setTokens(null);
              setUser(null);
            }
            setIsLoading(false);
          }
        } else {
          // No stored auth data, set loading to false
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      console.log("ATTEMPTING LOGIN with credentials:", credentials.username);
      const response = await authAPI.login(credentials);

      console.log("Login successful, setting user and tokens:", response.user);
      console.log("FULL API RESPONSE:", response);
      console.log("Tokens received:", {
        hasAccess: !!response.tokens?.access,
        hasRefresh: !!response.tokens?.refresh,
        tokens: response.tokens,
      });

      setUser(response.user);
      setTokens(response.tokens);

      // Store in localStorage
      storage.set("user", response.user);
      storage.set("auth_tokens", response.tokens);
      console.log("Auth data stored in localStorage");

      // Mark this as a fresh login to prevent token verification from clearing it
      storage.set("last_login_time", Date.now());

      // Verify authentication state immediately after setting
      console.log("Auth state after login:", {
        hasUser: !!response.user,
        hasTokens: !!response.tokens,
        shouldBeAuthenticated: !!(response.user && response.tokens),
      });

      // Double-check that state was set correctly
      setTimeout(() => {
        const currentAuth = !!user && !!tokens;
        console.log("Auth state 1 second after login:", {
          currentUser: user?.username,
          hasTokens: !!tokens,
          isAuthenticated: currentAuth,
          actualIsAuthenticated: isAuthenticated,
        });
      }, 1000);

      const roleText = response.user.is_staff_member
        ? "Staff Member"
        : "Passenger";
      toast.success(`Welcome back! Logged in as ${roleText}`);
    } catch (error: any) {
      console.error("Login error:", error?.response?.status);

      // Extract meaningful error message
      const errorData = error?.response?.data;
      let message = "Login failed";

      if (errorData) {
        if (errorData.detail) {
          message = errorData.detail;
        } else if (errorData.error) {
          message = errorData.error;
        } else if (
          errorData.non_field_errors &&
          Array.isArray(errorData.non_field_errors)
        ) {
          message = errorData.non_field_errors[0];
        }
      } else if (error?.response?.status === 401) {
        message = "Invalid username or password";
      } else if (error?.response?.status === 400) {
        message = "Please check your login information";
      }

      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const staffLogin = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const response = await authAPI.staffLogin(credentials);

      setUser(response.user);
      setTokens(response.tokens);

      // Store in localStorage
      storage.set("user", response.user);
      storage.set("auth_tokens", response.tokens);

      toast.success("Welcome! Staff login successful");
    } catch (error: any) {
      const message = error.response?.data?.error || "Staff login failed";
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      console.log("Starting registration process...");
      const response = await authAPI.register(data);
      console.log("Registration response:", response);

      setUser(response.user);
      setTokens(response.tokens);

      // Store in localStorage
      storage.set("user", response.user);
      storage.set("auth_tokens", response.tokens);

      const roleText = response.user.is_staff_member
        ? "Staff Member"
        : "Passenger";
      toast.success(`Account created successfully! Welcome as ${roleText}`);
    } catch (error: any) {
      console.error("Registration error:", error?.response?.status);
      // Don't log sensitive error data

      // Extract meaningful error message
      const errorData = error?.response?.data;
      let message = "Registration failed";

      if (errorData) {
        if (errorData.username && Array.isArray(errorData.username)) {
          message = errorData.username[0];
        } else if (errorData.email && Array.isArray(errorData.email)) {
          message = errorData.email[0];
        } else if (errorData.password && Array.isArray(errorData.password)) {
          message = errorData.password[0];
        } else if (
          errorData.non_field_errors &&
          Array.isArray(errorData.non_field_errors)
        ) {
          message = errorData.non_field_errors[0];
        } else if (errorData.error) {
          message = errorData.error;
        } else if (errorData.message) {
          message = errorData.message;
        }
      }

      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    console.log("Logout function called");

    // Save the refresh token before clearing state
    const refreshToken = tokens?.refresh;

    // Clear state and storage immediately to prevent timing issues
    setUser(null);
    setTokens(null);
    storage.remove("user");
    storage.remove("auth_tokens");
    storage.remove("last_login_time");

    try {
      if (refreshToken) {
        console.log("Attempting to blacklist refresh token...");
        await authAPI.logout(refreshToken);
        console.log("Token blacklisted successfully");
      }
    } catch (error) {
      console.error("Logout API error (not critical):", error);
      // Don't throw error - clearing local state is more important
    }

    console.log("Logout completed - all state cleared");
    toast.success("Successfully logged out");
  };

  const refreshUserInfo = async () => {
    try {
      if (isAuthenticated) {
        const { user: currentUser } = await authAPI.getUserInfo();
        setUser(currentUser);
        storage.set("user", currentUser);
      }
    } catch (error) {
      console.error("Failed to refresh user info:", error);
    }
  };

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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
