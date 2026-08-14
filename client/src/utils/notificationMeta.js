import { CheckCircle, XCircle, Eye, Bell } from "lucide-react";

const notificationMeta = {
  APPLICATION_APPROVED: {
    icon: CheckCircle,
    color: "text-green-500",
    bg: "bg-green-50",
    border: "border-green-400",
  },
  APPLICATION_REJECTED: {
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-50",
    border: "border-red-400",
  },
  APPLICATION_REVIEWED: {
    icon: Eye,
    color: "text-yellow-500",
    bg: "bg-yellow-50",
    border: "border-yellow-400",
  },
};

const defaultMeta = {
  icon: Bell,
  color: "text-blue-500",
  bg: "bg-blue-50",
  border: "border-blue-400",
};

export const getNotificationMeta = (type) => {
  return notificationMeta[type] || defaultMeta;
};