type UiStatusConfig = {
  label: string;
  textColor: string;
  bgColor: string;
  dotColor: string;
};

export  const STATUS_CONFIG: Record<string, UiStatusConfig> = {
  "pending": {
    label: "Responded",
    textColor: "#F59E0B",
    bgColor: "rgba(245, 158, 11, 0.1)",
    dotColor: "#F59E0B",
  },
  "open": {
    label: "Open Proposal",
    textColor: "#10B981",
    bgColor: "rgba(16, 185, 129, 0.1)",
    dotColor: "#10B981",
  },
  "accepted": {
    label: "Validation",
    textColor: "#2563EB",
    bgColor: "rgba(37, 99, 235, 0.1)",
    dotColor: "#2563EB",
  },
  "completed": {
    label: "Completed",
    textColor: "#16A34A",
    bgColor: "rgba(22, 163, 74, 0.1)",
    dotColor: "#16A34A",
  },
  "cancelled": {
    label: "Cancelled",
    textColor: "#DC2626",
    bgColor: "rgba(220, 38, 38, 0.1)",
    dotColor: "#DC2626",
  },
};

export const getSafeImageSrc = (
  src?: string | null,
  fallback = "/icons/appLogo.png",
) => {
  if (!src) return fallback;

  // absolute url
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }

  // relative path
  if (src.startsWith("/")) {
    return src;
  }

  // everything else is invalid
  return fallback;
};
