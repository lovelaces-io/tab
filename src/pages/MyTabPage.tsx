import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TopAppBar } from "../components/TopAppBar";
import { MaterialIcon } from "../components/MaterialIcon";
import { type Expense } from "../data/mock-data";
import { ExpenseDetailSheet } from "../components/ExpenseDetailSheet";
import {
  getPendingExpenses,
  getApprovedExpenses,
  getTotal,
  subscribe,
} from "../data/expense-store";
import {
  getCurrentTrip,
  isTabSubmitted,
  subscribe as subscribeTabs,
} from "../data/tab-store";

function ExpenseRow({ item, onClick }: { item: Expense; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-surface-container-lowest p-5 rounded-lg transition-all hover:bg-surface-container-low border border-outline-variant/10 cursor-pointer active:scale-[0.99]">
      <div className="flex flex-wrap md:flex-nowrap items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          {item.receiptUrl ? (
            <div className="w-12 h-12 rounded overflow-hidden bg-surface-container-low shrink-0">
              <img
                src={item.receiptUrl}
                alt={`${item.merchant} receipt`}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-12 bg-surface-container-low rounded flex items-center justify-center shrink-0">
              <MaterialIcon name={item.icon} className="text-primary" />
            </div>
          )}
          <div>
            <h3 className="font-bold text-base tracking-tight">
              {item.merchant}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase text-on-surface-variant">
                {item.category}
              </span>
              <span className="w-1 h-1 bg-outline-variant rounded-full opacity-30" />
              {item.missingReceipt ? (
                <div className="flex items-center gap-1 text-[10px] font-bold text-secondary uppercase">
                  <MaterialIcon name="warning" className="text-[14px]" />
                  <span>Missing Receipt</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase">
                  <MaterialIcon name="receipt_long" className="text-[14px]" />
                  <span>Attached</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className={`px-2 py-0.5 rounded-full ${item.statusColor} text-[10px] font-black uppercase tracking-widest flex items-center gap-1`}
          >
            {item.status === "Within Policy" && (
              <MaterialIcon name="check" className="text-[12px] text-primary" />
            )}
            {item.status}
          </span>
          <p className="font-number text-xl font-bold">{item.amount}</p>
        </div>
      </div>
    </div>
  );
}

export function MyTabPage() {
  const navigate = useNavigate();
  const [, forceUpdate] = useState(0);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  useEffect(() => {
    const unsubscribeExpenses = subscribe(() => forceUpdate((count) => count + 1));
    const unsubscribeTabs = subscribeTabs(() => forceUpdate((count) => count + 1));
    return () => { unsubscribeExpenses(); unsubscribeTabs(); };
  }, []);

  const pending = getPendingExpenses();
  const approved = getApprovedExpenses();
  const total = getTotal();
  const trip = getCurrentTrip();
  const submitted = isTabSubmitted();
  const budgetCap = 1000;
  const budgetPercentage = Math.min(Math.round((total / budgetCap) * 100), 100);

  // After submission, show empty new tab state
  if (submitted) {
    return (
      <div className="page-transition pb-32">
        <TopAppBar />
        <main className="max-w-4xl mx-auto px-6 pt-8">
          <section className="mb-12">
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-primary mb-2 block">
              {trip.name}
            </span>
            <h1 className="text-6xl md:text-8xl font-extrabold font-number tracking-tighter text-on-surface">
              <span className="text-primary opacity-50">$</span>0.00
            </h1>
            <p className="text-xs text-on-surface-variant opacity-60 mt-2">
              New tab — no expenses yet
            </p>
          </section>

          <div className="flex flex-col items-center text-center py-16">
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4">
              <MaterialIcon name="receipt_long" className="text-on-surface-variant/40 text-3xl" />
            </div>
            <p className="text-on-surface-variant font-bold mb-1">Your tab is empty</p>
            <p className="text-sm text-on-surface-variant/60 max-w-xs">
              Add your first expense for {trip.name} using the + button below.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-transition pb-32">
      <TopAppBar />
      <main className="max-w-4xl mx-auto px-6 pt-8">
        {/* Tab total */}
        <section className="mb-12 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-primary mb-2 block">
                {trip.name}
              </span>
              <h1 className="text-6xl md:text-8xl font-extrabold font-number tracking-tighter text-on-surface">
                <span className="text-primary opacity-50">$</span>
                {total.toFixed(2)}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                  USD
                </span>
                <span className="text-xs text-on-surface-variant opacity-60">
                  {pending.length + approved.length} expenses this period
                </span>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-48 h-1 bg-surface-container rounded-full overflow-hidden relative">
                <div className="absolute left-0 top-0 h-full bg-primary transition-all" style={{ width: `${budgetPercentage}%` }} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mt-2 block">
                Budget Utilization: {budgetPercentage}%
              </span>
            </div>
          </div>
        </section>

        {/* Pending approval section */}
        {pending.length > 0 && (
          <section className="space-y-4 mb-10">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold uppercase tracking-tight">
                  Pending
                </h2>
                <span className="px-2 py-0.5 bg-secondary-container text-on-secondary-container text-[10px] font-bold rounded-full uppercase">
                  {pending.length} awaiting approval
                </span>
              </div>
              <MaterialIcon name="hourglass_top" className="text-secondary" />
            </div>
            {pending.map((item, index) => (
              <ExpenseRow key={`pending-${index}`} item={item} onClick={() => setSelectedExpense(item)} />
            ))}
          </section>
        )}

        {/* Approved expense list */}
        <section className="space-y-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold uppercase tracking-tight">
              Expenses
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              {approved.length} approved
            </span>
          </div>
          {approved.map((item, index) => (
            <ExpenseRow key={`expense-${index}`} item={item} onClick={() => setSelectedExpense(item)} />
          ))}
        </section>

        <div className="mt-12">
          <button
            onClick={() => navigate("/close")}
            className="w-full bg-primary text-on-primary font-bold py-5 rounded-lg shadow-2xl hover:bg-primary/80 transition-colors flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            <span className="uppercase tracking-widest text-sm">
              Close Tab & Submit
            </span>
          </button>
        </div>
      </main>
      <ExpenseDetailSheet
        expense={selectedExpense}
        onClose={() => setSelectedExpense(null)}
      />
    </div>
  );
}
