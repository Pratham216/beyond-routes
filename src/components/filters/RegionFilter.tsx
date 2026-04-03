"use client";

import { useMemo } from "react";

const REGIONS: Array<{ id: string; label: string }> = [
  { id: "north", label: "North" },
  { id: "south", label: "South" },
  { id: "east", label: "East" },
  { id: "west", label: "West" },
  { id: "central", label: "Central" },
];

export default function RegionFilter({
  values,
  onChange,
}: {
  values: string[];
  onChange: (next: string[]) => void;
}) {
  const toggleSelection = (id: string) => {
    if (id === "") {
      onChange([]);
      return;
    }
    if (values.includes(id)) {
      onChange(values.filter((v) => v !== id));
    } else {
      onChange([...values, id]);
    }
  };

  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">Region</div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => toggleSelection("")}
          className={`h-8 rounded-full px-4 text-[9px] font-bold uppercase tracking-widest transition-all duration-300 ${
            values.length === 0
              ? "bg-primary text-black shadow-[0_0_20px_rgba(250,204,21,0.2)]"
              : "border border-white/5 bg-white/5 text-white/30 hover:bg-white/10 hover:text-white"
          }`}
        >
          All
        </button>

        {REGIONS.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => toggleSelection(r.id)}
            className={`h-8 rounded-full px-4 text-[9px] font-bold uppercase tracking-widest transition-all duration-300 ${
              values.includes(r.id)
                ? "bg-primary text-black shadow-[0_0_20px_rgba(250,204,21,0.2)]"
                : "border border-white/5 bg-white/5 text-white/30 hover:bg-white/10 hover:text-white"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>
    </div>
  );
}

