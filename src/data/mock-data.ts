export interface Expense {
  merchant: string;
  category: string;
  amount: string;
  icon: string;
  status: string;
  statusColor: string;
  missingReceipt?: boolean;
  submittedAt?: string;
  receiptUrl?: string;
  notes?: string;
}

export interface PolicyRule {
  icon: string;
  title: string;
  description: string;
  meta: string;
}

export interface RecentActivity {
  merchant: string;
  amount: string;
  icon: string;
}

export interface Alert {
  icon: string;
  iconColor: string;
  borderColor: string;
  amount: string;
  label: string;
  title: string;
  actionLabel: string;
  actionColor: string;
}

export interface ApprovedItem {
  amount: string;
  category: string;
  date: string;
}

export interface Trip {
  name: string;
  dateRange: string;
  total: string;
  subTabs: { label: string; amount: string }[];
}

export interface UpcomingTrip {
  icon: string;
  name: string;
  startDate: string;
  dimmed?: boolean;
  endDate?: string;
  budget?: string;
  location?: string;
  prearranged?: { type: string; detail: string; icon: string }[];
}

export const recentActivity: RecentActivity[] = [
  { merchant: "Blue Bottle Coffee", amount: "$12.45", icon: "restaurant" },
  { merchant: "Uber Direct", amount: "$44.20", icon: "local_taxi" },
];

export const tabExpenses: Expense[] = [
  {
    merchant: "The Capital Grille",
    category: "Business Dining",
    amount: "$184.20",
    icon: "restaurant",
    status: "Within Policy",
    statusColor: "bg-primary-container",
    receiptUrl: "/receipts/capital-grille.png",
  },
  {
    merchant: "Delta Airlines",
    category: "Travel",
    amount: "$342.30",
    icon: "flight_takeoff",
    status: "Pending Approval",
    statusColor: "bg-secondary-container",
    missingReceipt: false,
    submittedAt: "Mar 25, 2:14 PM",
    receiptUrl: "/receipts/delta-airlines.png",
  },
  {
    merchant: "Uber Technologies",
    category: "Ground Transport",
    amount: "$97.00",
    icon: "local_taxi",
    status: "Within Policy",
    statusColor: "bg-primary-container",
    receiptUrl: "/receipts/uber.png",
  },
];

export const policyRules: PolicyRule[] = [
  {
    icon: "receipt_long",
    title: "Receipt Required",
    description: "Mandatory for all transactions exceeding $25.",
    meta: "Value: > $25.00",
  },
  {
    icon: "restaurant",
    title: "Meal Limit",
    description: "Daily allowance covering all meals.",
    meta: "$75.00 Per Day",
  },
  {
    icon: "flight_takeoff",
    title: "Travel Class",
    description: "Economy for domestic. Business for >8hrs.",
    meta: "Economy Standard",
  },
];

export const closeTabAlerts: Alert[] = [
  {
    icon: "policy",
    iconColor: "text-error",
    borderColor: "border-error",
    amount: "$842.00",
    label: "Missing Receipt",
    title: "Lufthansa Flight - LH401",
    actionLabel: "Upload Receipt",
    actionColor: "bg-error",
  },
  {
    icon: "receipt_long",
    iconColor: "text-secondary",
    borderColor: "border-secondary",
    amount: "$124.50",
    label: "Tax Discrepancy",
    title: "Grand Hyatt Berlin",
    actionLabel: "Edit Details",
    actionColor: "bg-secondary",
  },
];

export const approvedItems: ApprovedItem[] = [
  { amount: "$1,240.00", category: "Corporate Housing", date: "OCT 12-15" },
  { amount: "$436.00", category: "Regional Transport", date: "OCT 14" },
];

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function buildTrips() {
  const now = new Date();

  // Active trip: started 2 days ago, ends 3 days from now
  const activeStart = new Date(now);
  activeStart.setDate(now.getDate() - 2);
  const activeEnd = new Date(now);
  activeEnd.setDate(now.getDate() + 3);

  // Upcoming trip 1: starts 3 weeks from now
  const upcoming1 = new Date(now);
  upcoming1.setDate(now.getDate() + 21);

  // Upcoming trip 2: starts 6 weeks from now
  const upcoming2 = new Date(now);
  upcoming2.setDate(now.getDate() + 42);

  return {
    active: {
      name: "SF Tech Summit",
      dateRange: `${formatDate(activeStart)} - ${formatDate(activeEnd)}`,
      total: "",
      subTabs: [],
    } as Trip,
    upcoming: [
      {
        icon: "flight_takeoff",
        name: "London Q4 Planning",
        startDate: `Starts ${formatDate(upcoming1)}`,
        endDate: formatDate(new Date(upcoming1.getTime() + 4 * 86400000)),
        location: "London, UK",
        budget: "$4,200.00",
        prearranged: [
          { type: "Flight", detail: "AA 107 — ORD → LHR, Main Cabin", icon: "flight_takeoff" },
          { type: "Hotel", detail: "The Savoy — 4 nights, Standard Room", icon: "hotel" },
          { type: "Transport", detail: "Heathrow Express + Oyster Card", icon: "directions_transit" },
        ],
      },
      {
        icon: "corporate_fare",
        name: "NYC Partner Meeting",
        startDate: `Starts ${formatDate(upcoming2)}`,
        endDate: formatDate(new Date(upcoming2.getTime() + 2 * 86400000)),
        location: "New York, NY",
        budget: "$2,800.00",
        dimmed: true,
        prearranged: [
          { type: "Flight", detail: "UA 456 — ORD → JFK, Economy", icon: "flight_takeoff" },
          { type: "Hotel", detail: "The Standard — 2 nights", icon: "hotel" },
        ],
      },
    ] as UpcomingTrip[],
  };
}

const trips = buildTrips();
export const activeTrip: Trip = trips.active;

export const categoryProjectCodes: Record<string, string> = {
  Airline: "#4821",
  Hotel: "#3307",
  Restaurant: "#7145",
  Coffee: "#7145",
  Rideshare: "#2093",
  "Car Rental": "#2093",
  "Gas Station": "#2093",
  "Retail/Supplies": "#5512",
};

export const policyLimits: Record<string, number> = {
  Airline: 500,
  Hotel: 300,
  Restaurant: 75,
  Coffee: 25,
  Rideshare: 100,
  "Car Rental": 200,
  "Gas Station": 75,
  "Retail/Supplies": 150,
};

export const upcomingTrips: UpcomingTrip[] = trips.upcoming;
