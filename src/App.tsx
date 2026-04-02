import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { BottomNav } from "./components/BottomNav";
import { AddExpenseSheet } from "./components/AddExpenseSheet";
import { NotificationToast } from "./components/NotificationToast";
import { DemoOverlay } from "./components/DemoOverlay";
import { HeroPage } from "./pages/HeroPage";
import { PoliciesPage } from "./pages/PoliciesPage";
import { MyTabPage } from "./pages/MyTabPage";
import { CloseTabPage } from "./pages/CloseTabPage";
import { TripsPage } from "./pages/TripsPage";
import { SettingsPage } from "./pages/SettingsPage";
import {
  getFirstPending,
  approveFirstPending,
  subscribe as subscribeExpenses,
} from "./data/expense-store";
import {
  addNotification,
  subscribe as subscribeNotifications,
  getNotifications,
} from "./data/notification-store";

/**
 * Inner shell that has access to useLocation (must be inside BrowserRouter).
 * Handles conditional rendering of app chrome (bottom nav, add expense sheet,
 * demo overlay) based on whether the user is on the hero/marketing page or
 * inside the demo app.
 */
function AppShell() {
  const location = useLocation();
  const isHeroPage = location.pathname === "/";

  const [addSheetOpen, setAddSheetOpen] = useState(false);
  const [, forceUpdate] = useState(0);

  // Re-render when stores change so child props stay fresh
  useEffect(() => {
    const unsubscribeExpenses = subscribeExpenses(() => forceUpdate((count) => count + 1));
    const unsubscribeNotifications = subscribeNotifications(() => forceUpdate((count) => count + 1));
    return () => { unsubscribeExpenses(); unsubscribeNotifications(); };
  }, []);

  // Simulated manager approval — automatically approves the first pending
  // expense after 10 seconds. Only starts once the user has dismissed the
  // demo overlay (indicated by sessionStorage flag). Re-arms when
  // notifications are cleared (which happens on data reset).
  useEffect(() => {
    const demoOverlayDismissed = sessionStorage.getItem("tab-demo-seen");
    if (!demoOverlayDismissed) return;

    const pendingExpense = getFirstPending();
    const notifications = getNotifications();

    // Only fire if there's a pending expense and no notifications yet
    if (!pendingExpense || notifications.length > 0) return;

    const approvalTimer = setTimeout(() => {
      const approvedExpense = approveFirstPending();
      if (approvedExpense) {
        addNotification(approvedExpense.merchant, approvedExpense.amount);
      }
    }, 10000);

    return () => clearTimeout(approvalTimer);
  });

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <NotificationToast />
      <Routes>
        <Route path="/" element={<HeroPage />} />
        <Route path="/current" element={<MyTabPage />} />
        <Route path="/policies" element={<PoliciesPage />} />
        <Route path="/close" element={<CloseTabPage />} />
        <Route path="/trips" element={<TripsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!isHeroPage && (
        <>
          <DemoOverlay />
          <BottomNav onAddClick={() => setAddSheetOpen(true)} />
          <AddExpenseSheet
            isOpen={addSheetOpen}
            onClose={() => setAddSheetOpen(false)}
          />
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
