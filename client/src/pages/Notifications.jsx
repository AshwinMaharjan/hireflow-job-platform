import { useEffect, useMemo, useState } from "react";
import { useNotifications } from "../context/NotificationContext";
import api from "../services/api";
import { formatNotificationTime } from "../utils/formatTime";
import { getNotificationMeta } from "../utils/notificationMeta";
import Footer from "../components/home/Footer";
import { Bell, CheckCheck, Loader2 } from "lucide-react";

const FILTERS = ["All", "Unread"];

const Notifications = () => {
  const {
    notifications,
    setNotifications,
    unreadCount,
    setUnreadCount,
    fetchNotifications,
  } = useNotifications();

  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    const loadNotifications = async () => {
      await fetchNotifications();
      setLoading(false);
    };
    loadNotifications();
  }, []);

  const markAsRead = async (id) => {
    const target = notifications.find((n) => n._id === id);
    if (!target || target.isRead) return; // already read, nothing to do

    try {
      const token = localStorage.getItem("token");

      await api.patch(
        `/notifications/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id ? { ...notification, isRead: true } : notification
        )
      );

      setUnreadCount((count) => Math.max(count - 1, 0));
    } catch (error) {
      console.error(error);
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n._id);
    if (unreadIds.length === 0) return;

    setMarkingAll(true);
    const previous = notifications;

    
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);

    try {
      const token = localStorage.getItem("token");
      await Promise.all(
        unreadIds.map((id) =>
          api.patch(
            `/notifications/${id}/read`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      );
    } catch (error) {
      console.error(error);
      setNotifications(previous);
      setUnreadCount(unreadIds.length);
    } finally {
      setMarkingAll(false);
    }
  };

  const visibleNotifications = useMemo(() => {
    if (filter === "Unread") return notifications.filter((n) => !n.isRead);
    return notifications;
  }, [notifications, filter]);


  

  

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl animate-pulse px-6 py-10">
        <div className="mb-6 h-7 w-40 rounded bg-gray-200" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="mb-4 flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4">
            <div className="h-6 w-6 shrink-0 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 rounded bg-gray-200" />
              <div className="h-3.5 w-2/3 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <div className="mx-auto w-full max-w-3xl flex-1 p-6">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
              <Bell size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-xs text-gray-500">
                  {unreadCount} unread notification{unreadCount > 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              disabled={markingAll}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3.5 py-2 text-sm font-medium text-gray-600 transition hover:border-primary-300 hover:text-primary-600 disabled:opacity-50"
            >
              {markingAll ? <Loader2 size={15} className="animate-spin" /> : <CheckCheck size={15} />}
              Mark all as read
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="mb-5 flex gap-1 rounded-lg bg-gray-100 p-1 text-sm">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 rounded-md px-3 py-1.5 font-medium transition ${
                filter === f
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {f}
              {f === "Unread" && unreadCount > 0 && (
                <span className="ml-1.5 rounded-full bg-primary-100 px-1.5 py-0.5 text-xs font-semibold text-primary-700">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* List */}
        {visibleNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
            <Bell className="mb-3 text-gray-300" size={32} />
            <p className="font-medium text-gray-700">
              {filter === "Unread" ? "You're all caught up" : "No notifications yet"}
            </p>
            <p className="mt-1 text-sm text-gray-400">
              {filter === "Unread"
                ? "New notifications will show up here."
                : "We'll let you know when something needs your attention."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {visibleNotifications.map((notification) => {
              const { icon: Icon, color, bg, border } = getNotificationMeta(notification.type);

              return (
                <div
                  key={notification._id}
                  onClick={() => markAsRead(notification._id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") markAsRead(notification._id);
                  }}
                  className={`group relative flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition hover:shadow-sm ${
                    notification.isRead
                      ? "border-gray-100 bg-white"
                      : `${bg} ${border}`
                  }`}
                >
                  {!notification.isRead && (
                    <span className="absolute right-4 top-4 h-2 w-2 rounded-full bg-primary-600" />
                  )}

                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      notification.isRead ? "bg-gray-100" : "bg-white"
                    }`}
                  >
                    <Icon size={19} className={color} />
                  </div>

                  <div className="min-w-0 flex-1 pr-4">
                    <h2 className={`text-sm ${notification.isRead ? "font-medium text-gray-700" : "font-semibold text-gray-900"}`}>
                      {notification.title}
                    </h2>
                    <p className="mt-0.5 text-sm text-gray-500">{notification.message}</p>
                    <small className="mt-1.5 block text-xs text-gray-400">
                      {formatNotificationTime(notification.createdAt)}
                    </small>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Notifications;