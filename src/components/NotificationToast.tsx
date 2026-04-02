import { useState, useEffect, useRef } from "react";
import { MaterialIcon } from "./MaterialIcon";
import {
  getNotifications,
  subscribe,
  type Notification,
} from "../data/notification-store";

export function NotificationToast() {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<Notification | null>(null);
  const lastCountRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    return subscribe(() => {
      const all = getNotifications();

      // Reset was triggered — count went to 0
      if (all.length === 0) {
        lastCountRef.current = 0;
        setVisible(false);
        setCurrent(null);
        return;
      }

      // New notification arrived
      if (all.length > lastCountRef.current) {
        setCurrent(all[0]);
        setVisible(true);
        lastCountRef.current = all.length;

        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setVisible(false), 5000);
      } else {
        lastCountRef.current = all.length;
      }
    });
  }, []);

  if (!current) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4 transition-all duration-500 ${
        visible
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <button
        onClick={() => setVisible(false)}
        className="w-full bg-surface-container-lowest rounded-2xl p-4 shadow-2xl border border-outline-variant/20 flex items-start gap-3 text-left"
      >
        <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center shrink-0 mt-0.5">
          <MaterialIcon name={current.icon || "check_circle"} filled className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-primary uppercase tracking-wider">
            {current.icon === "send" ? "Tab Submitted" : "Expense Approved"}
          </p>
          <p className="font-bold text-sm mt-0.5 truncate">
            {current.message}
          </p>
          <p className="text-xs text-on-surface-variant mt-0.5">
            {current.amount} — {current.timestamp}
          </p>
        </div>
      </button>
    </div>
  );
}
