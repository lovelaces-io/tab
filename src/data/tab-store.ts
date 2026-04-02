import { activeTrip, upcomingTrips, type Trip, type UpcomingTrip, type Expense } from "./mock-data";

export interface ClosedTab {
  tripName: string;
  dateRange: string;
  total: number;
  expenseCount: number;
  submittedAt: string;
  expenses: Expense[];
  status?: "submitted" | "reimbursed";
}

let currentTrip: Trip = { ...activeTrip };
let upcomingTripsList: UpcomingTrip[] = [...upcomingTrips];

/** Seed closed tabs with demo data so the Trips page has content on first load */
let closedTabs: ClosedTab[] = [
  {
    tripName: "NYC Client Summit",
    dateRange: "Feb 10 - Feb 14",
    total: 1482.35,
    expenseCount: 9,
    submittedAt: "Feb 15, 3:22 PM",
    expenses: [
      { merchant: "Delta Airlines", category: "Travel", amount: "$487.00", icon: "flight", status: "Approved", statusColor: "bg-primary-container/20 text-primary" },
      { merchant: "The Standard Hotel", category: "Lodging", amount: "$612.00", icon: "hotel", status: "Approved", statusColor: "bg-primary-container/20 text-primary" },
      { merchant: "Carbone", category: "Dining", amount: "$178.50", icon: "restaurant", status: "Approved", statusColor: "bg-primary-container/20 text-primary" },
      { merchant: "Uber", category: "Transport", amount: "$64.85", icon: "local_taxi", status: "Approved", statusColor: "bg-primary-container/20 text-primary" },
      { merchant: "Yellow Cab", category: "Transport", amount: "$32.00", icon: "local_taxi", status: "Approved", statusColor: "bg-primary-container/20 text-primary" },
      { merchant: "Sweetgreen", category: "Dining", amount: "$22.50", icon: "restaurant", status: "Approved", statusColor: "bg-primary-container/20 text-primary" },
      { merchant: "WeWork Day Pass", category: "Office", amount: "$45.00", icon: "business", status: "Approved", statusColor: "bg-primary-container/20 text-primary" },
      { merchant: "Starbucks", category: "Dining", amount: "$18.50", icon: "coffee", status: "Approved", statusColor: "bg-primary-container/20 text-primary" },
      { merchant: "JFK Parking", category: "Transport", amount: "$22.00", icon: "local_parking", status: "Approved", statusColor: "bg-primary-container/20 text-primary" },
    ],
  },
  {
    tripName: "Austin Team Offsite",
    dateRange: "Jan 6 - Jan 9",
    total: 873.20,
    expenseCount: 6,
    submittedAt: "Jan 10, 11:05 AM",
    status: "reimbursed",
    expenses: [
      { merchant: "Southwest Airlines", category: "Travel", amount: "$265.00", icon: "flight", status: "Reimbursed", statusColor: "bg-primary-container/20 text-primary" },
      { merchant: "Aloft Austin", category: "Lodging", amount: "$348.00", icon: "hotel", status: "Reimbursed", statusColor: "bg-primary-container/20 text-primary" },
      { merchant: "Franklin BBQ", category: "Dining", amount: "$94.20", icon: "restaurant", status: "Reimbursed", statusColor: "bg-primary-container/20 text-primary" },
      { merchant: "Lyft", category: "Transport", amount: "$41.00", icon: "local_taxi", status: "Reimbursed", statusColor: "bg-primary-container/20 text-primary" },
      { merchant: "Torchy's Tacos", category: "Dining", amount: "$28.00", icon: "restaurant", status: "Reimbursed", statusColor: "bg-primary-container/20 text-primary" },
      { merchant: "Austin Parking Garage", category: "Transport", amount: "$97.00", icon: "local_parking", status: "Reimbursed", statusColor: "bg-primary-container/20 text-primary" },
    ],
  },
];
let tabSubmitted = false;
let listeners: (() => void)[] = [];

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function getCurrentTrip(): Trip {
  return currentTrip;
}

export function getUpcomingTrips(): UpcomingTrip[] {
  return upcomingTripsList;
}

export function getClosedTabs(): ClosedTab[] {
  return closedTabs;
}

export function isTabSubmitted(): boolean {
  return tabSubmitted;
}

/** Clear the submitted flag so the new active trip shows expenses again */
export function clearSubmittedState() {
  tabSubmitted = false;
  notifyListeners();
}

/**
 * Close the current tab and archive it. Promotes the first upcoming trip
 * to become the new active trip, simulating a real trip rotation.
 */
export function submitTab(total: number, expenseCount: number, expenses: Expense[] = []) {
  const now = new Date();
  const submittedAt =
    now.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
    ", " +
    now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  closedTabs = [
    {
      tripName: currentTrip.name,
      dateRange: currentTrip.dateRange,
      total,
      expenseCount,
      submittedAt,
      expenses: [...expenses],
    },
    ...closedTabs,
  ];

  // Promote the first upcoming trip to become the active trip
  if (upcomingTripsList.length > 0) {
    const nextTrip = upcomingTripsList[0];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 21);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 26);

    currentTrip = {
      name: nextTrip.name,
      dateRange: `${formatDate(startDate)} - ${formatDate(endDate)}`,
      total: "",
      subTabs: [],
    };
    upcomingTripsList = upcomingTripsList.slice(1);
  }

  tabSubmitted = true;
  notifyListeners();
}

/** Reset all tab state to initial demo values */
export function resetTabStore() {
  currentTrip = { ...activeTrip };
  upcomingTripsList = [...upcomingTrips];
  closedTabs = [];
  tabSubmitted = false;
  notifyListeners();
}

export function subscribe(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((existingListener) => existingListener !== listener);
  };
}
