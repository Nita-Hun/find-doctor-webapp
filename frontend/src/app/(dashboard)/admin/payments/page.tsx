"use client";

import React, { useEffect, useState, useMemo } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/api-client";
import { Appointment } from "@/types/Payment";


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PaymentPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState({
    appointments: true,
    paymentIntent: false
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Filter appointments based on search term
  const filteredAppointments = useMemo(() => {
    return appointments.filter(appt => 
      appt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (appt.doctorSpecialty && appt.doctorSpecialty.toLowerCase().includes(searchTerm.toLowerCase())) ||
      appt.dateTime.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appt.amount.toString().includes(searchTerm)
 ) }, [appointments, searchTerm]);

  const loadUnpaidAppointments = async () => {
    setLoading(prev => ({...prev, appointments: true}));
    try {
      const { data } = await apiClient.get<Appointment[]>("/api/payments/unpaid-appointments");
      setAppointments(data);
    } catch {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(prev => ({...prev, appointments: false}));
    }
  };

  useEffect(() => {
    loadUnpaidAppointments();
  }, []);

  useEffect(() => {
    const createPaymentIntent = async () => {
      if (!selectedAppointment) {
        setClientSecret(null);
        return;
      }
      
      setLoading(prev => ({...prev, paymentIntent: true}));
      try {
        const amountInCents = Math.round(selectedAppointment.amount * 100);
        const { data } = await apiClient.post("/api/payments/create-payment-intent", {
          appointmentId: selectedAppointment.id,
          amountInCents,
          currency: "usd",
        });
        setClientSecret(data.clientSecret);
      } catch {
        toast.error("Failed to initialize payment");
      } finally {
        setLoading(prev => ({...prev, paymentIntent: false}));
      }
    };

    createPaymentIntent();
  }, [selectedAppointment]);

  const handlePaymentSuccess = () => {
    toast.success("Payment completed successfully");
    setClientSecret(null);
    setSelectedAppointment(null);
    setSearchTerm("");
    loadUnpaidAppointments();
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden text-sm">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <h1 className="text-2xl font-semibold text-gray-800">Complete Your Payment</h1>
          <p className="text-gray-500 mt-1 text-sm">Secure and easy payment process</p>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Left Panel - Appointment List */}
          <div className="w-full md:w-1/2 p-6 border-r border-gray-200">
            <div className="mb-4">
              <h2 className="text-lg font-medium text-gray-700 mb-2">Select Appointment</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search appointments..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {loading.appointments ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse h-20 bg-gray-100 rounded-lg"></div>
                ))}
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="text-center py-8 border border-gray-200 rounded-lg bg-gray-50">
                {searchTerm ? (
                  <>
                    <svg
                      className="mx-auto h-10 w-10 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="mt-3 text-sm font-medium text-gray-900">No matching appointments</h3>
                    <p className="mt-1 text-sm text-gray-500">Try adjusting your search</p>
                    <button
                      onClick={() => setSearchTerm("")}
                      className="mt-4 text-sm text-blue-600 hover:text-blue-800"
                    >
                      Clear search
                    </button>
                  </>
                ) : (
                  <>
                    <svg
                      className="mx-auto h-10 w-10 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <h3 className="mt-3 text-sm font-medium text-gray-900">No unpaid appointments</h3>
                    <p className="mt-1 text-sm text-gray-500">All appointments are paid</p>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {filteredAppointments.map((appt) => (
                  <button
                    key={appt.id}
                    onClick={() => setSelectedAppointment(appt)}
                    className={`w-full p-4 rounded-lg border transition-all text-left ${
                      selectedAppointment?.id === appt.id
                        ? "border-blue-500 bg-blue-50 ring-1 ring-blue-200"
                        : "border-gray-200 hover:border-gray-300 hover:bg-blue-100"
                    }`}
                  >
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{appt.doctorName}</h3>
                        {appt.doctorSpecialty && (
                          <p className="text-xs text-gray-500 mt-0.5">{appt.doctorSpecialty}</p>
                        )}
                      </div>
                      <span className="text-sm font-medium text-blue-600">
                        ${appt.amount.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(appt.dateTime).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Panel - Payment Form */}
          <div className="w-full md:w-1/2 p-6">
            <h2 className="text-lg font-medium text-gray-700 mb-4">Payment Details</h2>
            
            {!selectedAppointment ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-4 text-sm font-medium text-gray-900">Select an appointment</h3>
                <p className="mt-1 text-sm text-gray-500">Choose an appointment from the list to proceed</p>
              </div>
            ) : loading.paymentIntent ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm 
                  clientSecret={clientSecret} 
                  onPaymentSuccess={handlePaymentSuccess}
                  appointment={selectedAppointment}
                />
              </Elements>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <p>Unable to initialize payment</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ... (Keep the CheckoutForm component the same as before)

function CheckoutForm({ 
  clientSecret, 
  onPaymentSuccess,
  appointment
}: {
  clientSecret: string;
  onPaymentSuccess: () => void;
  appointment: Appointment;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setMessage(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    });

    if (error) {
      setMessage(error.message || "Payment failed");
    } else if (paymentIntent?.status === "succeeded") {
      onPaymentSuccess();
    }

    setProcessing(false);
  };

  return (
    <div className="space-y-6">
      {/* Appointment Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-700 mb-2">Appointment Summary</h3>
        <div className="flex justify-between text-sm">
          <div>
            <p className="text-gray-600">{appointment.doctorName}</p>
            <p className="text-gray-400 text-xs mt-1">
              {new Date(appointment.dateTime).toLocaleString()}
            </p>
          </div>
          <p className="font-medium text-gray-900">
            ${appointment.amount.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Information
          </label>
          <div className="border border-gray-200 rounded-lg p-3 bg-white">
            <CardElement
              options={{
                hidePostalCode: true,
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#111827',
                    '::placeholder': {
                      color: '#9CA3AF',
                    },
                  },
                  invalid: {
                    color: '#EF4444',
                  },
                },
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!stripe || processing}
          className={`w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors ${
            processing ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {processing ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            `Pay $${appointment.amount.toFixed(2)}`
          )}
        </button>

        {message && (
          <div className={`text-sm p-3 rounded-lg text-center ${
            message.includes("failed") ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
          }`}>
            {message}
          </div>
        )}

        <div className="flex items-center justify-center text-xs text-gray-500 mt-4">
          <svg className="h-4 w-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Payments are secure and encrypted
        </div>
      </form>
    </div>
  );
}