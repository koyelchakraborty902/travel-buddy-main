"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Auto redirect if already logged in
  useEffect(() => {
    const user = localStorage.getItem("travelUser");
    if (user) router.push("/planner");
  }, [router]);

  const handleLogin = () => {
    setError("");

    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    // Demo session save
    localStorage.setItem(
      "travelUser",
      JSON.stringify({
        username,
        loginTime: new Date().toLocaleString(),
      })
    );

    router.push("/planner");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 via-green-100 to-sky-100 px-6">

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-10"
      >
        
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <div className="text-4xl font-extrabold text-emerald-700">
            TravelBuddy
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Your smart travel companion
          </p>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Sign in to continue
        </h2>

        {/* Username */}
        <label className="text-sm font-semibold text-gray-600">
          Username
        </label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your name"
          className="w-full px-4 py-3 mt-2 mb-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-400 outline-none transition"
        />

        {/* Password */}
        <label className="text-sm font-semibold text-gray-600">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className="w-full px-4 py-3 mt-2 mb-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-400 outline-none transition"
        />

        {/* Error */}
        {error && (
          <p className="text-red-600 text-sm text-center mb-4">
            {error}
          </p>
        )}

        {/* Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:scale-[1.02] transition"
        >
          Login
        </button>

        {/* Footer text */}
        <p className="text-xs text-gray-400 text-center mt-5">
          Demo login • No real authentication required
        </p>
      </motion.div>
    </div>
  );
}
