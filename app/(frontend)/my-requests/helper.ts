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

export interface ServiceDetailData {
  service_id: string;
  task_status: string;
  service_description: string;
  chosen_datetime: string;
  category_name: string;
  category_logo: string;
  sub_category_name: string;
  provider: ProviderInfo;
  sub_category_logo: string;
  elder_address: string;
  lifecycle: LifecycleItem[];
  total_renegotiated: number;
  media: ServiceMedia;
  payment_breakdown: PaymentBreakdown;
  service_code: string;
}

interface PaymentBreakdown {
  finalize_quote_amount: number;
  platform_fees: number;
  tax: number;
  total_renegotiated: number;
}
export interface ProviderInfo {
  email: string;
  first_name: string;
  full_name: string;
  id: string;
  is_favorate: boolean;
  is_verified: boolean;
  last_name: string;
  profile_photo_url: string | null;
  profile_image_url: string | null;
}

export interface Request {
  id: string;
  serviceName: string;
  date: string;
  time: string;
  status: ApiStatus;
  image: string;
  category: string;
  location: string;
  quote: number;
  professional?: {
    email: string;
    first_name: string;
    full_name: string;
    id: string;
    profile_photo_url: string | null;
    profile_image_url: string | null;
    is_verified: boolean;
    is_favorate: boolean;
    last_name: string;
  };
  message: string;
  videos: string[];
  quoteId?: string;
}
export type ApiStatus =
  | "pending"
  | "open"
  | "accepted"
  | "completed"
  | "cancelled";

export interface ApiServiceRequest {
  id: string;
  category_id: string;
  sub_category_id: string;
  is_professional: boolean;
  status: string;
  amount: number | null;
  quoteid: string | null;
  total_renegotiated: string | null;
  chosen_datetime: string;
  created_at: string;
  service_type_photo_url: string;
  category_name: string;
  category_logo: string;
  sub_category_name: string;
  sub_category_logo: string;
  created_date: string;
}

export interface ServiceRequestsApiResponse {
  message: string;
  data: {
    recent_requests: {
      total_items: number;
      page: number;
      limit: number;
      items: ApiServiceRequest[];
    };
  };
  success: boolean;
  status_code: number;
}

export interface LifecycleItem {
  id: number;
  name: string;
  time: string | null;
  completed: boolean;
}

export interface ServiceMedia {
  photos: string[];
  videos: string[];
}

export interface ServiceDetailApiResponse {
  message: string;
  data: ServiceDetailData;
  success: boolean;
  status_code: number;
}

export interface FavoriteResponse {
  message: string;
  success: boolean;
  status_code: number;
  data: {
    elderly_id: string;
    favorite_list: string[];
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
