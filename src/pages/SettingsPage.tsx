import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { TopAppBar } from "../components/TopAppBar";
import { MaterialIcon } from "../components/MaterialIcon";
import { resetData } from "../data/expense-store";
import { clearNotifications } from "../data/notification-store";
import { resetTabStore } from "../data/tab-store";

export function SettingsPage() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );
  const [resetConfirm, setResetConfirm] = useState(false);
  const [resetTimer, setResetTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <div className="page-transition pb-32">
      <TopAppBar />
      <main className="max-w-2xl mx-auto px-6 pt-8">
        <h2 className="text-4xl font-bold tracking-tighter mb-10">Settings</h2>

        {/* System / Company */}
        <section className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 shadow-sm mb-4 opacity-70">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center shrink-0">
              <MaterialIcon name="domain" className="text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm uppercase tracking-tight">
                System
              </h3>
              <p className="font-number font-bold text-primary mt-0.5 tracking-wide">
                LOVELACES_DEMO
              </p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-wide">
                Lovelaces.io — Demo Environment
              </p>
            </div>
            <MaterialIcon name="lock" className="text-on-surface-variant/30 text-sm" />
          </div>
        </section>

        {/* Approving manager — read-only */}
        <section className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 shadow-sm mb-4 opacity-70">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center shrink-0">
              <MaterialIcon name="person" className="text-on-surface-variant" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm uppercase tracking-tight">
                Approving Manager
              </h3>
              <p className="font-bold mt-0.5">Tom Wambsgans</p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-wide">
                Finance — approves all expense requests
              </p>
            </div>
            <MaterialIcon name="lock" className="text-on-surface-variant/30 text-sm" />
          </div>
        </section>

        <section className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm uppercase tracking-tight">
                Theme
              </h3>
              <p className="text-[10px] text-on-surface-variant mt-1 uppercase tracking-wide">
                {dark ? "Dark mode" : "Light mode"}
              </p>
            </div>
            <button
              role="switch"
              aria-checked={dark}
              aria-label="Toggle dark mode"
              onClick={() => setDark(!dark)}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                dark ? "bg-primary hover:bg-primary/80" : "bg-surface-container-high hover:bg-surface-container-highest"
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-transform ${
                  dark ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </section>

        {/* Reset test data */}
        <section className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 shadow-sm mt-4">
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="font-bold text-sm uppercase tracking-tight">
                Reset Test Data
              </h3>
              <p className="text-[10px] text-on-surface-variant mt-1 uppercase tracking-wide leading-relaxed">
                Restore all expenses, trips, and notifications to their initial demo state
              </p>
            </div>
            <button
              onClick={() => {
                if (resetConfirm) {
                  if (resetTimer) clearTimeout(resetTimer);
                  resetData();
                  clearNotifications();
                  resetTabStore();
                  setResetConfirm(false);
                  setResetTimer(null);
                  navigate("/current");
                } else {
                  setResetConfirm(true);
                  const timer = setTimeout(() => {
                    setResetConfirm(false);
                    setResetTimer(null);
                  }, 3000);
                  setResetTimer(timer);
                }
              }}
              className={`w-full flex items-center justify-center gap-2 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:opacity-80 active:scale-95 transition-all duration-200 ${
                resetConfirm
                  ? "bg-error text-white"
                  : "bg-error-container text-on-error-container"
              }`}
            >
              <MaterialIcon name="restart_alt" className="text-sm" />
              {resetConfirm ? "Reset Data?" : "Reset"}
            </button>
          </div>
        </section>
        {/* Links */}
        <section className="mt-4 space-y-3">
          <Link
            to="/"
            className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/20 shadow-sm flex items-center gap-4 hover:bg-surface-container-low active:scale-[0.99] transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center shrink-0">
              <MaterialIcon name="info" className="text-primary text-sm" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm">About Tab</h3>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-wide">
                Learn more about this project
              </p>
            </div>
            <MaterialIcon name="arrow_forward" className="text-on-surface-variant/40 text-sm" />
          </Link>

          <a
            href="https://github.com/lovelaces-io/tab"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/20 shadow-sm flex items-center gap-4 hover:bg-surface-container-low active:scale-[0.99] transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center shrink-0">
              <MaterialIcon name="code" className="text-primary text-sm" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm">Source Code</h3>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-wide">
                View on GitHub
              </p>
            </div>
            <MaterialIcon name="arrow_forward" className="text-on-surface-variant/40 text-sm" />
          </a>
        </section>
      </main>
    </div>
  );
}
