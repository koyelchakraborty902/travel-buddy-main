"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("travelUser"));
    setUser(storedUser);

    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    const closeAll = () => {
      setNotifyOpen(false);
      setProfileOpen(false);
    };
    window.addEventListener("click", closeAll);

    fetch("http://127.0.0.1:8000/api/notifications/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setNotifications(Array.isArray(data) ? data : []))
      .catch(() => setNotifications([]));

    setMounted(true);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", closeAll);
    };
  }, []);

  if (!mounted) return null;

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", darkMode ? "light" : "dark");
    setDarkMode(!darkMode);
  };

  const logout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const linkClass = (path) =>
    `px-3 py-2 rounded-md font-medium transition ${
      pathname === path
        ? "bg-emerald-700/30 text-white"
        : "text-emerald-100 hover:bg-emerald-700/30 hover:text-white"
    }`;

  const avatarSrc = user?.avatar
    ? user.avatar
    : `https://ui-avatars.com/api/?name=${
        user?.name || user?.email || "User"
      }&background=065f46&color=fff`;
  
      

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300
      ${scrolled ? "py-2 shadow-xl" : "py-4"}
      bg-gradient-to-r from-green-900 via-emerald-900 to-green-800`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

        {/* LOGO */}
        <a
          href="/"
          className="text-2xl font-extrabold tracking-wide
          bg-gradient-to-r from-green-300 to-emerald-400
          text-transparent bg-clip-text"
        >
          TravelBuddy
        </a>

        {/* DESKTOP */}
        <div className="hidden md:flex items-center gap-6">

          <a href="/" className={linkClass("/")}>Home</a>
          <a href="/destinations" className={linkClass("/destinations")}>Destinations</a>
          <a href="/planner" className={linkClass("/planner")}>Trip Planner</a>

          {/* ✅ WISHLIST LINK */}
          <button
            onClick={() => router.push("/wishlist")}
            className={linkClass("/wishlist")}
          >
            ❤️ Wishlist
          </button>

          {/* 🔔 NOTIFICATIONS WITH RED DOT */}
       <div className="relative z-50">
          <button 
          onClick={() => router.push("/notifications")}
          className="relative text-2xl"
          >
         🔔

        {/* 🔴 Red Dot */}
        {notifications.some(n => !n.is_read) && (
        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
        )}
        </button>
       </div>


          {/* DARK MODE */}
          <button
            onClick={toggleDarkMode}
            className="w-10 h-10 rounded-full border border-emerald-700
            flex items-center justify-center text-emerald-200
            hover:bg-emerald-800 transition"
          >
            {darkMode ? "🌙" : "☀️"}
          </button>

          {/* PROFILE */}
          {user ? (
            <div className="relative z-50">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileOpen(!profileOpen);
                  setNotifyOpen(false);
                }}
              >
                <img
                  src={avatarSrc}
                  alt="User"
                  className="w-9 h-9 rounded-full object-cover
                  border border-emerald-700"
                />
              </button>

              {profileOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 mt-3 w-44
                  bg-emerald-950 text-emerald-100
                  rounded-xl shadow-xl border border-emerald-700 overflow-hidden"
                >
                  <p className="px-4 py-2 text-sm font-semibold text-emerald-300">
                    {user.name || user.email}
                  </p>

                  {/* ✅ WISHLIST IN PROFILE */}
                  <button
                    onClick={() => router.push("/wishlist")}
                    className="w-full text-left px-4 py-2 hover:bg-emerald-800"
                  >
                    ❤️ Wishlist
                  </button>

                  <button
                    onClick={() => router.push("/profile")}
                    className="w-full text-left px-4 py-2 hover:bg-emerald-800"
                  >
                    Profile
                  </button>

                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-red-400 hover:bg-emerald-800"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="w-9 h-9 rounded-full border border-emerald-700
              flex items-center justify-center text-emerald-200 hover:bg-emerald-800"
            >
              👤
            </button>
          )}
        </div>

        {/* MOBILE */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
          className="md:hidden text-2xl text-emerald-200"
        >
          ☰
        </button>
      </div>
    </nav>
  );
}
