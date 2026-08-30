"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Payment() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePayment = async () => {
    setError("");

    // Basic validation
    if (card.length !== 16 || expiry.length < 4 || cvv.length !== 3) {
      setError("Please enter valid card details.");
      return;
    }

    // Get booking data from localStorage
    const bookingDataRaw = localStorage.getItem("pendingBooking");
    const bookingData = bookingDataRaw ? JSON.parse(bookingDataRaw) : null;

    if (!bookingData) {
      setError("No booking found. Please plan your trip again.");
      return;
    }

    setLoading(true);

    try {
      // Fake payment delay
      await new Promise((res) => setTimeout(res, 1200));

      // ✅ Send correct booking payload
     const res = await fetch(
  "http://127.0.0.1:8000/api/bookings/create/",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      destination: bookingData.destination_id,
      hotel: bookingData.hotel_id,
      stay_days: bookingData.stay_days,
      total_cost: bookingData.total_cost,
      journey_date: bookingData.journey_date,
      travel_mode: bookingData.travel_mode,
    }),
  }
);
        
      

      if (!res.ok) throw new Error("Booking failed");

      // Clear temp booking data
      localStorage.removeItem("pendingBooking");

      // Redirect to booking history
      router.push("/booking-history");
    } catch (err) {
      setError("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-sky-100 flex items-center justify-center px-6">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-emerald-100"
      >

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 mb-3 text-xl">
            🔒
          </div>
          <h1 className="text-3xl font-extrabold text-emerald-700">
            Secure Payment
          </h1>
          <p className="text-gray-500 text-sm mt-1">
           please provide valid payment details
          </p>
        </div>

        {/* Card Number */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Card Number
          </label>
          <input
            type="text"
            maxLength={16}
            value={card}
            onChange={(e) => setCard(e.target.value)}
            placeholder="4111111111111111"
            className="w-full px-5 py-4 rounded-xl border border-gray-300
            focus:ring-2 focus:ring-emerald-400 focus:outline-none transition"
          />
        </div>

        {/* Expiry & CVV */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Expiry
            </label>
            <input
              placeholder="MM/YY"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="w-full px-5 py-4 rounded-xl border border-gray-300
              focus:ring-2 focus:ring-emerald-400 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              CVV
            </label>
            <input
              type="password"
              maxLength={3}
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              placeholder="123"
              className="w-full px-5 py-4 rounded-xl border border-gray-300
              focus:ring-2 focus:ring-emerald-400 focus:outline-none transition"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-600 text-sm text-center mb-5">
            {error}
          </p>
        )}

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full py-4 rounded-xl font-semibold text-white
          bg-gradient-to-r from-emerald-600 to-green-600
          shadow-lg hover:scale-[1.02] transition
          disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Processing Payment..." : "Pay & Confirm Booking"}
        </button>

      </motion.div>
    </div>
  );
}
