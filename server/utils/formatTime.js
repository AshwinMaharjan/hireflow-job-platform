import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const formatNotificationTime = (date) => {
  const now = dayjs();
  const target = dayjs(date);

  const diffMinutes = now.diff(target, "minute");
  const diffHours = now.diff(target, "hour");

  if (diffMinutes < 1) {
    return "Just now";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
  }

  if (diffHours < 24 && now.isSame(target, "day")) {
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  }

  if (now.subtract(1, "day").isSame(target, "day")) {
    return "Yesterday";
  }

  // Older than yesterday — show full date
  return target.format("D MMM YYYY, h:mm A");
};