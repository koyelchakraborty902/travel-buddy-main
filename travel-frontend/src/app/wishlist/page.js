"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Wishlist() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const user = JSON.parse(localStorage.getItem("travelUser"));
    if (!user) {
      router.push("/login");
      return;
    }

    const key = `wishlist_travelbuddy_${user.email}`;
    const data = JSON.parse(localStorage.getItem(key)) || [];
    setWishlist(data);
  }, [mounted, router]);

  const removeItem = (id) => {
    const user = JSON.parse(localStorage.getItem("travelUser"));
    const key = `wishlist_travelbuddy_${user.email}`;

    const updated = wishlist.filter((item) => item.id !== id);
    setWishlist(updated);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br 
      from-rose-50 via-white to-emerald-50 px-6 py-16">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-rose-600">
          Your Wishlist
        </h1>
        <p className="text-gray-500 mt-3">
          Saved destinations you love ✨
        </p>
      </div>

      {/* EMPTY STATE */}
      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center text-center mt-20">
          <div className="text-6xl mb-6">💔</div>

          <h2 className="text-xl font-semibold text-gray-700">
            Your wishlist is empty
          </h2>

          <p className="text-gray-500 mt-2 mb-6 max-w-md">
            Explore destinations and save your favorites to see them here.
          </p>

          <button
            onClick={() => router.push("/destinations")}
            className="px-8 py-3 rounded-full bg-rose-500 
            text-white font-semibold shadow-md hover:shadow-lg 
            hover:scale-105 transition"
          >
            Explore Destinations
          </button>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto 
          grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

          {wishlist.map((dest) => (
            <div
              key={dest.id}
              className="group bg-white rounded-3xl 
              shadow-lg border border-rose-100
              overflow-hidden hover:shadow-2xl 
              transition-all duration-300 hover:-translate-y-3"
            >
              {/* IMAGE */}
              <div className="relative">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="h-56 w-full object-cover"
                />

                <span className="absolute top-3 left-3 
                  bg-rose-500 text-white text-xs font-semibold 
                  px-3 py-1 rounded-full shadow">
                  ❤️ Saved
                </span>
              </div>

              {/* CONTENT */}
              <div className="p-6 text-center">
                <h2 className="text-xl font-semibold text-rose-700">
                  {dest.name}
                </h2>

                <p className="text-gray-500 text-sm mt-1 mb-6">
                  {dest.country}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => router.push("/planner")}
                    className="flex-1 py-2 rounded-lg 
                    bg-emerald-500 hover:bg-emerald-600 
                    text-white font-medium transition"
                  >
                    Plan Trip
                  </button>

                  <button
                    onClick={() => removeItem(dest.id)}
                    className="flex-1 py-2 rounded-lg 
                    border border-rose-400 text-rose-500 
                    hover:bg-rose-500 hover:text-white 
                    font-medium transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}
