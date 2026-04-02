import { MaterialIcon } from "./MaterialIcon";
import { BottomSheet } from "./BottomSheet";
import { type ClosedTab } from "../data/tab-store";

interface ClosedTabSheetProps {
  tab: ClosedTab | null;
  onClose: () => void;
}

export function ClosedTabSheet({ tab, onClose }: ClosedTabSheetProps) {
  const isReimbursed = tab?.status === "reimbursed";

  return (
    <BottomSheet isOpen={tab !== null} onClose={onClose} maxHeight="85vh">
      {tab && (
        <div className="px-6 pb-8">
          {/* Header with trip name and status icon */}
          <div className="flex items-center justify-between pt-2 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-container/20 rounded-full flex items-center justify-center">
                <MaterialIcon name="check_circle" filled className="text-primary" />
              </div>
              <div>
                <h2 className="font-bold text-xl tracking-tight">{tab.tripName}</h2>
                <span className="text-xs text-on-surface-variant">{tab.dateRange}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors"
            >
              <MaterialIcon name="close" className="text-on-surface-variant" />
            </button>
          </div>

          {/* Tab summary: total, expense count, submission date */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-surface-container rounded-xl p-4 text-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-1">
                Total
              </span>
              <span className="font-number font-extrabold text-lg">
                ${tab.total.toFixed(2)}
              </span>
            </div>
            <div className="bg-surface-container rounded-xl p-4 text-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-1">
                Expenses
              </span>
              <span className="font-number font-extrabold text-lg">
                {tab.expenseCount}
              </span>
            </div>
            <div className="bg-surface-container rounded-xl p-4 text-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-1">
                Submitted
              </span>
              <span className="font-bold text-sm">
                {tab.submittedAt}
              </span>
            </div>
          </div>

          {/* Individual expense breakdown */}
          {tab.expenses.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-3">
                Expense Breakdown
              </span>
              <div className="space-y-2">
                {tab.expenses.map((expense, index) => (
                  <div
                    key={index}
                    className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/10 flex items-center gap-3"
                  >
                    {expense.receiptUrl ? (
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-container shrink-0">
                        <img
                          src={expense.receiptUrl}
                          alt="Receipt"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
                        <MaterialIcon name={expense.icon} className="text-primary text-sm" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-sm block truncate">
                        {expense.merchant}
                      </span>
                      <span className="text-[10px] font-bold uppercase text-on-surface-variant">
                        {expense.category}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-number font-bold block">
                        {expense.amount}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-primary">
                        {expense.status === "Reimbursed" ? "Reimbursed" : expense.status === "Within Policy" ? "In Policy" : "Approved"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reimbursement status banner */}
          <div className="mt-6 bg-primary-container/10 border border-primary/20 rounded-xl p-4 flex items-center gap-3">
            <MaterialIcon name={isReimbursed ? "paid" : "verified"} filled className="text-primary" />
            <p className="text-xs text-on-surface-variant">
              {isReimbursed
                ? "This tab has been fully reimbursed via direct deposit."
                : "This tab has been submitted to Finance and is awaiting reimbursement."}
            </p>
          </div>
        </div>
      )}
    </BottomSheet>
  );
}
