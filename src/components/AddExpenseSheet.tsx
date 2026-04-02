import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "./MaterialIcon";
import { BottomSheet } from "./BottomSheet";
import { MerchantCombobox } from "./MerchantCombobox";
import { ReceiptCapture } from "./ReceiptCapture";
import {
  activeTrip,
  categoryProjectCodes,
  policyLimits,
} from "../data/mock-data";
import { addPendingExpense, addApprovedExpense } from "../data/expense-store";
import { clearSubmittedState } from "../data/tab-store";

const CATEGORIES = Object.keys(categoryProjectCodes);
const PROJECT_CODES = [...new Set(Object.values(categoryProjectCodes))];

interface AddExpenseSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddExpenseSheet({ isOpen, onClose }: AddExpenseSheetProps) {
  const navigate = useNavigate();
  const [merchantName, setMerchantName] = useState("");
  const [category, setCategory] = useState("");
  const [amountText, setAmountText] = useState("");
  const [hasReceipt, setHasReceipt] = useState(false);

  const amount = parseFloat(amountText) || 0;
  const projectCode = categoryProjectCodes[category] ?? "";
  const limit = policyLimits[category];
  const exceedsPolicy = limit !== undefined && amount > 0 && amount > limit;
  const withinPolicy = limit !== undefined && amount > 0 && amount <= limit;
  const canSubmit = hasReceipt && (withinPolicy || exceedsPolicy);

  // Reset form fields when sheet opens
  useEffect(() => {
    if (isOpen) {
      setMerchantName("");
      setCategory("");
      setAmountText("");
      setHasReceipt(false);
    }
  }, [isOpen]);

  const receiptUrl = hasReceipt ? "/receipts/default-receipt.png" : undefined;

