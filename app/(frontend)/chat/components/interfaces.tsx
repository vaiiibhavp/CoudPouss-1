export interface GetUserApiResponse {
  status: string;
  message: string;
  data: {
    user: UserData;
    provider_info?: ProviderInfo;
    past_work_files?: string[];
  };
}
export interface UserData {
  id: string;
  email: string;
  phone_number: string;
  password: string;
  address: string;
  longitude: number | null;
  created_at: string;
  lang: string;
  first_name: string;
  phone_country_code: string;
  last_name: string;
  role: string;
  service_provider_type: string | null;
  profile_photo_id: string | null;
  profile_photo_url: string | null;
  latitude: number | null;
  is_deleted: boolean;
  updated_at: string;
}

export interface ProviderInfo {
  id: string;
  services_provider_id: string;
  bio?: string;
  experience_speciality?: string;
  achievements?: string;
  years_of_experience?: number;
  is_docs_verified: boolean;
  docs_status: string;
  [key: string]: any;
}