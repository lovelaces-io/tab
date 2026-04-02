import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TopAppBar } from "../components/TopAppBar";
import { MaterialIcon } from "../components/MaterialIcon";
import {
  getPendingExpenses,
  getApprovedExpenses,
  getTotal,
  getAllExpenses,
  approveFirstPending,
  clearExpenses,
  subscribe,
} from "../data/expense-store";
import { addNotification, addTabSubmittedNotification } from "../data/notification-store";
import {
  getCurrentTrip,
  submitTab,
  isTabSubmitted,
  getClosedTabs,
  subscribe as subscribeTabs,
} from "../data/tab-store";

function LoadingStep({ label, delay }: { label: string; delay: number }) {
  const [visible, setVisible] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), delay);
    const doneTimer = setTimeout(() => setDone(true), delay + 900);
    return () => { clearTimeout(showTimer); clearTimeout(doneTimer); };
  }, [delay]);

  if (!visible) return null;

  return (
    <div className="flex items-center gap-3 page-transition">
      {done ? (
        <MaterialIcon name="check_circle" filled className="text-primary text-lg" />
      ) : (
        <div className="w-[18px] h-[18px] border-2 border-primary border-t-transparent rounded-full animate-spin" />
      )}
      <span className={`text-sm font-medium ${done ? "text-on-surface" : "text-on-surface-variant"}`}>
        {label}
      </span>
    </div>
  );
}

