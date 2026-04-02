import { useState } from "react";
import { MaterialIcon } from "./MaterialIcon";
import { BottomSheet } from "./BottomSheet";

const SESSION_KEY = "tab-demo-seen";

/**
 * Welcome overlay shown the first time a user enters the demo portion
 * of the app. Explains that the data is simulated, how manager approval
 * works, and suggests things to try. Dismissed permanently for the session
 * via sessionStorage.
 */
export function DemoOverlay() {
  const [isOpen, setIsOpen] = useState(() => {
    return !sessionStorage.getItem(SESSION_KEY);
  });

  function handleDismiss() {
    setIsOpen(false);
    sessionStorage.setItem(SESSION_KEY, "true");
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={handleDismiss}>
      <div className="px-6 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between pt-2 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              Welcome to the Demo
            </span>
            <h2 className="text-2xl font-bold tracking-tighter">
              You're exploring Tab
            </h2>
          </div>
          <button
            onClick={handleDismiss}
            className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors"
          >
            <MaterialIcon name="close" className="text-on-surface-variant" />
          </button>
        </div>

        {/* Context cards explaining the demo environment */}
        <div className="space-y-3 mb-6">
          <div className="bg-surface-container rounded-xl p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center shrink-0">
              <MaterialIcon name="science" className="text-primary text-sm" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Test Data</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Everything here uses sample expenses and a simulated company. Feel free to add, edit, or submit anything.
              </p>
            </div>
          </div>

          <div className="bg-surface-container rounded-xl p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center shrink-0">
              <MaterialIcon name="supervisor_account" className="text-primary text-sm" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Simulated Approvals</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Expenses that exceed policy limits are sent to a simulated manager who approves them automatically after a few seconds.
              </p>
            </div>
          </div>

          <div className="bg-surface-container rounded-xl p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center shrink-0">
              <MaterialIcon name="restart_alt" className="text-primary text-sm" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Fully Resettable</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                You can reset all data anytime from Settings. Nothing persists beyond your browser session.
              </p>
            </div>
          </div>
        </div>

        {/* Suggested actions to try */}
        <div className="mb-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-3">
            Things to try
          </span>
          <div className="space-y-2">
            {[
              "Add an expense with the + button",
              "Submit an over-policy expense and watch it get approved",
              "Close your tab and submit to finance",
              "Browse Trips and Policies pages",
            ].map((suggestion) => (
              <div key={suggestion} className="flex items-center gap-2">
                <MaterialIcon name="arrow_forward" className="text-primary text-sm" />
                <span className="text-sm text-on-surface-variant">{suggestion}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          className="w-full bg-primary text-on-primary font-bold py-4 rounded-lg hover:bg-primary/80 active:scale-[0.98] transition-all shadow-lg"
        >
          <span className="uppercase tracking-widest text-sm">
            Got it, let me explore
          </span>
        </button>
      </div>
    </BottomSheet>
  );
}
