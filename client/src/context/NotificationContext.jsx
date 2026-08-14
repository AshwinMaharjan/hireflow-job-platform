import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import socket from "../services/socket";
import { AuthContext } from "./AuthContext";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/notifications/unread-count", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUnreadCount(res.data.unreadCount);
    } catch (error) {
      console.error(error);
    }
  };
  console.log("NotificationContext user:", user);
  useEffect(() => {
    if (!user) return;

    socket.connect();
    socket.emit("join", user._id);

    socket.on("new_notification", (notification) => {
      fetchUnreadCount();
      fetchNotifications();
    });

    return () => {
      socket.off("new_notification");
      socket.disconnect();
    };
  }, [user]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        setNotifications,

        unreadCount,
        setUnreadCount,

        fetchNotifications,
        fetchUnreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  return useContext(NotificationContext);
};
