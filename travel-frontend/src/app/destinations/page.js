"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Destinations() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [search, setSearch] = useState("");
  const [activeDest, setActiveDest] = useState(null);
  const [wishlistIds, setWishlistIds] = useState([]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    fetch("http://127.0.0.1:8000/api/destinations/")
      .then((res) => res.json())
      .then((data) => setDestinations(data));
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const user = JSON.parse(localStorage.getItem("travelUser"));
    if (!user) return;
    const key = `wishlist_travelbuddy_${user.email}`;
    const existing = JSON.parse(localStorage.getItem(key)) || [];
    setWishlistIds(existing.map((item) => item.id));
  }, [mounted]);

  const addToWishlist = (dest) => {
    const user = JSON.parse(localStorage.getItem("travelUser"));
    if (!user) {
      router.push("/login");
      return;
    }

    const key = `wishlist_travelbuddy_${user.email}`;
    const existing = JSON.parse(localStorage.getItem(key)) || [];
    if (existing.find((item) => item.id === dest.id)) return;

    const updated = [...existing, dest];
    localStorage.setItem(key, JSON.stringify(updated));
    setWishlistIds((prev) => [...prev, dest.id]);
  };

  const filteredDestinations = destinations.filter(
    (dest) =>
      dest.name.toLowerCase().includes(search.toLowerCase()) ||
      dest.country.toLowerCase().includes(search.toLowerCase())
  );

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-100">

      {/* HEADER */}
      <header className="py-14 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-emerald-700">
          Explore Destinations
        </h1>
        <p className="text-gray-500 mt-3">
          Find your next unforgettable journey
        </p>

        <div className="max-w-xl mx-auto mt-6 px-4">
          <input
            type="text"
            placeholder="Search by city or country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-6 py-3 rounded-full border border-emerald-300
            focus:ring-2 focus:ring-emerald-400 outline-none shadow-sm"
          />
        </div>
      </header>

      {/* DESTINATION GRID */}
      <main className="max-w-6xl mx-auto px-4 pb-20 
        grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

        {filteredDestinations.map((dest) => {
          const isSaved = wishlistIds.includes(dest.id);

          return (
            <div
              key={dest.id}
              onClick={() => setActiveDest(dest)}
              className="cursor-pointer group relative"
            >
              {/* BACK LAYER 1 */}
              <div className="absolute inset-0 bg-emerald-300 rounded-2xl 
                translate-x-3 translate-y-3 opacity-30"></div>

              {/* BACK LAYER 2 */}
              <div className="absolute inset-0 bg-emerald-100 rounded-2xl 
                translate-x-1.5 translate-y-1.5"></div>

              {/* MAIN CARD */}
              <div className="relative bg-white rounded-2xl shadow-xl 
                overflow-hidden border border-emerald-100 
                transition-all duration-300 group-hover:-translate-y-3 
                group-hover:shadow-2xl">

                {/* IMAGE */}
                <div className="relative">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="h-56 w-full object-cover"
                  />

                  {/* HEART */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToWishlist(dest);
                    }}
                    className={`absolute top-4 right-4 px-3 py-2 rounded-full shadow-md
                    transition-transform hover:scale-110
                    ${isSaved ? "bg-pink-500 text-white" : "bg-white text-gray-400"}`}
                  >
                    ❤️
                  </button>
                </div>

                {/* TEXT */}
                <div className="p-6 text-center">
                  <h2 className="text-xl font-semibold text-emerald-700">
                    {dest.name}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {dest.country}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {/* MODAL */}
      {activeDest && (
        <div
          onClick={() => setActiveDest(null)}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-lg w-full shadow-xl overflow-hidden"
          >
            <img
              src={activeDest.image}
              className="h-64 w-full object-cover"
            />

            <div className="p-6">
              <h2 className="text-2xl font-bold text-emerald-700">
                {activeDest.name}
              </h2>
              <p className="text-gray-500 mb-4">{activeDest.country}</p>
              <p className="text-gray-700 text-sm mb-6">
                {activeDest.description}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => addToWishlist(activeDest)}
                  className="flex-1 bg-pink-500 text-white py-2 rounded-full font-semibold"
                >
                  ❤️ Save
                </button>

                <button
                  onClick={() => router.push("/planner")}
                  className="flex-1 bg-emerald-600 text-white py-2 rounded-full font-semibold"
                >
                  Plan Trip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-emerald-800 text-white text-sm text-center py-5">
        © 2025 TravelBuddy • Explore More, Worry Less
      </footer>
    </div>
  );
}
