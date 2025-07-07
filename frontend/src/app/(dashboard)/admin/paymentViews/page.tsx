"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import toast from "react-hot-toast";
import Pagination from "@/components/Pagination";
import { PaymentDto } from "@/types/Payment";
import { PagedResponse } from "@/types/PagedResponse";
import { FiSearch } from "react-icons/fi";

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "COMPLETED", label: "Completed" },
  { value: "REFUNDED", label: "Refunded" },
  { value: "PENDING", label: "Pending" },
];

const statusColors: Record<string, string> = {
  COMPLETED: "bg-green-100 text-green-800",
  REFUNDED: "bg-yellow-100 text-yellow-800",
  PENDING: "bg-blue-100 text-blue-800",
};

export default function PaymentsListPage() {
  const [payments, setPayments] = useState<PaymentDto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [processingRefundId, setProcessingRefundId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchPayments();
  }, [currentPage, pageSize, searchTerm, statusFilter, refreshKey]);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get<PagedResponse<PaymentDto>>("/api/payments", {
        params: {
          page: currentPage - 1,
          size: pageSize,
          search: searchTerm || undefined,
          status: statusFilter || undefined,
        },
      });

      setPayments(res.data.content);
      setTotalPages(res.data.page.totalPages);
    } catch {
      toast.error("Failed to load payments");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefund = async (paymentId: number) => {
    if (!confirm("Are you sure you want to refund this payment?")) return;
    setProcessingRefundId(paymentId);
    try {
      await apiClient.post(`/api/payments/${paymentId}/refund`);
      toast.success("Refund successful");
      setRefreshKey((prev) => prev + 1);
    } catch {
      toast.error("Refund failed");
    } finally {
      setProcessingRefundId(null);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "-" : date.toLocaleString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Payment History</h1>
      </div>

      {/* Search and filter bar */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow text-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by doctor/patient..."
            className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="p-2 border border-gray-300 rounded-md text-sm w-full md:w-auto"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        {isLoading ? (
          <div className="p-6 flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : payments.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No payments found.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "ID",
                  "Appointment",
                  "Doctor",
                  "Amount",
                  "Status",
                  "Method",
                  "Paid At",
                  "Action",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-500">{p.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{p.appointmentId}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{p.doctorName}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ${p.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        statusColors[p.paymentStatus] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {p.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{p.paymentMethod || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(p.paidAt)}</td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    {p.paymentStatus !== "REFUNDED" ? (
                      <button
                        onClick={() => handleRefund(p.id)}
                        disabled={processingRefundId === p.id}
                        className={`text-blue-600 hover:text-blue-900 ${
                          processingRefundId === p.id ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {processingRefundId === p.id ? "Processing..." : "Refund"}
                      </button>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
