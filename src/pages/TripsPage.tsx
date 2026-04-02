import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "../components/MaterialIcon";
import { TopAppBar } from "../components/TopAppBar";
import { TripPreviewSheet } from "../components/TripPreviewSheet";
import { ClosedTabSheet } from "../components/ClosedTabSheet";
import { type UpcomingTrip } from "../data/mock-data";
import { type ClosedTab } from "../data/tab-store";
import { getTotal, getAllExpenses, subscribe } from "../data/expense-store";
import {
  getCurrentTrip,
  getUpcomingTrips,
  getClosedTabs,
  isTabSubmitted,
  subscribe as subscribeTabs,
} from "../data/tab-store";

export function TripsPage() {
  const navigate = useNavigate();
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const unsubscribeExpenses = subscribe(() => forceUpdate((count) => count + 1));
    const unsubscribeTabs = subscribeTabs(() => forceUpdate((count) => count + 1));
    return () => { unsubscribeExpenses(); unsubscribeTabs(); };
  }, []);

  const trip = getCurrentTrip();
  const [selectedTrip, setSelectedTrip] = useState<UpcomingTrip | null>(null);
  const [selectedTab, setSelectedTab] = useState<ClosedTab | null>(null);
  const upcoming = getUpcomingTrips();
  const closedTabs = getClosedTabs();
  const submitted = isTabSubmitted();
  const total = getTotal();
  const expenseCount = getAllExpenses().length;

  return (
    <div className="page-transition pb-32">
      <TopAppBar />

      <main className="max-w-2xl mx-auto px-6 pt-8 space-y-10">
        <section className="space-y-1">
          <div className="flex items-center gap-2">
            <MaterialIcon
              name="verified_user"
              filled
              className="text-primary text-sm"
            />
            <span className="text-[0.6875rem] uppercase font-bold tracking-widest text-primary">
              Manager Assigned
            </span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter">Your Trips</h2>
        </section>

        {/* Active trip */}
        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-[0.6875rem] uppercase font-bold tracking-widest text-on-surface-variant">
              {submitted ? "Next Trip" : "Active Trip"}
            </span>
            {!submitted && (
              <span className="text-xs font-medium text-primary">Live Now</span>
            )}
          </div>
          <div
            onClick={() => !submitted && navigate("/current")}
            className={`bg-primary text-on-primary rounded-xl p-6 relative overflow-hidden shadow-lg transition-all ${
              submitted ? "opacity-80" : "cursor-pointer hover:brightness-110 active:scale-[0.98]"
            }`}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-primary-container/30">
              <div className={`h-full bg-primary-container ${submitted ? "w-0" : "w-[70%]"}`} />
            </div>
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="text-2xl font-bold tracking-tight">
                  {trip.name}
                </h3>
                <p className="text-on-primary/70 text-sm mt-1 uppercase tracking-wider">
                  {trip.dateRange}
                </p>
              </div>
              <div className="text-right">
                <span className="block text-[0.6875rem] uppercase font-bold tracking-widest opacity-80">
                  Tab Total
                </span>
                <div className="text-3xl font-black tracking-tighter">
                  {submitted ? "$0.00" : `$${total.toFixed(2)}`}
                </div>
                {!submitted && (
                  <p className="text-on-primary/50 text-[10px] uppercase tracking-wider">
                    {expenseCount} expenses
                  </p>
                )}
                {submitted && (
                  <p className="text-on-primary/50 text-[10px] uppercase tracking-wider">
                    No expenses yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Closed tabs */}
        {closedTabs.length > 0 && (
          <section className="space-y-4">
            <span className="text-[0.6875rem] uppercase font-bold tracking-widest text-on-surface-variant">
              Closed Tabs
            </span>
            {closedTabs.map((tab, index) => (
              <div
                key={index}
                onClick={() => setSelectedTab(tab)}
                className={`p-5 rounded-xl border cursor-pointer hover:bg-surface-container-low active:scale-[0.99] transition-all ${
                  tab.status === "reimbursed"
                    ? "bg-primary-container/10 border-primary/15"
                    : "bg-surface-container-lowest border-outline-variant/20"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold tracking-tight">{tab.tripName}</h4>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {tab.dateRange}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-number font-extrabold text-lg block">
                      ${tab.total.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-on-surface-variant">
                      {tab.expenseCount} expenses
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-outline-variant/10">
                  <div className="flex items-center gap-1.5">
                    <MaterialIcon name={tab.status === "reimbursed" ? "paid" : "check_circle"} filled className="text-primary text-sm" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      {tab.status === "reimbursed" ? "Fully Reimbursed" : "Submitted to Finance"}
                    </span>
                  </div>
                  <span className="text-[10px] text-on-surface-variant">
                    {tab.submittedAt}
                  </span>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Upcoming trips */}
        {upcoming.length > 0 && (
          <section className="space-y-4">
            <span className="text-[0.6875rem] uppercase font-bold tracking-widest text-on-surface-variant">
              Upcoming
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcoming.map((trip) => (
                <div
                  key={trip.name}
                  onClick={() => setSelectedTrip(trip)}
                  className={`bg-surface-container-low p-5 rounded-xl border border-outline-variant/20 hover:bg-surface-container transition-colors cursor-pointer active:scale-[0.98] ${
                    trip.dimmed ? "opacity-70" : ""
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg w-fit mb-4 ${
                      trip.dimmed
                        ? "bg-surface-container-highest"
                        : "bg-secondary-container/20"
                    }`}
                  >
                    <MaterialIcon
                      name={trip.icon}
                      className={trip.dimmed ? "" : "text-secondary"}
                    />
                  </div>
                  <h4 className="font-bold text-lg tracking-tight">
                    {trip.name}
                  </h4>
                  <p className="text-sm text-on-surface-variant mt-1">
                    {trip.startDate}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      <TripPreviewSheet
        trip={selectedTrip}
        onClose={() => setSelectedTrip(null)}
      />
      <ClosedTabSheet
        tab={selectedTab}
        onClose={() => setSelectedTab(null)}
      />
    </div>
  );
}
