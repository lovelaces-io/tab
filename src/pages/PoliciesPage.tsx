import { useState } from "react";
import { TopAppBar } from "../components/TopAppBar";
import { MaterialIcon } from "../components/MaterialIcon";
import { BottomSheet } from "../components/BottomSheet";
import { policyRules } from "../data/mock-data";

interface CategorySpec {
  icon: string;
  title: string;
  description: string;
  amount: string;
  label: string;
  details: string;
}

const categorySpecs: CategorySpec[] = [
  {
    icon: "flight",
    title: "Airline / Travel",
    description: "Economy class required. Upgrades need pre-approval",
    amount: "$500.00",
    label: "Per Trip",
    details: "All flights must be booked economy class unless the flight exceeds 6 hours, in which case premium economy is permitted. Business or first class requires written pre-approval from your department head. Booking should be done at least 14 days in advance when possible. Loyalty program selection is at the traveler's discretion.",
  },
  {
    icon: "hotel",
    title: "Lodging",
    description: "Standard room only. Mini-bar not reimbursable",
    amount: "$300.00",
    label: "Max Nightly",
    details: "Standard rooms at 3-star or 4-star hotels are reimbursable up to the nightly cap. Suite upgrades, resort fees, and mini-bar charges are not covered. Room service for meals falls under the dining per diem. Early check-in and late checkout fees are reimbursable if trip-related. Extended stays beyond 5 nights require manager approval.",
  },
  {
    icon: "restaurant",
    title: "Dining",
    description: "Includes tips (max 20%) and soft drinks",
    amount: "$75.00",
    label: "Per Diem",
    details: "The daily dining allowance covers breakfast, lunch, dinner, and non-alcoholic beverages. Tips are reimbursable up to 20% of the pre-tax bill. Alcoholic beverages are not covered. Team meals with clients may exceed the per diem with manager approval — attach a note with attendees and business purpose.",
  },
  {
    icon: "local_taxi",
    title: "Rideshare",
    description: "Rideshare or public transit preferred over rental",
    amount: "$100.00",
    label: "Per Day",
    details: "Uber, Lyft, and local public transit are preferred for ground transportation. Shared rides should be selected when available. Surge pricing over 2x should be avoided — consider waiting or using an alternative. Airport transfers are always covered regardless of the daily cap.",
  },
  {
    icon: "directions_car",
    title: "Car Rental",
    description: "Mid-size or below. Insurance via corporate card",
    amount: "$200.00",
    label: "Per Day",
    details: "Rentals should be mid-size or compact class. SUVs and luxury vehicles require pre-approval. Decline the rental company's insurance — the corporate card provides collision coverage. Fuel should be prepaid or receipts submitted separately under Gas/Mileage. Return the vehicle with a full tank to avoid refueling surcharges.",
  },
  {
    icon: "local_gas_station",
    title: "Gas / Mileage",
    description: "Personal vehicle reimbursement at IRS rate",
    amount: "$0.67/mi",
    label: "IRS Rate",
    details: "Personal vehicle use is reimbursed at the current IRS standard mileage rate. Log your starting and ending odometer readings or use a GPS mileage tracker. Commute miles (home to office) are not reimbursable. Tolls and parking fees are covered separately — submit individual receipts for each.",
  },
  {
    icon: "shopping_bag",
    title: "Retail / Supplies",
    description: "Office supplies, equipment, and project materials",
    amount: "$150.00",
    label: "Per Item",
    details: "Covers office supplies, project materials, and small equipment purchases needed for business travel. Items over the per-item limit require pre-approval. Electronics and hardware should be purchased through the company procurement portal when possible. All items purchased remain company property.",
  },
  {
    icon: "devices",
    title: "Software",
    description: "SaaS subscriptions and dev tools",
    amount: "Pre-App",
    label: "Required",
    details: "All software purchases and SaaS subscriptions require pre-approval through IT before purchase. This includes monthly subscriptions, annual licenses, and one-time tool purchases. Submit the vendor name, cost, and business justification. Approved tools are added to the company's software inventory for compliance tracking.",
  },
];