export function CloseTabPage() {
  const navigate = useNavigate();
  const [, forceUpdate] = useState(0);
  const [hadPendingOnLoad] = useState(() => getPendingExpenses().length > 0);

  useEffect(() => {
    const unsubscribeExpenses = subscribe(() => forceUpdate((count) => count + 1));
    const unsubscribeTabs = subscribeTabs(() => forceUpdate((count) => count + 1));
    return () => { unsubscribeExpenses(); unsubscribeTabs(); };
  }, []);

  const [showSubmitButton, setShowSubmitButton] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShowSubmitButton(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Auto-approve all pending expenses one by one with staggered timing
  useEffect(() => {
    const pending = getPendingExpenses();
    if (pending.length === 0) return;

    const timers = pending.map((_, i) =>
      setTimeout(() => {
        const approved = approveFirstPending();
        if (approved) {
          addNotification(approved.merchant, approved.amount);
        }
      }, 3000 + i * 2000)
    );

    return () => timers.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const submitted = isTabSubmitted();
  const pending = getPendingExpenses();
  const approved = getApprovedExpenses();
  const total = getTotal();
  const hasPending = pending.length > 0;
  const trip = getCurrentTrip();
  const closedTabs = getClosedTabs();
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit() {
    setSubmitting(true);
  }

  // Submitting loading state
  useEffect(() => {
    if (!submitting) return;

    const timer = setTimeout(() => {
      const allExpenses = getAllExpenses();
      const tripName = trip.name;
      submitTab(total, allExpenses.length, allExpenses);
      clearExpenses();
      addTabSubmittedNotification(tripName, `$${total.toFixed(2)}`);
      setSubmitting(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [submitting, total]);

  if (submitting) {
    return (
      <div className="page-transition pb-32">
        <TopAppBar />
        <main className="max-w-2xl mx-auto px-6 pt-8">
          <div className="flex flex-col items-center justify-center text-center pt-24 gap-6">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 w-20 h-20 border-4 border-surface-container-high rounded-full" />
              <div className="absolute inset-0 w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tighter mb-2">
                Submitting to Finance
              </h2>
              <p className="text-sm text-on-surface-variant">
                Packaging {approved.length} expenses for review...
              </p>
            </div>
            <div className="w-full max-w-xs space-y-3 mt-4">
              <LoadingStep label="Validating receipts" delay={0} />
              <LoadingStep label="Compiling expense report" delay={800} />
              <LoadingStep label="Sending to Finance" delay={1800} />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Submitted success state
  if (submitted && closedTabs.length > 0) {
    const lastClosed = closedTabs[0];
    return (
      <div className="page-transition pb-32">
        <TopAppBar />
        <main className="max-w-2xl mx-auto px-6 pt-8">
          <div className="flex flex-col items-center text-center pt-8 pb-12">
            <div className="w-28 h-28 rounded-full bg-primary-container/20 flex items-center justify-center mb-6">
              <MaterialIcon name="check_circle" filled className="text-primary text-7xl" />
            </div>
            <h1 className="text-4xl font-bold tracking-tighter mb-2">
              Tab Submitted
            </h1>
            <p className="text-on-surface-variant max-w-sm">
              Your tab for <span className="font-bold">{lastClosed.tripName}</span> has been submitted to Finance for reimbursement.
            </p>
          </div>

          {/* Closed tab summary */}
          <section className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/20 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <MaterialIcon name="receipt_long" className="text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                Closed Tab Summary
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-on-surface-variant">Trip</span>
                <span className="font-bold">{lastClosed.tripName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-on-surface-variant">Dates</span>
                <span className="font-bold">{lastClosed.dateRange}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-on-surface-variant">Expenses</span>
                <span className="font-bold">{lastClosed.expenseCount} items</span>
              </div>
              <div className="h-px bg-outline-variant/10 my-1" />
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold">Total Reimbursement</span>
                <span className="font-number font-extrabold text-xl text-primary">
                  ${lastClosed.total.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-on-surface-variant">Submitted</span>
                <span className="text-sm font-bold">{lastClosed.submittedAt}</span>
              </div>
            </div>
          </section>

          {/* Next trip */}
          <section className="bg-surface-container rounded-xl p-6 border border-outline-variant/20 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <MaterialIcon name="flight_takeoff" className="text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                Next Trip
              </span>
            </div>
            <h3 className="font-bold text-lg tracking-tight">{trip.name}</h3>
            <p className="text-sm text-on-surface-variant mt-1">{trip.dateRange}</p>
            <p className="text-xs text-on-surface-variant/60 mt-2">
              A new empty tab has been opened for this trip.
            </p>
          </section>

          <button
            onClick={() => navigate("/current")}
            className="w-full bg-primary text-on-primary font-bold py-4 rounded-xl hover:bg-primary/80 active:scale-[0.98] transition-all shadow-lg"
          >
            <span className="uppercase tracking-widest text-sm">
              Go to New Tab
            </span>
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="page-transition pb-32">
      <TopAppBar />
      <main className="max-w-5xl mx-auto px-6 pt-8">
        {/* Header */}
        <section className="mb-12">
          <div className="bg-surface-container-lowest p-8 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-surface-container">
              <div className="h-full bg-primary w-2/3 shadow-[0_0_10px_rgba(46,125,71,0.4)]" />
            </div>
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
              <div>
                <span className="text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">
                  {trip.name} — {trip.dateRange}
                </span>
                <h1 className="text-5xl font-bold tracking-tighter">
                  Closing your tab...
                </h1>
              </div>
              <div className="md:text-right">
                <span className="text-[0.75rem] font-bold uppercase tracking-widest text-primary mb-1 block">
                  Total Tab
                </span>
                <div className="text-7xl md:text-6xl font-number font-extrabold tracking-tight">
                  ${total.toFixed(2)}{" "}
                  <span className="text-xl font-bold text-on-surface-variant/60">USD</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className={`grid grid-cols-1 ${hadPendingOnLoad ? "md:grid-cols-12" : ""} gap-8`}>
          {/* Pending expenses — only shown if there were pending on load */}
          {hadPendingOnLoad && (
            <section className="md:col-span-5 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold uppercase tracking-tight">
                  Pending
                </h2>
                {hasPending && (
                  <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold rounded-full uppercase">
                    {pending.length} awaiting approval
                  </span>
                )}
              </div>
              {hasPending ? (
                <>
                  {pending.map((item, index) => (
                    <div
                      key={`pending-${index}`}
                      className="bg-surface-container p-5 rounded-lg border-l-4 border-secondary"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center">
                            <MaterialIcon name={item.icon} className="text-secondary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-sm">{item.merchant}</h3>
                            <span className="text-[10px] font-bold uppercase text-on-surface-variant">
                              {item.category}
                            </span>
                          </div>
                        </div>
                        <span className="font-number font-bold text-lg">{item.amount}</span>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-outline-variant/10">
                        <div className="flex items-center gap-1.5">
                          <MaterialIcon name="hourglass_top" className="text-secondary text-sm" />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                            Awaiting Manager
                          </span>
                        </div>
                        {item.submittedAt && (
                          <span className="text-[10px] text-on-surface-variant">
                            Submitted {item.submittedAt}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="bg-secondary-container/10 border border-secondary/20 rounded-xl p-4 flex items-start gap-3">
                    <MaterialIcon name="info" className="text-secondary mt-0.5" />
                    <p className="text-xs text-on-surface-variant">
                      This tab cannot be submitted to Finance until all pending expenses are approved by your manager.
                    </p>
                  </div>
                </>
              ) : (
                <div className="bg-primary-container/10 border border-primary/20 rounded-xl p-5 flex items-center gap-3">
                  <MaterialIcon name="check_circle" filled className="text-primary" />
                  <div>
                    <p className="font-bold text-sm text-primary">All Clear</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      No pending approvals. Ready to submit.
                    </p>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Approved items */}
          <section className={`${hadPendingOnLoad ? "md:col-span-7" : ""} space-y-4`}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold uppercase tracking-tight">
                Approved
              </h2>
              <span className="text-[10px] font-bold uppercase text-on-surface-variant">
                {approved.length} expenses
              </span>
            </div>
            {approved.map((item, index) => (
              <div
                key={`approved-${index}`}
                className="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/10 flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center">
                    <MaterialIcon name={item.icon} className="text-primary text-sm" />
                  </div>
                  <div>
                    <span className="font-bold block">{item.merchant}</span>
                    <p className="text-[0.6875rem] font-bold uppercase text-on-surface-variant/60">
                      {item.category}
                    </p>
                  </div>
                </div>
                <span className="font-number font-extrabold text-lg">{item.amount}</span>
              </div>
            ))}
          </section>
        </div>

        {/* What happens next */}
        <section className="mt-10 mb-32 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">
            What happens next
          </h3>
          <div className="space-y-2 text-sm text-on-surface-variant">
            <p>Once submitted, your tab goes to the Finance team for review. Approved expenses are typically reimbursed within 5–7 business days via direct deposit. You'll receive a notification when your reimbursement is processed.</p>
          </div>
        </section>

        {/* Submit button */}
        <div className={`fixed left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-40 transition-all duration-500 ease-out ${showSubmitButton ? "bottom-24 opacity-100" : "-bottom-16 opacity-0"}`}>
          <button
            onClick={handleSubmit}
            disabled={hasPending}
            className={`w-full py-4 rounded-full font-bold uppercase tracking-widest text-sm shadow-xl active:scale-95 transition-all ${
              hasPending
                ? "bg-surface-container-high text-on-surface-variant/60 shadow-none cursor-not-allowed"
                : "bg-primary text-on-primary hover:bg-primary/80"
            }`}
          >
            {hasPending ? "Pending Approvals Required" : "Submit to Finance"}
          </button>
        </div>
      </main>
    </div>
  );
}
