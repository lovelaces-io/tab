import { MaterialIcon } from "./MaterialIcon";
import { BottomSheet } from "./BottomSheet";
import { type UpcomingTrip } from "../data/mock-data";

interface TripPreviewSheetProps {
  trip: UpcomingTrip | null;
  onClose: () => void;
}

export function TripPreviewSheet({ trip, onClose }: TripPreviewSheetProps) {
  return (
    <BottomSheet isOpen={trip !== null} onClose={onClose} maxHeight="85vh">
      {trip && (
        <div className="px-6 pb-8">
          {/* Header with trip name and close button */}
          <div className="flex items-center justify-between pt-2 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-container/20 rounded-full flex items-center justify-center">
                <MaterialIcon name={trip.icon} className="text-primary" />
              </div>
              <div>
                <h2 className="font-bold text-xl tracking-tight">{trip.name}</h2>
                <span className="text-xs text-on-surface-variant">
                  {trip.location}
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

          {/* Date and budget summary */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-surface-container rounded-xl p-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-1">
                Dates
              </span>
              <p className="font-bold text-sm">
                {trip.startDate.replace("Starts ", "")}
                {trip.endDate && ` — ${trip.endDate}`}
              </p>
            </div>
            <div className="bg-surface-container rounded-xl p-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-1">
                Budget
              </span>
              <p className="font-number font-bold text-sm">
                {trip.budget ?? "TBD"}
              </p>
            </div>
          </div>

          {/* Pre-arranged travel and accommodations */}
          {trip.prearranged && trip.prearranged.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-3">
                Pre-Arranged
              </span>
              <div className="space-y-3">
                {trip.prearranged.map((item, index) => (
                  <div
                    key={index}
                    className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/10 flex items-center gap-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                      <MaterialIcon name={item.icon} className="text-primary text-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary block">
                        {item.type}
                      </span>
                      <p className="text-sm font-medium truncate">{item.detail}</p>
                    </div>
                    <MaterialIcon name="check_circle" filled className="text-primary text-sm shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trip status note */}
          <div className="mt-6 bg-primary-container/10 border border-primary/20 rounded-xl p-4 flex items-center gap-3">
            <MaterialIcon name="schedule" className="text-primary" />
            <p className="text-xs text-on-surface-variant">
              This trip hasn't started yet. A new tab will open automatically when it begins.
            </p>
          </div>
        </div>
      )}
    </BottomSheet>
  );
}