export function PoliciesPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategorySpec | null>(null);
  const isSheetOpen = selectedCategory !== null;

  return (
    <div className="page-transition pb-32">
      <TopAppBar />
      <main className="pt-8 px-6 max-w-5xl mx-auto">
        {/* Compliance score */}
        <section className="mb-12">
          <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_20px_40px_rgba(25,28,29,0.06)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div>
                <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-outline mb-2 block">
                  System Status
                </span>
                <h2 className="text-4xl font-extrabold tracking-tighter mb-2">
                  98% Policy Compliant
                </h2>
                <p className="text-on-surface-variant max-w-md">
                  Your expense reporting health is excellent. 41 of 42
                  submissions met all checks.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    {/* Outer track */}
                    <circle cx="50" cy="50" r="44" fill="none" stroke="var(--color-surface-container-high)" strokeWidth="6" />
                    {/* Outer primary ring (98% filled) */}
                    <circle cx="50" cy="50" r="44" fill="none" stroke="var(--color-primary)" strokeWidth="6" strokeLinecap="round" strokeDasharray={2 * Math.PI * 44} strokeDashoffset={2 * Math.PI * 44 * 0.02} />
                    {/* Inner lighter ring — flush inside outer, same width */}
                    <circle cx="50" cy="50" r="38" fill="none" stroke="var(--color-primary-container)" strokeWidth="6" strokeLinecap="round" strokeDasharray={2 * Math.PI * 38} strokeDashoffset={2 * Math.PI * 38 * 0.02} />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-lg font-black">
                    A+
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[0.6875rem] font-bold uppercase tracking-widest text-primary">
                    98%
                  </span>
                  <span className="text-sm font-medium">Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick rules */}
        <section className="mb-12">
          <h3 className="text-[0.75rem] font-bold uppercase tracking-[0.05em] mb-6 text-outline">
            Quick Rules
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {policyRules.map((rule) => (
              <div
                key={rule.title}
                className="bg-surface-container rounded-2xl p-6 transition-all hover:bg-surface-container-high group"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="material-symbols-outlined text-primary text-3xl">
                    {rule.icon}
                  </span>
                  <span className="bg-primary-container text-on-primary-container text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                    Policy
                  </span>
                </div>
                <h4 className="text-lg font-bold tracking-tight mb-2">
                  {rule.title}
                </h4>
                <p className="text-sm text-on-surface-variant mb-4">
                  {rule.description}
                </p>
                <div className="text-[0.6875rem] font-black uppercase tracking-widest text-primary group-hover:translate-x-1 transition-transform">
                  {rule.meta}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Category specification */}
        <section className="mb-12">
          <h3 className="text-[0.75rem] font-bold uppercase tracking-[0.05em] mb-6 text-outline">
            Category Specification
          </h3>
          <div className="space-y-3">
            {categorySpecs.map((item) => (
              <div
                key={item.title}
                onClick={() => setSelectedCategory(item)}
                className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10 flex items-center gap-4 cursor-pointer hover:bg-surface-container-low active:scale-[0.99] transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-on-surface-variant">
                    {item.icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold tracking-tight">{item.title}</h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {item.description}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-number font-extrabold block">
                    {item.amount}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                    {item.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Reimbursement SLA */}
        <section className="mb-12">
          <h3 className="text-[0.75rem] font-bold uppercase tracking-[0.05em] mb-6 text-outline">
            Reimbursement SLA
          </h3>
          <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/10 space-y-8">
            <div>
              <span className="text-5xl font-black text-primary tracking-tighter block">
                48h
              </span>
              <p className="font-bold text-sm uppercase tracking-tight mt-1">
                Target Approval
              </p>
              <p className="text-sm text-on-surface-variant mt-2">
                Average time for finance leads to review and approve submitted tabs.
              </p>
            </div>
            <div>
              <span className="text-5xl font-black text-on-surface tracking-tighter block">
                5-7
              </span>
              <p className="font-bold text-sm uppercase tracking-tight mt-1">
                Business Days
              </p>
              <p className="text-sm text-on-surface-variant mt-2">
                Estimated arrival of funds into your primary bank account post-approval.
              </p>
            </div>
            <div className="bg-surface-container rounded-xl p-5">
              <div className="flex items-start gap-3">
                <span
                  className="material-symbols-outlined text-primary mt-0.5"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  help
                </span>
                <div className="flex-1">
                  <p className="font-bold text-sm uppercase tracking-tight">
                    Policy Support
                  </p>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Unsure about a specific expense? Chat with our Finance Ops team.
                  </p>
                  <button className="mt-3 bg-primary text-on-primary font-bold text-xs uppercase tracking-widest py-2.5 px-6 rounded-lg hover:bg-primary/80 active:scale-[0.98] transition-all">
                    Contact Finance
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Category detail bottom sheet */}
      <BottomSheet isOpen={isSheetOpen} onClose={() => setSelectedCategory(null)}>
        {selectedCategory && (
          <div className="px-6 pb-8">
            <div className="flex items-center justify-between pt-2 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center">
                  <MaterialIcon name={selectedCategory.icon} className="text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-lg tracking-tight">{selectedCategory.title}</h2>
                  <span className="text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">
                    {selectedCategory.description}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCategory(null)}
                className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors"
              >
                <MaterialIcon name="close" className="text-on-surface-variant" />
              </button>
            </div>

            <div className="flex items-center gap-4 py-4 border-y border-outline-variant/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block">
                  Limit
                </span>
                <span className="font-number text-3xl font-extrabold">
                  {selectedCategory.amount}
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-primary-container/20 text-primary text-xs font-black uppercase tracking-widest">
                {selectedCategory.label}
              </span>
            </div>

            <div className="pt-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">
                Policy Details
              </span>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {selectedCategory.details}
              </p>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
