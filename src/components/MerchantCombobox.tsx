import { useState, useEffect, useRef } from "react";
import { fetchMerchants, type Merchant } from "../data/merchants";

interface MerchantComboboxProps {
  value: string;
  onChange: (value: string, merchant?: Merchant) => void;
}

export function MerchantCombobox({ value, onChange }: MerchantComboboxProps) {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMerchants()
      .then(setMerchants)
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = value.trim()
    ? merchants.filter(
        (m) =>
          m.name.toLowerCase().includes(value.toLowerCase()) ||
          m.category.toLowerCase().includes(value.toLowerCase())
      )
    : merchants;

  const grouped = filtered.reduce<Record<string, Merchant[]>>((acc, m) => {
    if (!acc[m.category]) acc[m.category] = [];
    acc[m.category].push(m);
    return acc;
  }, {});

  const categoryOrder = [
    "Airline",
    "Hotel",
    "Restaurant",
    "Coffee",
    "Rideshare",
    "Car Rental",
    "Gas Station",
    "Retail/Supplies",
  ];
  const sortedCategories = Object.keys(grouped).sort(
    (a, b) => (categoryOrder.indexOf(a) ?? 99) - (categoryOrder.indexOf(b) ?? 99)
  );

  return (
    <div ref={containerRef} className="relative">
      <input
        className="w-full bg-surface-container-high border-none focus:ring-2 focus:ring-primary rounded-lg py-4 px-5 pr-10 text-sm font-bold tracking-wide placeholder:text-on-surface-variant/40"
        placeholder={isLoading ? "LOADING MERCHANTS..." : "SEARCH MERCHANTS"}
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
      />
      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 text-xl pointer-events-none">
        {isOpen ? "expand_less" : "expand_more"}
      </span>

      {isOpen && filtered.length > 0 && (
        <div className="absolute z-50 mt-2 w-full max-h-72 overflow-y-auto bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-xl no-scrollbar">
          {sortedCategories.map((category) => (
            <div key={category}>
              <div className="sticky top-0 bg-surface-container-high px-4 py-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  {category}
                </span>
              </div>
              {grouped[category].map((merchant) => (
                <button
                  key={`${merchant.category}-${merchant.name}`}
                  className="w-full text-left px-4 py-3 hover:bg-primary-container/10 transition-colors flex items-center gap-3"
                  onClick={() => {
                    onChange(merchant.name, merchant);
                    setIsOpen(false);
                  }}
                >
                  <span className="text-sm font-medium">{merchant.name}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      {isOpen && value.trim() && filtered.length === 0 && (
        <div className="absolute z-50 mt-2 w-full bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-xl p-4">
          <p className="text-sm text-on-surface-variant/60 text-center">
            No merchants found — you can type a custom name
          </p>
        </div>
      )}
    </div>
  );
}
