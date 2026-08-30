"use client";
import { useEffect, useState } from "react";

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/bookings/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => res.json())
      .then(setBookings);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

      {bookings.map(b => (
        <div key={b.id} className="bg-white rounded-xl shadow p-6 mb-4">
          <h2 className="font-semibold text-lg">{b.destination_name}</h2>
          <p>Hotel: {b.hotel_name}</p>
          <p>Days: {b.stay_days}</p>
          <p>Total: ₹{b.total_cost}</p>

          {/* STATUS TIMELINE */}
          <div className="mt-3 flex gap-3">
            <span className={`px-3 py-1 rounded-full text-sm ${
              b.status === "CONFIRMED" ? "bg-green-100 text-green-700" :
              b.status === "CANCELLED" ? "bg-red-100 text-red-700" :
              "bg-yellow-100 text-yellow-700"
            }`}>
              {b.status}
            </span>
          </div>

          {/* ACTIONS */}
          {b.status === "CONFIRMED" && (
            <button
              onClick={() => cancelBooking(b.id)}
              className="mt-4 text-red-600 font-semibold"
            >
              Cancel Booking
            </button>
          )}

          <button className="ml-4 text-emerald-600 font-semibold">
            Download Ticket
          </button>
        </div>
      ))}
    </div>
  );
}

function cancelBooking(id) {
  fetch(`http://127.0.0.1:8000/api/bookings/${id}/cancel/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }).then(() => location.reload());
}
