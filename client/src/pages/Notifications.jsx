import { useEffect, useState } from "react";
import { useNotifications } from "../context/NotificationContext";
import api from "../services/api";
import { formatNotificationTime } from "../utils/formatTime";
import { getNotificationMeta } from "../utils/notificationMeta";

const Notifications = () => {
  const {
    notifications,
    setNotifications,
    unreadCount,
    setUnreadCount,
    fetchNotifications,
  } = useNotifications();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      await fetchNotifications();
      setLoading(false);
    };
    loadNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await api.patch(
        `/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const target = notifications.find((n) => n._id === id);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );

      if (target && !target.isRead) {
        setUnreadCount((count) => Math.max(count - 1, 0));
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>

      {notifications.length === 0 ? (
        <p>No notifications found.</p>
      ) : (
        notifications.map((notification) => {
          const { icon: Icon, color, bg, border } = getNotificationMeta(
            notification.type
          );

          return (
            <div
              key={notification._id}
              onClick={() => markAsRead(notification._id)}
              className={`cursor-pointer border rounded-lg p-4 mb-4 flex gap-3 items-start ${
                notification.isRead
                  ? "bg-white border-gray-200"
                  : `${bg} ${border}`
              }`}
            >
              <Icon size={22} className={`${color} shrink-0 mt-1`} />

              <div>
                <h2 className="font-semibold">{notification.title}</h2>
                <p>{notification.message}</p>
                <small className="text-gray-500">
                  {formatNotificationTime(notification.createdAt)}
                </small>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Notifications;