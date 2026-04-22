import React, { useState, useEffect } from "react";
import notificationService from "../../../api/notificationService";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../common/toast";
import { validateNotification } from "./validator/validator";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotif, setEditingNotif] = useState(null);
  const [formData, setFormData] = useState({ title: "", message: "", targetRole: "ALL", scheduledAt: "" });
  const [errors, setErrors] = useState({});
  const { user } = useAuth();
  const { showToast } = useToast();
  const isAdmin = user?.role?.includes("ADMIN");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationService.getNotifications();
      if (res.success) setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications", err);
      showToast("Failed to fetch notifications", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validateNotification(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      showToast("Please fix the errors in the form", "error");
      return;
    }

    try {
      const dataToSubmit = { ...formData };
      if (!dataToSubmit.scheduledAt) delete dataToSubmit.scheduledAt;

      if (editingNotif) {
        await notificationService.updateNotification(editingNotif.id, dataToSubmit);
        showToast("Notification updated successfully!");
      } else {
        await notificationService.createNotification(dataToSubmit);
        showToast("Notification created successfully!");
      }
      setIsModalOpen(false);
      setEditingNotif(null);
      setFormData({ title: "", message: "", targetRole: "ALL", scheduledAt: "" });
      setErrors({});
      fetchNotifications();
    } catch (err) {
      console.error("Error saving notification", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      try {
        await notificationService.deleteNotification(id);
        showToast("Notification deleted");
        fetchNotifications();
      } catch (err) {
        showToast("Failed to delete notification", "error");
      }
    }
  };

  const isScheduledInFuture = (dateString) => {
    return new Date(dateString) > new Date();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">System Notifications</h2>
          <p className="text-slate-500 text-sm">Manage announcements for students and staff.</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => { 
              setEditingNotif(null); 
              setFormData({ title: "", message: "", targetRole: "ALL", scheduledAt: "" }); 
              setErrors({});
              setIsModalOpen(true); 
            }}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-primary-dark transition"
          >
            + Create Notification
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {notifications.map((notif) => (
            <div key={notif.id} className={`rounded-xl border p-6 shadow-sm hover:shadow-md transition ${isScheduledInFuture(notif.scheduledAt) ? "bg-slate-50 border-dashed border-slate-300" : "bg-white border-slate-200"}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${notif.targetRole === "ROLE_ADMIN" ? "bg-purple-100 text-purple-700" :
                        notif.targetRole === "ROLE_STUDENT" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                      }`}>
                      {notif.targetRole === "ALL" ? "BroadCast" : notif.targetRole.replace("ROLE_", "")}
                    </span>
                    {isScheduledInFuture(notif.scheduledAt) && (
                      <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        Scheduled
                      </span>
                    )}
                    <span className="text-xs text-slate-400">
                      {isScheduledInFuture(notif.scheduledAt) ? "Releases: " : "Released: "}
                      {new Date(notif.scheduledAt || notif.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900">{notif.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{notif.message}</p>
                </div>
                {isAdmin && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingNotif(notif);
                        setFormData({
                          title: notif.title,
                          message: notif.message,
                          targetRole: notif.targetRole,
                          scheduledAt: notif.scheduledAt ? notif.scheduledAt.substring(0, 16) : ""
                        });
                        setErrors({});
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-slate-400 hover:text-blue-600 transition"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(notif.id)}
                      className="p-2 text-slate-400 hover:text-red-600 transition"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {notifications.length === 0 && (
            <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
              <p className="text-slate-500">No notifications found.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal for Create/Update */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">
                {editingNotif ? "Edit Notification" : "Create Notification"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    if (errors.title) setErrors({ ...errors, title: "" });
                  }}
                  className={`w-full rounded-lg border px-4 py-2 focus:ring-2 outline-none transition ${
                    errors.title ? "border-red-500 focus:ring-red-200" : "border-slate-200 focus:ring-primary/20"
                  }`}
                  placeholder="e.g. Campus Maintenance"
                />
                {errors.title && <p className="mt-1 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.title}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Target Audience</label>
                  <select
                    value={formData.targetRole}
                    onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:ring-2 focus:ring-primary/20 outline-none transition text-sm"
                  >
                    <option value="ALL">Everyone</option>
                    <option value="ROLE_STUDENT">Students Only</option>
                    <option value="ROLE_ADMIN">Admins Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Schedule For</label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledAt}
                    onChange={(e) => {
                      setFormData({ ...formData, scheduledAt: e.target.value });
                      if (errors.scheduledAt) setErrors({ ...errors, scheduledAt: "" });
                    }}
                    className={`w-full rounded-lg border px-4 py-2 focus:ring-2 outline-none transition text-sm ${
                      errors.scheduledAt ? "border-red-500 focus:ring-red-200" : "border-slate-200 focus:ring-primary/20"
                    }`}
                  />
                  {errors.scheduledAt && <p className="mt-1 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.scheduledAt}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea
                  rows="4"
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value });
                    if (errors.message) setErrors({ ...errors, message: "" });
                  }}
                  className={`w-full rounded-lg border px-4 py-2 focus:ring-2 outline-none transition ${
                    errors.message ? "border-red-500 focus:ring-red-200" : "border-slate-200 focus:ring-primary/20"
                  }`}
                  placeholder="Describe the announcement..."
                />
                {errors.message && <p className="mt-1 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.message}</p>}
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-lg px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white shadow-md hover:bg-primary-dark transition"
                >
                  {editingNotif ? "Save Changes" : "Send Notification"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
