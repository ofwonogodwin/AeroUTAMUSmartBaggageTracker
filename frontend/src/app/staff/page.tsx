"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/FormElements";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import QRScanner from "@/components/QRScanner";
import { formatDateTime } from "@/lib/utils";
import { baggageAPI } from "@/lib/api";
import { Baggage, StatusUpdate, DashboardStats } from "@/types";
import {
  Plane,
  Search,
  Package,
  Clock,
  Edit,
  TrendingUp,
  Activity,
  Camera,
  X,
  LogOut,
} from "lucide-react";

export default function StaffDashboard() {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();

  // State management
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [baggage, setBaggage] = useState<Baggage[]>([]);
  const [recentUpdates, setRecentUpdates] = useState<StatusUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedBaggage, setSelectedBaggage] = useState<Baggage | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    status: "",
    location: "",
    notes: "",
  });

  // Authentication check
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !user?.is_staff_member)) {
      router.push("/staff-login");
    }
  }, [authLoading, isAuthenticated, user, router]);

  // Load dashboard data
  useEffect(() => {
    if (isAuthenticated && user?.is_staff_member) {
      loadDashboardData();
    }
  }, [isAuthenticated, user]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const baggageData = await baggageAPI.getAll();
      setBaggage(baggageData.results);

      // Calculate stats
      const stats: DashboardStats = {
        total_baggage: baggageData.results.length,
        status_counts: {
          CHECKED_IN: { count: 0, display: "Checked In" },
          SECURITY_CLEARED: { count: 0, display: "Security Cleared" },
          LOADED: { count: 0, display: "Loaded" },
          IN_FLIGHT: { count: 0, display: "In Flight" },
          ARRIVED: { count: 0, display: "Arrived" },
        },
        recent_updates: [],
      };

      const allUpdates: StatusUpdate[] = [];
      baggageData.results.forEach((bag) => {
        if (stats.status_counts[bag.current_status]) {
          stats.status_counts[bag.current_status].count++;
        }
        if (bag.status_timeline) {
          allUpdates.push(...bag.status_timeline);
        }
      });

      const sortedUpdates = allUpdates
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
        .slice(0, 10);

      stats.recent_updates = sortedUpdates;
      setStats(stats);
      setRecentUpdates(sortedUpdates);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setError("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadDashboardData();
      return;
    }

    try {
      setIsLoading(true);
      const searchData = await baggageAPI.getAll({
        search: searchQuery,
        status: statusFilter ? (statusFilter as any) : undefined,
      });
      setBaggage(searchData.results);
    } catch (error) {
      console.error("Search error:", error);
      setError("Search failed");
    } finally {
      setIsLoading(false);
    }
  };

  const openUpdateModal = (baggageItem: Baggage) => {
    setSelectedBaggage(baggageItem);
    setUpdateForm({
      status: baggageItem.current_status,
      location: "",
      notes: "",
    });
    setError("");
    setSuccessMessage("");
    setShowUpdateModal(true);
  };

  const closeModal = () => {
    if (!isUpdating) {
      setShowUpdateModal(false);
      setSelectedBaggage(null);
      setUpdateForm({ status: "", location: "", notes: "" });
      setError("");
      setSuccessMessage("");
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedBaggage || !updateForm.status) {
      setError("Please select a status");
      return;
    }

    try {
      setIsUpdating(true);
      setError("");

      const updatedBaggage = await baggageAPI.updateStatus(selectedBaggage.id, {
        status: updateForm.status as any,
        location: updateForm.location,
        notes: updateForm.notes,
      });

      // Update the baggage in the list
      setBaggage((prevBaggage) =>
        prevBaggage.map((bag) =>
          bag.id === selectedBaggage.id ? updatedBaggage : bag
        )
      );

      setSuccessMessage("Baggage status updated successfully!");
      setTimeout(() => {
        closeModal();
        loadDashboardData();
      }, 1500);
    } catch (error: any) {
      console.error("Update error:", error);
      let errorMessage = "Failed to update baggage status";

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { error?: string; message?: string } };
        };
        if (axiosError.response?.data?.error) {
          errorMessage = axiosError.response.data.error;
        } else if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      }

      setError(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  // Filter baggage based on search and status
  const filteredBaggage = baggage.filter((bag) => {
    const matchesSearch =
      !searchQuery ||
      bag.passenger_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bag.qr_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (bag.flight_number &&
        bag.flight_number.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = !statusFilter || bag.current_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "CHECKED_IN", label: "Checked In" },
    { value: "SECURITY_CLEARED", label: "Security Cleared" },
    { value: "LOADED", label: "Loaded" },
    { value: "IN_FLIGHT", label: "In Flight" },
    { value: "ARRIVED", label: "Arrived" },
  ];

  if (authLoading || isLoading) {
    return <LoadingSpinner size="lg" className="min-h-screen" />;
  }

  if (!isAuthenticated || !user?.is_staff_member) {
    return null;
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #faf8f6 0%, #f7f5f3 100%)",
      }}
    >
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg shadow-md">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-stone-800">AERO UTAMU</h1>
                <p className="text-xs text-amber-600 font-medium">
                  Staff Dashboard
                </p>
              </div>
            </div>
            <Button
              onClick={() => {
                logout();
                router.push("/staff-login");
              }}
              variant="outline"
              size="sm"
              className="border-stone-300 text-stone-700 hover:bg-stone-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-stone-600">
                    Total Baggage
                  </p>
                  <p className="text-2xl font-bold text-stone-800">
                    {stats.total_baggage}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-stone-600">
                    In Transit
                  </p>
                  <p className="text-2xl font-bold text-stone-800">
                    {stats.status_counts.IN_FLIGHT?.count || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-stone-600">Arrived</p>
                  <p className="text-2xl font-bold text-stone-800">
                    {stats.status_counts.ARRIVED?.count || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-stone-600">
                    Recent Updates
                  </p>
                  <p className="text-2xl font-bold text-stone-800">
                    {recentUpdates.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <Input
                label="Search Baggage"
                type="text"
                placeholder="Search by QR code, passenger name, or flight number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div className="w-full sm:w-48">
              <Select
                label="Filter by Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={statusOptions}
              />
            </div>
            <Button
              onClick={handleSearch}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button
              onClick={() => setShowScanner(true)}
              variant="outline"
              className="border-amber-300 text-amber-700 hover:bg-amber-50"
            >
              <Camera className="h-4 w-4 mr-2" />
              Scan QR
            </Button>
          </div>
        </div>

        {/* Baggage Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-200">
            <h3 className="text-lg font-medium text-stone-900">
              Baggage Management
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-stone-200">
              <thead className="bg-stone-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                    QR Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Passenger
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Flight
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-stone-200">
                {filteredBaggage.map((bag, index) => (
                  <tr
                    key={bag.id || `bag-${index}`}
                    className="hover:bg-stone-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-900">
                      {bag.qr_code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-900">
                      {bag.passenger_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-900">
                      {bag.flight_number || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge
                        status={bag.current_status || "CHECKED_IN"}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                      {formatDateTime(bag.updated_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        onClick={() => openUpdateModal(bag)}
                        size="sm"
                        variant="outline"
                        className="border-blue-300 text-blue-700 hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Update
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredBaggage.length === 0 && (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-stone-400" />
                <h3 className="mt-2 text-sm font-medium text-stone-900">
                  No baggage found
                </h3>
                <p className="mt-1 text-sm text-stone-500">
                  Try adjusting your search terms or filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      <QRScanner
        isOpen={showScanner}
        onScan={(code) => {
          setSearchQuery(code);
          setShowScanner(false);
          handleSearch();
        }}
        onClose={() => setShowScanner(false)}
      />

      {/* Update Status Modal */}
      {showUpdateModal && selectedBaggage && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(250, 248, 246, 0.95) 0%, rgba(247, 245, 243, 0.95) 100%)",
          }}
        >
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            {!isUpdating && (
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>
            )}

            <div className="p-6">
              <div className="flex items-center mb-4">
                <Package className="h-6 w-6 text-blue-600 mr-2" />
                <div>
                  <h3 className="text-lg font-medium text-stone-900">
                    Update Baggage Status
                  </h3>
                  <p className="text-sm text-stone-500">
                    {selectedBaggage.qr_code}
                  </p>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {successMessage && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-sm">{successMessage}</p>
                </div>
              )}

              <div className="space-y-4 mb-6">
                <Select
                  label="New Status"
                  value={updateForm.status}
                  onChange={(e) => {
                    setUpdateForm({ ...updateForm, status: e.target.value });
                    setError("");
                  }}
                  options={statusOptions.slice(1)}
                  disabled={isUpdating}
                />
                <Input
                  label="Location"
                  type="text"
                  value={updateForm.location}
                  onChange={(e) =>
                    setUpdateForm({ ...updateForm, location: e.target.value })
                  }
                  placeholder="e.g., Gate A12, Baggage Claim 3"
                  disabled={isUpdating}
                />
                <Input
                  label="Notes"
                  type="text"
                  value={updateForm.notes}
                  onChange={(e) =>
                    setUpdateForm({ ...updateForm, notes: e.target.value })
                  }
                  placeholder="Additional notes (optional)"
                  disabled={isUpdating}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleStatusUpdate}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  disabled={!updateForm.status || isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Updating...
                    </>
                  ) : (
                    "Update Status"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={closeModal}
                  className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-50"
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
