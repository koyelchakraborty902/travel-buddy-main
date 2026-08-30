"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/bookings/history/")
      .then((res) => res.json())
      .then((data) => {
        setBookings(data);
        setLoading(false);
      });
  }, []);

  const cancelBooking = async (id) => {
    await fetch(`http://127.0.0.1:8000/api/bookings/cancel/${id}/`, {
      method: "POST",
    });
    location.reload();
  };
  const deleteBooking = async (id) => {
  if (!confirm("Are you sure you want to delete this booking?")) return;

  await fetch(`http://127.0.0.1:8000/api/bookings/${id}/delete/`, {
    method: "DELETE",
  });

  // Remove from UI instantly
  setBookings(bookings.filter(b => b.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-sky-100 px-4 sm:px-6 py-10">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-6xl mx-auto text-center mb-10"
      >
        <p className="text-4xl font-extrabold text-emerald-700">
          My Booking History
        </p>
        <p className="text-gray-500 mt-2">
          View your trips, download tickets, or cancel bookings
        </p>
      </motion.div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-500">Loading bookings...</p>
      )}

      {/* Empty State */}
      {!loading && bookings.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center text-gray-500 mt-20">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1999/1999632.png"
            className="w-28 mb-4 opacity-70"
            alt="No Bookings"
          />
          <p className="text-lg font-medium">No bookings found</p>
          <p className="text-sm mt-1">
            Plan a trip to see your booking history here.
          </p>
        </div>
      )}

      {/* Booking Cards */}
      <div className="max-w-6xl mx-auto grid gap-6">
        {bookings.map((b, index) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="bg-white rounded-2xl shadow-lg border border-emerald-100 
            overflow-hidden flex flex-col md:flex-row"
          >

            {/* Destination Image */}
            <div className="md:w-48 h-40 md:h-auto overflow-hidden">
              <img
                src={b.destination.image}
                alt={b.destination.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Booking Info */}
            <div className="flex-1 p-5">
              <h2 className="text-xl font-bold text-emerald-800">
                {b.destination.name}
              </h2>

              <p className="text-gray-600 mt-1">
                Hotel: <span className="font-medium">{b.hotel.name}</span>
              </p>

              <p className="text-gray-600">
                Stay Days: <span className="font-medium">{b.stay_days}</span>
              </p>

              <p className="text-gray-600">
                Total Cost:{" "}
                <span className="font-semibold text-emerald-700">
                  ₹{b.total_cost}
                </span>
              </p>

              {/* Booking Date */}
              <p className="text-sm text-gray-500 mt-1">
                Booked on:{" "}
                {new Date(b.created_at).toLocaleDateString()}
              </p>

              <p className="text-gray-600">
               Journey Date: <b>{b.journey_date}</b>
             </p>

              <p className="text-gray-600">
                Travel Mode: <b>{b.travel_mode}</b>
              </p>
              {/* Status */}
              <div className="mt-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    b.status === "CONFIRMED"
                      ? "bg-emerald-100 text-emerald-700"
                      : b.status === "CANCELLED"
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {b.status}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="p-5 flex md:flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-emerald-100">

              {/* Download */}
              <a
                href={`http://127.0.0.1:8000/api/bookings/ticket/${b.id}/`}
                className="px-4 py-2 rounded-lg bg-gradient-to-r 
                from-emerald-600 to-green-600 text-white text-sm font-semibold 
                shadow hover:scale-105 transition text-center"
              >
                Download Ticket
              </a>
              {b.status === "CANCELLED" && (
  <button
    onClick={() => deleteBooking(b.id)}
    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
  >
    Delete
  </button>
)}



              {/* Cancel */}
              {b.status !== "CANCELLED" && (
                <button
                  onClick={() => cancelBooking(b.id)}
                  className="px-4 py-2 rounded-lg bg-red-500 
                  text-white text-sm font-semibold shadow 
                  hover:bg-red-600 transition"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
