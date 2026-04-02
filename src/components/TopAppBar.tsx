import { useState, useEffect, useRef } from "react";
import {
  getUnreadCount,
  getNotifications,
  markAllRead,
  clearNotifications,
  subscribe,
} from "../data/notification-store";

interface TopAppBarProps {
  title?: string;
  showStatus?: boolean;
}

const AVATAR_URL = "/avatar.png";

export function TopAppBar({ title, showStatus = true }: TopAppBarProps) {
  const [, forceUpdate] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return subscribe(() => forceUpdate((count) => count + 1));
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        avatarRef.current &&
        !avatarRef.current.contains(event.target as Node)
      ) {
        setAvatarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = getUnreadCount();
  const notifications = getNotifications();

  function handleBellClick() {
    if (dropdownOpen) {
      setDropdownOpen(false);
      clearNotifications();
    } else {
      setDropdownOpen(true);
      if (unreadCount > 0) {
        markAllRead();
      }
    }
  }

  return (
    <nav className="w-full top-0 sticky z-50 bg-background flex justify-between items-center px-6 py-4 border-b border-outline-variant/20">
      <div className="flex items-center gap-2">
        <img src="/tab-logo-dark.svg" alt="Tab logo" className="w-8 h-8 rounded-lg dark:hidden" />
        <img src="/tab-logo-dark-transparent.svg" alt="Tab logo" className="w-8 h-8 hidden dark:block" />
        <div className="flex flex-col">
          <h1 className="font-black text-3xl tracking-widest text-[#1a1a1a] dark:text-primary uppercase leading-none">
            TAB
          </h1>
          {title && (
            <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">
              {title}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {showStatus && (
          <>
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                System Active
              </p>
              <p className="text-xs font-bold text-primary">LOVELACES_DEMO</p>
            </div>
            <div className="relative" ref={avatarRef}>
              <button
                onClick={() => setAvatarOpen(!avatarOpen)}
                className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden border-2 border-primary-container shrink-0 hover:opacity-80 transition-opacity"
              >
                <img
                  alt="User avatar"
                  className="w-full h-full object-cover"
                  src={AVATAR_URL}
                />
              </button>
              {avatarOpen && (
                <div className="absolute right-0 top-12 bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-2xl p-4 z-50 w-56">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden border-2 border-primary-container shrink-0">
                      <img alt="User avatar" className="w-full h-full object-cover" src={AVATAR_URL} />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Brian Schwartz</p>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Product Engineer</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={handleBellClick}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors relative"
          >
            <span className="material-symbols-outlined text-on-surface-variant">
              notifications
            </span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-12 w-80 bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-2xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-outline-variant/10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Notifications
                </span>
              </div>
              {notifications.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-sm text-on-surface-variant/60">No notifications yet</p>
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto no-scrollbar">
                  {notifications.map((notification, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 border-b border-outline-variant/5 flex items-start gap-3 hover:bg-surface-container-low transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center shrink-0 mt-0.5">
                        <span
                          className="material-symbols-outlined text-primary text-sm"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          {notification.icon || "check_circle"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{notification.message}</p>
                        <p className="text-xs text-on-surface-variant">
                          {notification.amount} — {notification.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
