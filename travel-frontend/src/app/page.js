"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  const images = [
    "https://plus.unsplash.com/premium_photo-1722704536864-5e02148bec33?fm=jpg&q=60&w=3000",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    "https://i.pinimg.com/736x/e4/40/07/e440072785ce9f19ac730ae558072caa.jpg",
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">

      {/* HERO SECTION */}
      <section className="relative h-[92vh] flex items-center justify-center overflow-hidden">
        <img
          src={images[current]}
          alt="Travel"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
        />
        <div className="absolute inset-0 bg-black/50"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white px-6 max-w-4xl"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Plan smarter. <br /> Travel peacefully.
          </h1>

          <p className="text-lg md:text-2xl mb-12 opacity-90">
            Discover destinations, plan trips, and save what you love — all in one place.
          </p>

          <div className="flex justify-center gap-6 flex-wrap">
            <Link
              href="/destinations"
              className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-lg transition hover:scale-105"
            >
              Explore Destinations
            </Link>

            <Link
              href="/planner"
              className="bg-white text-green-700 px-10 py-4 rounded-full text-lg font-semibold shadow-lg transition hover:scale-105"
            >
              Plan a Trip
            </Link>
          </div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto py-24 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              title: "🌍 Explore Destinations",
              desc: "Handpicked places with useful travel details."
            },
            {
              title: "❤️ Save Favorites",
              desc: "Wishlist destinations and revisit anytime."
            },
            {
              title: "🧠 Smart Planning",
              desc: "Plan trips based on budget, time, and mood."
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -6 }}
              className="bg-white border border-green-200 p-8 rounded-2xl shadow-md text-center transition"
            >
              <h3 className="text-2xl font-semibold text-green-700 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURED DESTINATIONS */}
      <section className="py-24 bg-gradient-to-b from-white to-green-50">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-14 text-green-800">
          Featured Destinations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto px-6">
          {images.map((img, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              className="rounded-3xl overflow-hidden shadow-xl bg-white"
            >
              <img
                src={img}
                alt="Destination"
                className="h-64 w-full object-cover"
              />
              <div className="p-5">
                <h3 className="text-xl font-semibold mb-2">
                  Beautiful Destination
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Discover calm and unforgettable travel experiences.
                </p>
                <Link
                  href="/destinations"
                  className="text-green-600 font-semibold hover:underline"
                >
                  View details →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-green-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-3xl font-bold mb-4">TravelBuddy</h3>
            <p className="text-gray-300">
              A smart travel planning platform designed for calm and meaningful journeys.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-3 text-gray-300">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/destinations">Destinations</Link></li>
              <li><Link href="/planner">Trip Planner</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-lg">Contact</h4>
            <p className="text-gray-300">Email: TravelBuddy@gmail.com</p>
            <p className="text-gray-300">Phone: +91 90000 00000</p>
          </div>
        </div>

        <p className="text-center text-gray-400 mt-12 text-sm">
          © 2025 TravelBuddy. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
