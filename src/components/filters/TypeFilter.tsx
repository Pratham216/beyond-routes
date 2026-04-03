"use client";

const TYPE_OPTIONS: Array<{ id: string; label: string }> = [
  { id: "hill", label: "Hill" },
  { id: "mountain", label: "Mountain" },
  { id: "beach", label: "Beach" },
  { id: "village", label: "Village" },
  { id: "cultural", label: "Cultural" },
  { id: "heritage", label: "Heritage" },
  { id: "forest", label: "Forest" },
  { id: "valley", label: "Valley" },
  { id: "cave", label: "Cave" },
  { id: "island", label: "Island" },
];

export default function TypeFilter({
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
      <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">Type of place</div>
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
          Any
        </button>

        {TYPE_OPTIONS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => toggleSelection(t.id)}
            className={`h-8 rounded-full px-4 text-[9px] font-bold uppercase tracking-widest transition-all duration-300 ${
              values.includes(t.id)
                ? "bg-primary text-black shadow-[0_0_20px_rgba(250,204,21,0.2)]"
                : "border border-white/5 bg-white/5 text-white/30 hover:bg-white/10 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

