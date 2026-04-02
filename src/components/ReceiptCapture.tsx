import { useState } from "react";
import { MaterialIcon } from "./MaterialIcon";

const DEFAULT_RECEIPT_URL = "/receipts/default-receipt.png";
const DEFAULT_RECEIPT_NAME = "receipt_04252024_1545.png";

interface ReceiptCaptureProps {
  onAttach?: (attached: boolean) => void;
  compact?: boolean;
}

export function ReceiptCapture({ onAttach, compact }: ReceiptCaptureProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  function simulateCapture() {
    setLoading(true);
    setTimeout(() => {
      setPreview(DEFAULT_RECEIPT_URL);
      setFileName(DEFAULT_RECEIPT_NAME);
      setLoading(false);
      onAttach?.(true);
    }, 1500);
  }

  function removeReceipt() {
    setPreview(null);
    setFileName("");
    onAttach?.(false);
  }

  if (loading) {
    return (
      <div className={compact ? "" : "mt-1"}>
        <div className="bg-surface-container border border-outline-variant/20 rounded-xl py-5 flex flex-col items-center justify-center gap-2">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            Processing receipt...
          </span>
        </div>
      </div>
    );
  }

  if (preview) {
    return (
      <div className={`relative ${compact ? "" : "mt-1"}`}>
        <div className="bg-primary-container/10 border border-primary/20 rounded-xl p-3 flex items-center gap-3">
          <div className="w-14 h-14 rounded-lg overflow-hidden bg-surface-container shrink-0">
            <img
              src={preview}
              alt="Receipt preview"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <MaterialIcon name="check_circle" filled className="text-primary text-sm" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                Receipt Attached
              </span>
            </div>
            <p className="text-xs text-on-surface-variant truncate mt-0.5">
              {fileName}
            </p>
          </div>
          <div className="flex gap-1 shrink-0">
            <button
              onClick={simulateCapture}
              className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors"
              title="Replace"
            >
              <MaterialIcon name="swap_horiz" className="text-on-surface-variant text-sm" />
            </button>
            <button
              onClick={removeReceipt}
              className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center hover:bg-error-container transition-colors"
              title="Remove"
            >
              <MaterialIcon name="close" className="text-on-surface-variant text-sm" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={compact ? "" : "mt-1"}>
      <button
        onClick={simulateCapture}
        className="w-full bg-surface-container hover:bg-surface-container-high border border-outline-variant/20 rounded-xl py-3 px-4 flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
      >
        <MaterialIcon name="upload_file" className="text-primary" />
        <span className="text-[10px] font-bold uppercase tracking-widest">
          Upload & Attach Receipt
        </span>
      </button>
    </div>
  );
}
