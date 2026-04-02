import { Link, useLocation } from "react-router-dom";

interface NavItem {
  path: string;
  icon: string;
  label: string;
}

const LEFT_ITEMS: NavItem[] = [
  { path: "/current", icon: "account_balance_wallet", label: "Current" },
  { path: "/trips", icon: "flight_takeoff", label: "Trips" },
];

const RIGHT_ITEMS: NavItem[] = [
  { path: "/policies", icon: "policy", label: "Policies" },
  { path: "/settings", icon: "settings", label: "Settings" },
];

function NavLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  return (
    <Link
      to={item.path}
      className={`flex flex-col items-center justify-center transition-all active:scale-95 ${
        isActive
          ? "text-primary border-t-4 border-primary pt-2"
          : "text-on-surface-variant/60 pt-3 hover:text-primary"
      }`}
    >
      <span
        className="material-symbols-outlined"
        style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
      >
        {item.icon}
      </span>
      <span className="text-[10px] font-bold uppercase tracking-widest mt-1">
        {item.label}
      </span>
    </Link>
  );
}

interface BottomNavProps {
  onAddClick: () => void;
}

export function BottomNav({ onAddClick }: BottomNavProps) {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 w-full flex items-center justify-center flex-1 justify-evenly px-2 pb-safe bg-background z-50 h-20 border-t border-outline-variant/20 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      {/* Left group */}
      <div className="flex flex-1 justify-evenly">
        {LEFT_ITEMS.map((item) => (
          <NavLink key={item.path} item={item} isActive={location.pathname === item.path} />
        ))}
      </div>

      {/* Center button — Add or Close */}
      {location.pathname === "/close" ? (
        <Link
          to="/current"
          className="flex items-center justify-center transition-all hover:scale-105 active:scale-90 -mt-4 mx-1 md:mx-3"
        >
          <div className="h-16 w-16 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center shadow-lg shadow-black/10 ring-4 ring-background">
            <span
              className="material-symbols-outlined text-3xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              close
            </span>
          </div>
        </Link>
      ) : (
        <button
          onClick={onAddClick}
          className="flex items-center justify-center transition-all hover:scale-105 active:scale-90 -mt-4 mx-1 md:mx-3"
        >
          <div className="h-16 w-16 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg shadow-primary/30 ring-4 ring-background">
            <span
              className="material-symbols-outlined text-3xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              add
            </span>
          </div>
        </button>
      )}

      {/* Right group */}
      <div className="flex flex-1 justify-evenly">
        {RIGHT_ITEMS.map((item) => (
          <NavLink key={item.path} item={item} isActive={location.pathname === item.path} />
        ))}
      </div>
    </nav>
  );
}