  function handleSubmit() {
    // Route to the correct store based on whether the expense exceeds policy limits.
    // Over-policy expenses go to pending (require simulated manager approval),
    // while within-policy expenses are auto-approved.
    // Clear the submitted state so the new trip's My Tab page shows expenses
    clearSubmittedState();
    if (exceedsPolicy) {
      addPendingExpense(merchantName, category, amount, receiptUrl);
    } else {
      addApprovedExpense(merchantName, category, amount, receiptUrl);
    }
    onClose();
    navigate("/current");
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 pb-4 pt-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            Log It Now
          </span>
          <h2 className="text-2xl font-bold tracking-tighter">ADD EXPENSE TO TAB</h2>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors"
        >
          <MaterialIcon name="close" className="text-on-surface-variant" />
        </button>
      </div>

      <div className="px-6 pb-8 space-y-6">
        {/* Transaction form fields */}
        <div className="space-y-5">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">
              Merchant Entity
            </label>
            <MerchantCombobox
              value={merchantName}
              onChange={(value, merchant) => {
                setMerchantName(value);
                setCategory(merchant?.category ?? category);
              }}
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 font-number font-extrabold text-2xl text-on-surface-variant/60">
                $
              </span>
              <input
                className="font-number w-full bg-surface-container-high border-none focus:ring-2 focus:ring-primary rounded-lg py-5 px-12 text-4xl font-extrabold tracking-tight placeholder:text-on-surface-variant/20"
                placeholder="0.00"
                type="text"
                value={amountText}
                onChange={(event) => setAmountText(event.target.value)}
              />
            </div>
          </div>

          {/* Category and project code selectors */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className={`w-full appearance-none py-3 px-4 pr-8 rounded-lg border text-[10px] font-bold uppercase tracking-tight cursor-pointer ${
                  category
                    ? "bg-primary-container/20 border-primary/20"
                    : "bg-surface-container border-transparent"
                }`}
              >
                <option value="">Category</option>
                {CATEGORIES.map((categoryName) => (
                  <option key={categoryName} value={categoryName}>{categoryName}</option>
                ))}
              </select>
              <MaterialIcon
                name={category ? "check" : "expand_more"}
                className="text-sm absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              />
            </div>
            <div className="relative">
              <select
                value={projectCode}
                onChange={(event) => {
                  const code = event.target.value;
                  // Auto-select a matching category when a project code is chosen first
                  const matchingCategory = CATEGORIES.find(
                    (categoryName) => categoryProjectCodes[categoryName] === code
                  );
                  if (matchingCategory && !category) {
                    setCategory(matchingCategory);
                  }
                }}
                className={`w-full appearance-none py-3 px-4 pr-8 rounded-lg border text-[10px] font-bold uppercase tracking-tight cursor-pointer ${
                  projectCode
                    ? "bg-primary-container/20 border-primary/20"
                    : "bg-surface-container border-transparent"
                }`}
              >
                <option value="">Project Code</option>
                {PROJECT_CODES.map((code) => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
              <MaterialIcon
                name={projectCode ? "check" : "expand_more"}
                className="text-sm absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Approval notes — only shown when amount exceeds policy limits */}
        {exceedsPolicy && (
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">
              Notes for Approval
            </label>
            <textarea
              className="w-full bg-surface-container-high border-none focus:ring-2 focus:ring-primary rounded-lg py-3 px-4 text-sm tracking-wide placeholder:text-on-surface-variant/40 resize-none"
              placeholder="Add context for your manager, e.g. client dinner, team offsite..."
              rows={2}
            />
          </div>
        )}

        {/* Receipt capture */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">
            Receipt
          </label>
          <ReceiptCapture compact onAttach={setHasReceipt} />
        </div>

        {/* Real-time policy compliance check */}
        <div className="bg-surface-container rounded-xl overflow-hidden border border-outline-variant/20">
          <div className="h-1 w-full bg-surface-container-high">
            <div
              className={`h-full transition-all ${exceedsPolicy ? "bg-error w-full" : "bg-primary w-[65%]"}`}
            />
          </div>
          <div className="p-5">
            <div
              className={`p-3 rounded-lg ${
                exceedsPolicy
                  ? "bg-error-container/30 border border-error/20"
                  : "bg-primary-container/10 border border-primary/20"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className={`font-bold text-sm ${exceedsPolicy ? "text-error" : "text-primary"}`}>
                    {exceedsPolicy ? "Exceeds Policy" : "Within Policy"}
                  </p>
                  <p className="text-[10px] uppercase opacity-60 tracking-tight mt-0.5">
                    {exceedsPolicy
                      ? "Manager approval required"
                      : "Automatic matching enabled"}
                  </p>
                </div>
                <MaterialIcon
                  name={exceedsPolicy ? "warning" : "check_circle"}
                  filled
                  className={exceedsPolicy ? "text-error" : "text-primary"}
                />
              </div>
            </div>
            {limit !== undefined && (
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mt-3 px-1">
                <span>Policy Limit</span>
                <span className={`font-number ${exceedsPolicy ? "text-error" : "text-on-surface"}`}>
                  ${limit.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Submit button — style changes based on policy compliance */}
        {exceedsPolicy ? (
          <button
            onClick={handleSubmit}
            disabled={!hasReceipt}
            className={`w-full rounded-xl py-5 flex flex-col items-center justify-center gap-1 active:scale-[0.98] transition-all shadow-lg ${
              canSubmit
                ? "bg-secondary text-white hover:bg-secondary/80"
                : "bg-surface-container-high text-on-surface-variant/60 shadow-none cursor-not-allowed"
            }`}
          >
            <span className="text-sm font-bold tracking-[0.15em] uppercase">
              Request Approval Now
            </span>
            <span className="text-[9px] opacity-70 tracking-widest uppercase">
              {!hasReceipt
                ? "Receipt required"
                : `Exceeds ${category} limit of $${limit?.toFixed(2)}`}
            </span>
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`w-full rounded-xl py-5 flex flex-col items-center justify-center gap-1 active:scale-[0.98] transition-all shadow-lg ${
              canSubmit
                ? "bg-primary text-on-primary shadow-primary/10 hover:bg-primary/80"
                : "bg-surface-container-high text-on-surface-variant/60 shadow-none cursor-not-allowed"
            }`}
          >
            <span className="text-sm font-bold tracking-[0.15em] uppercase">
              Add to Tab
            </span>
            <span className="text-[9px] opacity-70 tracking-widest uppercase">
              {!hasReceipt && withinPolicy
                ? "Receipt required"
                : withinPolicy
                  ? `Adding to ${activeTrip.name}`
                  : "Enter merchant and amount"}
            </span>
          </button>
        )}
      </div>
    </BottomSheet>
  );
}
