export interface Notification {
  message: string;
  merchant: string;
  amount: string;
  read: boolean;
  timestamp: string;
  icon?: string;
}

let notifications: Notification[] = [];
let listeners: (() => void)[] = [];

/** Notify all subscribers that the notification list has changed */
function notifyListeners() {
  listeners.forEach((listener) => listener());
}

/** Add a manager-approved expense notification */
export function addNotification(merchant: string, amount: string) {
  const now = new Date();
  const timestamp = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  notifications = [
    {
      message: `Tom W. approved ${merchant}`,
      merchant,
      amount,
      read: false,
      timestamp,
    },
    ...notifications,
  ];
  notifyListeners();
}

/** Add a notification when a tab is submitted to finance */
export function addTabSubmittedNotification(tripName: string, total: string) {
  const now = new Date();
  const timestamp = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  notifications = [
    {
      message: `Tab submitted for ${tripName}`,
      merchant: tripName,
      amount: total,
      read: false,
      timestamp,
      icon: "send",
    },
    ...notifications,
  ];
  notifyListeners();
}

export function getNotifications(): Notification[] {
  return notifications;
}

export function getUnreadCount(): number {
  return notifications.filter((notification) => !notification.read).length;
}

export function markAllRead() {
  notifications = notifications.map((notification) => ({ ...notification, read: true }));
  notifyListeners();
}

export function clearNotifications() {
  notifications = [];
  notifyListeners();
}

export function subscribe(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((existingListener) => existingListener !== listener);
  };
}
