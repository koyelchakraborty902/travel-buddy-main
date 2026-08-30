"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Planner() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  const [budget, setBudget] = useState(20000);
  const [travelStartDays, setTravelStartDays] = useState("");
  const [stayDays, setStayDays] = useState(1);

  const [mood, setMood] = useState("");
  const [travelType, setTravelType] = useState("");

  const [destinations, setDestinations] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState(null);

  const [hotels, setHotels] = useState([]);
  const [foods, setFoods] = useState([]);
  const [routes, setRoutes] = useState([]);

  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);

  const [totalCost, setTotalCost] = useState(0);
  const [error, setError] = useState("");
  const [showPlan, setShowPlan] = useState(false);

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    setShowPopup(true);
  }, []);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const user = localStorage.getItem("travelUser");
    if (!user) router.push("/login");
  }, [mounted, router]);

  // ===============================
  // FETCH DESTINATIONS
  // ===============================
  const generatePlan = async () => {
    setError("");
    setShowPlan(false);
    setTotalCost(0);
    setDestinations([]);

    if (!travelStartDays || !mood || !travelType) {
      setError("Please fill all fields.");
      return;
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/short-notice/?mood=${mood}&days=${travelStartDays}`
      );

      if (!res.ok) throw new Error();

      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        setError("No destinations found.");
        return;
      }

      setDestinations(data);
      setShowPlan(true);
    } catch {
      setError("Backend server not reachable.");
    }
  };

  // ===============================
  // LOAD DETAILS
  // ===============================
  const loadDetails = async (dest) => {
    setSelectedDestination(dest);

    setHotels([]);
    setFoods([]);
    setRoutes([]);
    setSelectedHotel(null);
    setSelectedFood(null);
    setSelectedRoute(null);
    setTotalCost(0);

    try {
      const [hotelRes, foodRes, routeRes] = await Promise.all([
        fetch(`http://127.0.0.1:8000/api/hotels/?destination=${dest.id}`),
        fetch(`http://127.0.0.1:8000/api/food/?destination=${dest.id}`),
        fetch(`http://127.0.0.1:8000/api/routes/?destination=${dest.id}`),
      ]);

      if (hotelRes.ok) setHotels(await hotelRes.json());
      if (foodRes.ok) setFoods(await foodRes.json());
      if (routeRes.ok) setRoutes(await routeRes.json());
    } catch {
      setError("Failed loading details.");
    }
  };

  // ===============================
  // TOTAL COST
  // ===============================
  useEffect(() => {
    let cost = 0;

    if (selectedHotel) cost += selectedHotel.price_per_night * stayDays;
    if (selectedFood) cost += selectedFood.avg_cost * stayDays;

    // ✅ Travel go + return
    if (selectedRoute) cost += selectedRoute.approx_cost * 2;

    setTotalCost(cost);
  }, [selectedHotel, selectedFood, selectedRoute, stayDays]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen 
      bg-gradient-to-br from-green-100 via-emerald-50 to-lime-100 
      flex items-center justify-center px-6 py-14">


         {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
            <h2 className="text-xl font-bold mb-2">Welcome to Trip Planner</h2>
            <p className="text-gray-600 mb-4">
              1. Select starting location <br/>
              2. Choose destination <br/>
              3. Pick dates <br/>
              4. Click "Plan Trip"
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Got it!
            </button>
          </div>
        </div>
         )}


      {/* MAIN FORM */}
      <div className="w-full max-w-4xl 
        bg-white rounded-3xl shadow-2xl 
        border border-emerald-200 p-10">

        <h1 className="text-4xl font-extrabold text-emerald-900 text-center mb-8">
          Short-Notice Trip Planner
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* Budget */}
          <div className="bg-emerald-50 p-4 rounded-xl shadow-inner">
            <label className="text-sm font-semibold text-emerald-900">
              Budget: ₹{budget}
            </label>
            <input
              type="range"
              min="5000"
              max="100000"
              step="1000"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full mt-2 accent-emerald-600"
            />
          </div>

          <input
            type="number"
            placeholder="Reach in days"
            className="p-4 border rounded-xl outline-none 
              focus:ring-2 focus:ring-emerald-400"
            value={travelStartDays}
            onChange={(e) => setTravelStartDays(e.target.value)}
          />

          <select
            className="p-4 border rounded-xl outline-none 
              focus:ring-2 focus:ring-emerald-400"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
          >
            <option value="">Select Mood</option>
            <option value="Relax">Relax</option>
            <option value="Adventure">Adventure</option>
            <option value="Romantic">Romantic</option>
            <option value="Cultural">Cultural</option>
          </select>

          <select
            className="p-4 border rounded-xl outline-none 
              focus:ring-2 focus:ring-emerald-400"
            value={travelType}
            onChange={(e) => setTravelType(e.target.value)}
          >
            <option value="">Travel Type</option>
            <option value="Solo">Solo</option>
            <option value="Group">Group</option>
            <option value="Stranger Group">Stranger Group</option>
          </select>
        </div>

        {/* Stay Days */}
        <div className="mt-6 bg-emerald-50 p-4 rounded-xl shadow-inner">
          <label className="text-sm font-semibold text-emerald-900">
            Stay Duration: {stayDays} day(s)
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={stayDays}
            onChange={(e) => setStayDays(Number(e.target.value))}
            className="w-full mt-2 accent-emerald-600"
          />
        </div>

        {error && (
          <p className="text-red-600 text-center mt-4">
            {error}
          </p>
        )}

        <button
          onClick={generatePlan}
          className="w-full mt-6 py-3 rounded-xl 
          bg-gradient-to-r from-emerald-600 to-green-600
          text-white font-semibold shadow-lg
          hover:scale-105 transition"
        >
          Generate Travel Plan
        </button>
      </div>

      {/* PLAN MODAL */}
      {showPlan && (
        <AnimatePresence>
          <motion.div 
            className="fixed inset-0 bg-black/60 
            flex items-center justify-center z-50 px-4">

            <motion.div 
              className="bg-white rounded-2xl shadow-2xl 
              max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">

              <button 
                onClick={() => setShowPlan(false)} 
                className="float-right text-gray-500 hover:text-black text-xl">
                ✕
              </button>

              <h2 className="text-2xl font-bold text-emerald-800 mb-4">
                Available Destinations
              </h2>

              {destinations.map((d) => (
                <div
                  key={d.id}
                  onClick={() => loadDetails(d)}
                  className="border border-emerald-200 p-4 rounded-xl mb-3 
                  cursor-pointer hover:bg-emerald-50 
                  shadow-sm transition"
                >
                  <p className="font-semibold text-emerald-900">{d.name}</p>
                  <p className="text-sm text-gray-600">{d.description}</p>
                </div>
              ))}

              {hotels.length > 0 && <Section title="🏨 Select Hotel" />}
              {hotels.map((h) => (
                <SelectableCard
                  key={h.id}
                  active={selectedHotel?.id === h.id}
                  onClick={() => setSelectedHotel(h)}
                >
                  {h.name} – ₹{h.price_per_night}/night
                </SelectableCard>
              ))}

              {foods.length > 0 && <Section title="🍽️ Select Food" />}
              {foods.map((f) => (
                <SelectableCard
                  key={f.id}
                  active={selectedFood?.id === f.id}
                  onClick={() => setSelectedFood(f)}
                >
                  {f.name} – ₹{f.avg_cost}/day
                </SelectableCard>
              ))}

              {routes.length > 0 && <Section title="🚆 Select Route" />}
              {routes.map((r) => (
                <SelectableCard
                  key={r.id}
                  active={selectedRoute?.id === r.id}
                  onClick={() => setSelectedRoute(r)}
                >
                  {r.route_type} from {r.from_city} – ₹{r.approx_cost} (one way)
                </SelectableCard>
              ))}

              {totalCost > 0 && (
                <div className="mt-6 border-t pt-4">
                  <p className="text-lg font-bold text-emerald-900">
                    Total Cost: ₹{totalCost}
                  </p>
                  <p className={totalCost <= budget ? "text-green-600" : "text-red-600"}>
                    {totalCost <= budget ? "Within Budget" : "Over Budget"}
                  </p>
                </div>
              )}

               <button
                disabled={totalCost === 0 || totalCost > budget}
                onClick={() => {
                  if (!selectedDestination || !selectedHotel || !selectedRoute) {
                    alert("Please select destination, hotel and route");
                    return;
                  }

                  localStorage.setItem(
                    "pendingBooking",
                    JSON.stringify({
                      destination_id: selectedDestination.id,
                      hotel_id: selectedHotel.id,
                      stay_days: stayDays,
                      total_cost: totalCost,

                      // ✅ REQUIRED NEW FIELDS
                      journey_date: new Date().toISOString().slice(0, 10),
                      travel_mode: selectedRoute.route_type,
                    })
                  );

                  router.push("/payment");
                }}
                className="w-full mt-6 py-3 rounded-xl 
                bg-gradient-to-r from-emerald-600 to-green-600
                text-white font-semibold shadow-lg
                disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Book Now
              </button>

            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

/* --- UI Components --- */

function Section({ title }) {
  return (
    <h3 className="mt-6 mb-2 font-semibold text-emerald-800">
      {title}
    </h3>
  );
}

function SelectableCard({ children, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`border p-3 rounded-xl cursor-pointer transition shadow-sm
        ${active 
          ? "bg-emerald-100 border-emerald-400 font-semibold" 
          : "hover:bg-emerald-50 border-emerald-200"}`}
    >
      {children}
    </div>
  );
}
