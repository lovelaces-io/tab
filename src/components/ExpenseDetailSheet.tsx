import { MaterialIcon } from "./MaterialIcon";
import { BottomSheet } from "./BottomSheet";
import { type Expense } from "../data/mock-data";

interface ExpenseDetailSheetProps {
  expense: Expense | null;
  onClose: () => void;
}

export function ExpenseDetailSheet({ expense, onClose }: ExpenseDetailSheetProps) {
  return (
    <BottomSheet isOpen={expense !== null} onClose={onClose}>
      {expense && (
        <div className="px-6 pb-8">
          {/* Header with merchant info and close button */}
          <div className="flex items-center justify-between pt-2 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-surface-container rounded-full flex items-center justify-center">
                <MaterialIcon name={expense.icon} className="text-primary" />
              </div>
              <div>
                <h2 className="font-bold text-lg tracking-tight">
                  {expense.merchant}
                </h2>
                <span className="text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">
                  {expense.category}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors"
            >
              <MaterialIcon name="close" className="text-on-surface-variant" />
            </button>
          </div>

          {/* Amount and policy status */}
          <div className="flex items-center justify-between py-4 border-y border-outline-variant/10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block">
                Amount
              </span>
              <span className="font-number text-3xl font-extrabold">
                {expense.amount}
              </span>
            </div>
            <span
              className={`px-3 py-1 rounded-full ${expense.statusColor} text-xs font-black uppercase tracking-widest`}
            >
              {expense.status}
            </span>
          </div>

          {/* Submission and receipt details */}
          <div className="py-4 space-y-3">
            {expense.submittedAt && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-on-surface-variant">Submitted</span>
                <span className="text-sm font-bold">{expense.submittedAt}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-sm text-on-surface-variant">Receipt</span>
              <span className={`text-sm font-bold ${expense.receiptUrl ? "text-primary" : "text-secondary"}`}>
                {expense.receiptUrl ? "Attached" : "Missing"}
              </span>
            </div>
          </div>

          {/* Optional notes from the submitter */}
          {expense.notes && (
            <div className="mt-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">
                Notes
              </span>
              <p className="text-sm text-on-surface leading-relaxed">
                {expense.notes}
              </p>
            </div>
          )}

          {/* Receipt image preview */}
          {expense.receiptUrl && (
            <div className="mt-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-3">
                Receipt
              </span>
              <div className="rounded-xl overflow-hidden border border-outline-variant/20 bg-surface-container">
                <img
                  src={expense.receiptUrl}
                  alt={`${expense.merchant} receipt`}
                  className="w-full object-contain max-h-96"
                />
              </div>
            </div>
          )}

          {/* Missing receipt warning */}
          {!expense.receiptUrl && (
            <div className="mt-4 bg-secondary-container/10 border border-secondary/20 rounded-xl p-4 flex items-center gap-3">
              <MaterialIcon name="warning" className="text-secondary" />
              <p className="text-xs text-on-surface-variant">
                No receipt attached to this expense.
              </p>
            </div>
          )}
        </div>
      )}
    </BottomSheet>
  );
}
