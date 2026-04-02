import type { Expense } from "./mock-data";
import { tabExpenses as initialExpenses } from "./mock-data";

/** Maps expense categories to their Material Symbol icon names */
const CATEGORY_ICONS: Record<string, string> = {
  Airline: "flight_takeoff",
  Hotel: "hotel",
  Restaurant: "restaurant",
  Coffee: "coffee",
  Rideshare: "local_taxi",
  "Car Rental": "directions_car",
  "Gas Station": "local_gas_station",
  "Retail/Supplies": "shopping_bag",
};

let expenses: Expense[] = [...initialExpenses];
let listeners: (() => void)[] = [];

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

/**
 * Add an expense that exceeds policy and requires manager approval.
 * These show in the "Pending" section until the simulated approval fires.
 */
export function addPendingExpense(merchant: string, category: string, amount: number, receiptUrl?: string) {
  const now = new Date();
  const submittedAt =
    now.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
    ", " +
    now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  expenses = [
    ...expenses,
    {
      merchant,
      category,
      amount: `$${amount.toFixed(2)}`,
      icon: CATEGORY_ICONS[category] ?? "receipt_long",
      status: "Pending Approval",
      statusColor: "bg-secondary-container",
      missingReceipt: !receiptUrl,
      submittedAt,
      receiptUrl,
    },
  ];
  notifyListeners();
}

/**
 * Add an expense that falls within policy limits and is auto-approved.
 * These appear directly in the "Expenses" section.
 */
export function addApprovedExpense(merchant: string, category: string, amount: number, receiptUrl?: string) {
  expenses = [
    ...expenses,
    {
      merchant,
      category,
      amount: `$${amount.toFixed(2)}`,
      icon: CATEGORY_ICONS[category] ?? "receipt_long",
      status: "Within Policy",
      statusColor: "bg-primary-container",
      missingReceipt: !receiptUrl,
      receiptUrl,
    },
  ];
  notifyListeners();
}

export function getAllExpenses(): Expense[] {
  return expenses;
}

export function getPendingExpenses(): Expense[] {
  return [...expenses.filter((expense) => expense.status === "Pending Approval")].reverse();
}

export function getApprovedExpenses(): Expense[] {
  return [...expenses.filter((expense) => expense.status !== "Pending Approval")].reverse();
}

function parseAmount(amount: string): number {
  return parseFloat(amount.replace(/[$,]/g, "")) || 0;
}

export function getTotal(): number {
  return expenses.reduce((sum, expense) => sum + parseAmount(expense.amount), 0);
}

export function getPendingTotal(): number {
  return getPendingExpenses().reduce((sum, expense) => sum + parseAmount(expense.amount), 0);
}

export function getApprovedTotal(): number {
  return getApprovedExpenses().reduce((sum, expense) => sum + parseAmount(expense.amount), 0);
}

export function getFirstPending(): Expense | null {
  return expenses.find((expense) => expense.status === "Pending Approval") ?? null;
}

/**
 * Approve the first pending expense in the list. Used by the simulated
 * manager approval timer in App.tsx. Returns the approved expense so the
 * caller can create a notification.
 */
export function approveFirstPending(): Expense | null {
  const index = expenses.findIndex((expense) => expense.status === "Pending Approval");
  if (index === -1) return null;
  const approved = {
    ...expenses[index],
    status: "Approved by Tom W.",
    statusColor: "bg-primary-container",
    missingReceipt: false,
  };
  expenses = [...expenses.slice(0, index), approved, ...expenses.slice(index + 1)];
  notifyListeners();
  return approved;
}

export function clearExpenses() {
  expenses = [];
  notifyListeners();
}

export function resetData() {
  expenses = [...initialExpenses];
  notifyListeners();
}

export function subscribe(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((existingListener) => existingListener !== listener);
  };
}
