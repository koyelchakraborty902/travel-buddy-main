"use client"; 
import { useState } from "react";

export default function Mood() {
  const [mood, setMood] = useState("");
  const suggestions = {
    Relaxed: ["Bali", "Maldives", "Santorini"],
    Adventure: ["Nepal", "Amazon", "New Zealand"],
    Cultural: ["Rome", "Kyoto", "Cairo"],
  };

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-4">Pick Your Mood</h1>
      <div className="flex gap-4 mb-6">
        {Object.keys(suggestions).map((m) => (
          <button
            key={m}
            onClick={() => setMood(m)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {m}
          </button>
        ))}
      </div>

      {mood && (
        <div>
          <h2 className="text-2xl font-semibold mb-2">{mood} Destinations:</h2>
          <ul className="space-y-2">
            {suggestions[mood].map((place) => (
              <li key={place} className="p-2 border rounded">{place}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
