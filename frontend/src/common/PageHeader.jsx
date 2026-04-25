/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import notificationService from "../api/notificationService";

function PageHeader({ title, description }) {
  const { user, loading: authLoading } = useAuth();
  const mockProfilePicture = "/zentro_logo.png";
  const [notifications, setNotifications] = useState([]);
  const [seenNotificationIds, setSeenNotificationIds] = useState(new Set(JSON.parse(localStorage.getItem('seenNotifications') || '[]')));
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getRoleDisplay = (role) => {
    if (!role) return "User";
    if (role.includes("ROLE_ADMIN")) return "Administrator";
    if (role.includes("ROLE_STUDENT")) return "Student";
    return role;
  };

  const currentUser = user || { fullName: "Loading...", email: "..." };
  const roleDisplay = getRoleDisplay(currentUser.role);
  const loading = authLoading;

  const unseenNotifications = notifications.filter((n) => !seenNotificationIds.has(n.id));
  const unseenCount = unseenNotifications.length;
  const hasBookingApproval = unseenNotifications.some((n) => n.title === "Booking Approved");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await notificationService.getNotifications();
        if (res.success) {
          setNotifications(res.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    if (!loading && user) {
      fetchNotifications();
    }
  }, [loading, user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.notification-dropdown')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const markNotificationsAsSeen = () => {
    const newSeenIds = new Set(seenNotificationIds);
    unseenNotifications.forEach((n) => newSeenIds.add(n.id));
    setSeenNotificationIds(newSeenIds);
    localStorage.setItem('seenNotifications', JSON.stringify([...newSeenIds]));
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    if (!dropdownOpen) {
      markNotificationsAsSeen();
    }
  };

  const formatDateTime = (value) => {
    if (!value) return "-";
    return new Date(value).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
  };

  return (
    <header className="mb-6 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="mt-2 text-sm text-slate-600">{description}</p>
        </div>

        <div className="flex items-center gap-3">
          {!loading && (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="relative p-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                {unseenCount > 0 && (
                  <span className={`absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white ${hasBookingApproval ? 'bg-green-500' : 'bg-red-500'}`}>
                    {unseenCount > 9 ? '9+' : unseenCount}
                  </span>
                )}
              </button>

              {dropdownOpen && (
                <div className="notification-dropdown absolute right-0 top-12 z-50 w-80 rounded-lg border border-slate-200 bg-white shadow-lg">
                  <div className="p-4 border-b border-slate-200">
                    <h3 className="font-semibold text-slate-900">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-slate-500">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div key={notification.id} className="p-4 border-b border-slate-100 last:border-b-0">
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${notification.title === "Booking Approved" ? "bg-green-500" : "bg-blue-500"}`}></div>
                            <div className="flex-1">
                              <h4 className="font-medium text-slate-900 text-sm">{notification.title}</h4>
                              <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                              <p className="text-xs text-slate-400 mt-2">
                                {formatDateTime(notification.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200"></div>
              <div className="space-y-1">
                <div className="h-4 w-24 animate-pulse rounded bg-slate-200"></div>
                <div className="h-3 w-16 animate-pulse rounded bg-slate-200"></div>
              </div>
            </div>
          )}

          {!loading && (
            <div className="flex items-center gap-3">
              <img
                src={currentUser.profilePicture || mockProfilePicture}
                alt={currentUser.fullName || "User"}
                className="h-10 w-10 rounded-full border border-tertiary object-cover bg-white"
              />
              <div className="text-right leading-tight">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary bg-primary/10 px-2 py-0.5 rounded-full inline-block mb-1">
                  {roleDisplay}
                </p>
                <p className="text-sm font-bold text-slate-900">{currentUser.fullName}</p>
                <p className="text-[11px] text-slate-500">{currentUser.email}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default PageHeader;
