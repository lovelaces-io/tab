import { type ReactNode } from "react";

interface BottomSheetProps {
  /** Controls whether the sheet is visible and animated in */
  isOpen: boolean;
  /** Called when the user taps the backdrop to dismiss */
  onClose: () => void;
  /** Content rendered inside the sheet panel */
  children: ReactNode;
  /** Maximum height constraint for the sheet — defaults to 90vh */
  maxHeight?: string;
}

/**
 * Shared bottom sheet component used across the app for detail views,
 * forms, and overlays. Renders a backdrop overlay and a slide-up panel
 * with a drag handle indicator.
 */
export function BottomSheet({ isOpen, onClose, children, maxHeight = "90vh" }: BottomSheetProps) {
  return (
    <>
      {/* Backdrop overlay — dims the background and dismisses on tap */}
      <div
        className={`fixed inset-0 bg-black/40 z-[60] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Slide-up sheet panel */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[60] transition-transform duration-300 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div
          className="bg-background rounded-t-3xl overflow-y-auto no-scrollbar shadow-2xl"
          style={{ maxHeight }}
        >
          {/* Drag handle indicator */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-outline-variant/40" />
          </div>

          {children}
        </div>
      </div>
    </>
  );
}
