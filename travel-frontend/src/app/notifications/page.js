"use client";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function Notifications() {
  const [notes, setNotes] = useState([]);
const [feedback, setFeedback] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);

// frontend-only feedback submit
  const handleFeedback = () => {
    if (!feedback.trim()) return;
    setFeedbackList([
      ...feedbackList,
      {
        id: Date.now(),
        text: feedback,
        time: new Date().toLocaleString()
      }
    ]);
    setFeedback("");
  };



  // Load notifications
  const loadNotifications = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/notifications/");
    const data = await res.json();
    setNotes(data);
  };

  // Mark all as read
  const markAllRead = async () => {
    await fetch("http://127.0.0.1:8000/api/notifications/mark-read/", {
      method: "POST",
    });
  };

  useEffect(() => {
    loadNotifications();
    markAllRead(); // remove red dot once page opens
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 flex justify-center py-10 px-4">
      <div className="w-full max-w-3xl">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-emerald-800">
            Notifications
          </h1>
          <span className="text-sm text-gray-500">
            {notes.length} total
          </span>
        </div>

        {/* Empty State */}
        {notes.length === 0 && (
          <div className="bg-white p-8 rounded-xl shadow text-center text-gray-500">
            No notifications yet ✨
          </div>
        )}

        {/* Notification List */}
        <div className="space-y-4">
          {notes.map((n) => (
            <div
              key={n.id}
              className={`bg-white p-5 rounded-xl border shadow-sm transition-all
              ${n.is_read ? "border-emerald-100" : "border-emerald-400 shadow-md"}`}
            >
              <div className="flex justify-between items-start">
                <p className="text-gray-800 text-base">
                  {n.message}
                </p>

                {/* 🔴 Red dot only if unread */}
                {!n.is_read && (
                  <span className="w-3 h-3 bg-red-500 rounded-full mt-1"></span>
                )}
              </div>

              <div className="mt-2 text-xs text-gray-500">
                {dayjs(n.created_at).fromNow()}
              </div>
            </div>
          ))}
        </div>

        {/* Feedback Section (Frontend Only) */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-emerald-700 mb-4">
            Give Feedback
          </h2>

          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Write your feedback here..."
            className="w-full border border-emerald-200 rounded-lg p-3 focus:outline-none focus:border-emerald-400"
          />

          <button
            onClick={handleFeedback}
            className="mt-3 bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 transition"
          >
            Submit
          </button>

          {/* Display Feedback List */}
          {feedbackList.length > 0 && (
            <div className="mt-5 space-y-3">
              <h3 className="text-sm font-semibold text-gray-600">
                Recent Feedback
              </h3>

              {feedbackList.map(f => (
                <div key={f.id} className="border rounded-lg p-3 text-sm">
                  <p>{f.text}</p>
                  <span className="text-gray-400 text-xs">{f.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
