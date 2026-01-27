export interface CustomerRatings {
  work_quality: number;
  reliability: number;
  punctuality: number;
  solution: number;
  payout: number;
}
export interface RecentReview {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone_number: string;
  role: "elderly_user";
  lang: string;
  profile_photo_url: string;
  days_ago: number;
  rating: number;
  review: string;
}
export interface ProviderInfo {
  bio: string;
  experience: string;
  speciality: string;
  achievements: string;
  docs_status: "uploaded" | "pending" | "rejected";
}
export interface Professional {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone_country_code: string;
  phone_number: string;
  role: "service_provider";
  profile_photo_url: string;
  is_certified: boolean;
  certified_message: string;
  overall_ratings: string;
  total_ratings: string;
  total_reviews: string;
  customer_ratings: string; // parsed separately
  recent_works_and_reviews: RecentReview[];
  unique_clients_served: number;
  provider_info: ProviderInfo;
  past_work_photos: string[];
  past_work_videos: string[];
}
export interface ProfessionalResponse {
  success: boolean;
  status_code: number;
  message: string;
  data: Professional;
}
