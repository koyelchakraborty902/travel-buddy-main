"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Profile() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  // Load user
  useEffect(() => {
    const storedUser = localStorage.getItem("travelUser");
    if (!storedUser) {
      router.push("/login");
    } else {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setFormData(parsed);
    }
  }, [router]);

  if (!user) return null;

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Photo upload
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, photo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Save
  const handleSave = () => {
    setUser(formData);
    localStorage.setItem("travelUser", JSON.stringify(formData));
    setEditMode(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 flex items-center justify-center px-6 py-16">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl 
        shadow-2xl border border-emerald-100 overflow-hidden"
      >

        {/* HEADER */}
        <div className="relative h-32 bg-gradient-to-r from-emerald-700 to-green-500">
          <div className="absolute inset-x-0 -bottom-16 flex justify-center">
            <div className="relative">
              <img
                src={formData.photo || "https://i.pravatar.cc/150?img=12"}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
              />

              {editMode && (
                <label className="absolute bottom-2 right-2 bg-emerald-600 
                text-white p-2 rounded-full shadow-md cursor-pointer hover:bg-emerald-700 transition">
                  ✏️
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="pt-20 px-8 pb-8 text-center">

          {/* NAME */}
          {editMode ? (
            <input
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              placeholder="Your name"
              className="w-full text-center text-xl font-semibold p-3 rounded-xl border
              focus:ring-2 focus:ring-emerald-400 outline-none mb-2"
            />
          ) : (
            <h1 className="text-2xl font-bold text-emerald-700 mb-1">
              {formData.name || "Traveler"}
            </h1>
          )}

          {/* EMAIL */}
          {editMode ? (
            <input
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              placeholder="Email"
              className="w-full text-center p-3 rounded-xl border
              focus:ring-2 focus:ring-emerald-400 outline-none mb-4"
            />
          ) : (
            <p className="text-gray-600 mb-4">{formData.email}</p>
          )}

          {/* INFO CARDS */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-emerald-50 rounded-xl p-3 shadow-sm">
              <p className="text-xs text-gray-500">Membership</p>
              {editMode ? (
                <select
                  name="membership"
                  value={formData.membership || "Free"}
                  onChange={handleChange}
                  className="w-full text-sm border rounded-lg mt-1"
                >
                  <option>Free</option>
                  <option>Premium</option>
                </select>
              ) : (
                <p className="font-semibold text-emerald-700">
                  {formData.membership || "Free"}
                </p>
              )}
            </div>

            <div className="bg-emerald-50 rounded-xl p-3 shadow-sm">
              <p className="text-xs text-gray-500">Trips</p>
              <p className="font-semibold text-emerald-700">
                {formData.trips || 0}
              </p>
            </div>

            <div className="bg-emerald-50 rounded-xl p-3 shadow-sm">
              <p className="text-xs text-gray-500">Last Login</p>
              <p className="text-xs text-gray-700">
                {formData.loginTime || "—"}
              </p>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          {editMode ? (
            <div className="space-y-3">
              <button
                onClick={handleSave}
                className="w-full bg-emerald-600 hover:bg-emerald-700
                text-white py-3 rounded-xl font-semibold shadow-md transition"
              >
                Save Changes
              </button>

              <button
                onClick={() => setEditMode(false)}
                className="w-full bg-gray-100 hover:bg-gray-200
                text-gray-700 py-3 rounded-xl font-semibold transition"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="w-full bg-emerald-600 hover:bg-emerald-700
              text-white py-3 rounded-xl font-semibold shadow-md transition"
            >
              Edit Profile
            </button>
          )}

          {/* BOOKING HISTORY BUTTON */}
          <Link href="/booking-history">
            <div className="mt-5 w-full border border-emerald-400 rounded-xl 
            py-3 text-center font-semibold text-emerald-700 
            hover:bg-emerald-50 hover:border-emerald-500 
            transition shadow-sm">
              📑 My Booking History
            </div>
          </Link>

        </div>
      </motion.div>
    </div>
  );
}
