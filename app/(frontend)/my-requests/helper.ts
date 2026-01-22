type UiStatusConfig = {
  label: string;
  textColor: string;
  bgColor: string;
  dotColor: string;
};
export interface ServiceSearchItem {
  id: string;
  category_id: string;
  category_name: string;
  category_logo: string;
  sub_category_id: string;
  sub_category_name: string;
  sub_category_logo: string;
  service_type_photo_url: string;
  amount: number;
  total_renegotiated: string;
  status: string;
  is_professional: boolean;
  chosen_datetime: string;
  created_at: string;
  created_date: string;
  quoteid: string | null;
}
export interface ServiceSearchApiResponse {
  success: boolean;
  message: string;
  status_code: number;
  data: {
    recent_requests: {
      items: ServiceSearchItem[];
    };
  };
}



export const STATUS_CONFIG: Record<string, UiStatusConfig> = {
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
