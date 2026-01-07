"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Paper,
  Radio,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, FieldProps } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { ROUTES } from "@/constants/routes";
import { setTokens } from "@/lib/redux/authSlice";
import { AppDispatch } from "@/lib/redux/store";
import Image from "next/image";
import { apiPost, apiPostFormData, apiGet, apiPatch } from "@/lib/api";
import {
  buildInputData,
  isValidEmailOrMobile,
  parseMobile,
} from "@/utils/validation";
import { API_ENDPOINTS } from "@/constants/api";
import PhoneInputWrapper from "@/components/PhoneInputWrapper";
import SuccessModal from "@/components/SuccessModal";
import ThankYouModal from "@/components/ThankYouModal";
import AddCategoryModal from "@/components/AddCategoryModal";

type SignupStep =
  | "enter-contact"
  | "verify-otp"
  | "create-password"
  | "add-details"
  | "select-plan"
  | "review-plan"
  | "payment-mode"
  | "additional-details"
  | "select-category"
  | "bank-details";

interface SignUpApiError {
  [key: string]: string;
}

interface ProfilePhotoApi {
  data?: any;
  error?: {
    message?: string;
  };
}

interface SignUpApiResponse {
  data: any | null;
  error: SignUpApiError | null;
}

interface Plan {
  id: string;
  name: string;
  type: string;
  price: number;
  duration: string;
  description: string;
  features: string[];
}

interface PlansResponse {
  status: string;
  message: string;
  data: {
    professional: Plan[];
    non_professional: Plan[];
  };
}

interface Category {
  id: string;
  category_name: string;
  category_logo: string | null;
}

interface CategoriesResponse {
  message: string;
  data: Category[];
  success: boolean;
  status_code: number;
}

// Helper function to normalize category name to value
const normalizeCategoryValue = (categoryName: string): string => {
  return categoryName.toLowerCase().replace(/\s+/g, "-");
};

// Map category names to existing icon mappings
const getCategoryIconKey = (categoryName: string): string => {
  const normalized = categoryName.toLowerCase();
  if (normalized.includes("diy") || normalized === "diy") return "diy";
  if (normalized.includes("garden")) return "gardening";
  if (normalized.includes("move") || normalized.includes("transport"))
    return "moving";
  if (normalized.includes("housekeep") || normalized.includes("clean"))
    return "housekeeping";
  if (normalized.includes("child")) return "childcare";
  if (normalized.includes("pet")) return "pets";
  if (normalized.includes("tech") || normalized.includes("it")) return "it";
  if (normalized.includes("homecare") || normalized.includes("care"))
    return "homecare";
  if (normalized.includes("personal care")) return "homecare";
  return "diy"; // Default fallback
};

// Map API category names to service object keys
const getServiceKey = (categoryName: string): string => {
  const normalized = categoryName.toLowerCase();
  if (normalized.includes("diy") || normalized === "diy") return "diy";
  if (normalized.includes("garden")) return "gardening";
  if (normalized.includes("move") || normalized.includes("transport"))
    return "moving";
  if (normalized.includes("housekeep") || normalized.includes("clean"))
    return "housekeeping";
  if (normalized.includes("child")) return "childcare";
  if (normalized.includes("pet")) return "pets";
  if (normalized.includes("tech") || normalized.includes("it")) return "it";
  if (normalized.includes("homecare") || normalized.includes("care"))
    return "homecare";
  if (normalized.includes("personal care")) return "homecare";
  return "diy"; // Default fallback
};

const services: {
  [key: string]: { id: number; name: string; image: string }[];
} = {
  diy: [
    { id: 1, name: "Furniture Assembly", image: "/image/main.png" },
    { id: 2, name: "Interior Painting", image: "/image/main.png" },
    { id: 3, name: "Exterior Painting", image: "/image/main.png" },
    { id: 4, name: "Plumbing", image: "/image/main.png" },
    { id: 5, name: "Electrical Work", image: "/image/main.png" },
  ],
  gardening: [
    { id: 1, name: "Lawn Mowing", image: "/image/main.png" },
    { id: 2, name: "Tree Trimming", image: "/image/main.png" },
    { id: 3, name: "Garden Design", image: "/image/main.png" },
    { id: 4, name: "Landscaping", image: "/image/main.png" },
  ],
  moving: [
    { id: 1, name: "Local Moving", image: "/image/main.png" },
    { id: 2, name: "Long Distance Moving", image: "/image/main.png" },
    { id: 3, name: "Packing Services", image: "/image/main.png" },
    { id: 4, name: "Storage", image: "/image/main.png" },
  ],
  housekeeping: [
    { id: 1, name: "Regular Cleaning", image: "/image/main.png" },
    { id: 2, name: "Deep Cleaning", image: "/image/main.png" },
    { id: 3, name: "Window Cleaning", image: "/image/main.png" },
    { id: 4, name: "Carpet Cleaning", image: "/image/main.png" },
  ],
  childcare: [
    { id: 1, name: "Babysitting", image: "/image/main.png" },
    { id: 2, name: "After School Care", image: "/image/main.png" },
    { id: 3, name: "Tutoring", image: "/image/main.png" },
    { id: 4, name: "Nanny Services", image: "/image/main.png" },
  ],
  pets: [
    { id: 1, name: "Dog Walking", image: "/image/main.png" },
    { id: 2, name: "Pet Sitting", image: "/image/main.png" },
    { id: 3, name: "Pet Grooming", image: "/image/main.png" },
    { id: 4, name: "Vet Visits", image: "/image/main.png" },
  ],
  it: [
    { id: 1, name: "Computer Repair", image: "/image/main.png" },
    { id: 2, name: "Network Setup", image: "/image/main.png" },
    { id: 3, name: "Software Installation", image: "/image/main.png" },
    { id: 4, name: "Tech Support", image: "/image/main.png" },
  ],
  homecare: [
    { id: 1, name: "Elder Care", image: "/image/main.png" },
    { id: 2, name: "Nursing", image: "/image/main.png" },
    { id: 3, name: "Companionship", image: "/image/main.png" },
    { id: 4, name: "Medical Assistance", image: "/image/main.png" },
  ],
};

// Helper to match BookServiceModal category icon behavior
const cloneElementWithColor = (
  element: React.ReactElement,
  isSelected: boolean
): React.ReactElement => {
  const primaryNormal = "#2C6587";

  if (!isSelected) {
    return element;
  }

  const cloneWithFill = (child: any, index?: number): any => {
    if (!child || typeof child !== "object") return child;

    if (Array.isArray(child)) {
      return child.map((item, idx) => cloneWithFill(item, idx));
    }

    const newProps: any = { ...child.props };

    if (index !== undefined && !newProps.key) {
      newProps.key = `cloned-${index}`;
    } else if (child.key) {
      newProps.key = child.key;
    }

    if (
      newProps.fill &&
      newProps.fill !== "none" &&
      newProps.fill !== "white" &&
      newProps.fill !== "#FFFFFF" &&
      newProps.fill !== "#ffffff"
    ) {
      newProps.fill = primaryNormal;
    }

    if (child.props && child.props.children) {
      if (Array.isArray(child.props.children)) {
        newProps.children = child.props.children.map((c: any, idx: number) =>
          React.isValidElement(c) ? cloneWithFill(c, idx) : c
        );
      } else if (React.isValidElement(child.props.children)) {
        newProps.children = cloneWithFill(child.props.children);
      } else if (child.props.children) {
        newProps.children = React.Children.map(
          child.props.children,
          (c: any, idx: number) =>
            React.isValidElement(c) ? cloneWithFill(c, idx) : c
        );
      }
    }

    return React.cloneElement(child, newProps);
  };

  return cloneWithFill(element) as React.ReactElement;
};

const CategoryIcon = ({
  category,
  isSelected,
}: {
  category: string;
  isSelected: boolean;
}) => {
  const icons: { [key: string]: React.ReactElement } = {
    diy: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_5440_3544)">
          <path
            d="M15.333 18.4911C15.0584 18.2165 14.6132 18.2165 14.3386 18.4911C14.064 18.7657 14.064 19.2109 14.3386 19.4855L14.8358 19.9827L12.0184 22.8C11.7439 23.0746 11.7439 23.5198 12.0184 23.7944C12.293 24.069 12.7382 24.069 13.0128 23.7944L15.8302 20.977L16.3274 21.4742C16.602 21.7488 17.0471 21.7488 17.3217 21.4742C17.5963 21.1996 17.5963 20.7545 17.3217 20.4799L15.333 18.4911Z"
            fill="#2C6587"
          />
          <path
            d="M23.7942 20.4798L21.8054 18.4911C21.5308 18.2165 21.0856 18.2165 20.811 18.4911C20.5364 18.7657 20.5364 19.2109 20.811 19.4855L21.3082 19.9826L18.4909 22.8C18.2163 23.0746 18.2163 23.5198 18.4909 23.7944C18.7655 24.0689 19.2106 24.0689 19.4852 23.7944L22.3026 20.977L22.7998 21.4742C23.0744 21.7488 23.5196 21.7488 23.7942 21.4742C24.0687 21.1996 24.0687 20.7544 23.7942 20.4798Z"
            fill="#2C6587"
          />
          <path
            d="M11.8541 6.86529L14.8373 9.84837C15.1119 10.123 15.557 10.123 15.8316 9.84837L19.8091 5.87088C20.0837 5.59629 20.0837 5.15112 19.8091 4.87652L16.826 1.89345C16.5514 1.61885 16.1062 1.61885 15.8316 1.89345L11.8541 5.87093C11.5795 6.14548 11.5795 6.59069 11.8541 6.86529Z"
            fill="#2C6587"
          />
          <path
            d="M11.1912 4.54463L14.4638 1.27209C12.7601 -0.0190309 10.4921 -0.364734 8.45645 0.407438C7.9794 0.588375 7.84782 1.20127 8.20862 1.56202L11.1912 4.54463Z"
            fill="#2C6587"
          />
          <path
            d="M21.3006 13.3282L23.2893 11.3395C24.1118 10.5171 24.1118 9.17882 23.2893 8.35635L22.9579 8.0249C22.6833 7.7503 22.2381 7.7503 21.9635 8.0249L21.6321 8.35635L20.472 7.19629L17.1575 10.5109L18.3175 11.6709L17.9861 12.0023C17.7115 12.2769 17.7115 12.7221 17.9861 12.9967L18.3175 13.3281C19.14 14.1507 20.4781 14.1506 21.3006 13.3282Z"
            fill="#2C6587"
          />
          <path
            d="M10.1948 9.18555L11.189 8.19133L13.5089 10.5112L12.5147 11.5054L10.1948 9.18555Z"
            fill="#2C6587"
          />
          <path
            d="M0.480516 18.9017C-0.160172 19.5424 -0.160172 20.5812 0.480516 21.2219C1.1212 21.8626 2.16 21.8626 2.80069 21.2219L11.5228 12.4999L9.20259 10.1797L0.480516 18.9017Z"
            fill="#2C6587"
          />
        </g>
        <defs>
          <clipPath id="clip0_5440_3544">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    gardening: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_5440_3561)">
          <path
            d="M9.18872 0C8.80041 0 8.4856 0.314812 8.4856 0.703125V9.65625C8.4856 9.78548 8.38046 9.89062 8.25122 9.89062H6.37622V0.703125C6.37622 0.314812 6.06141 0 5.6731 0C5.28478 0 4.96997 0.314812 4.96997 0.703125V9.89062H3.09497C2.96574 9.89062 2.8606 9.78548 2.8606 9.65625V0.703125C2.8606 0.314812 2.54578 0 2.15747 0C1.76916 0 1.45435 0.314812 1.45435 0.703125V9.65625C1.45435 10.5609 2.19033 11.2969 3.09497 11.2969H4.96997V12.75H4.26685C3.87853 12.75 3.56372 13.0648 3.56372 13.4531V20.271C3.54853 20.3368 2.76089 21.5149 3.588 22.8432C4.54744 24.3841 6.79317 24.3872 7.75425 22.8425C8.56575 21.5381 7.7887 20.3179 7.77778 20.2708V13.4531C7.77778 13.0648 7.46297 12.75 7.07466 12.75H6.37627V11.2969H8.25127C9.15591 11.2969 9.89189 10.5609 9.89189 9.65625V0.703125C9.89185 0.314812 9.57703 0 9.18872 0Z"
            fill="#C1C1C1"
          />
          <path
            d="M18.0186 0.122819C17.7798 -0.0405403 17.4654 -0.0409622 17.2262 0.121694C14.3948 2.0468 12.7043 5.24026 12.7043 8.66424V12.4746C12.7043 13.3793 13.4403 14.1152 14.345 14.1152H16.9231V9.18901C16.9231 8.80069 17.2379 8.48588 17.6262 8.48588C18.0145 8.48588 18.3293 8.80069 18.3293 9.18901V14.1153H20.9051C21.8097 14.1153 22.5457 13.3793 22.5457 12.4747V8.66902C22.5457 5.24185 20.8528 2.04671 18.0186 0.122819Z"
            fill="#C1C1C1"
          />
          <path
            d="M16.9232 15.5625H16.2177C15.8293 15.5625 15.5145 15.8773 15.5145 16.2656V20.2744C15.4993 20.3408 14.7136 21.5179 15.5405 22.8447C16.5017 24.3868 18.7461 24.3841 19.7048 22.8426C20.5144 21.5408 19.739 20.3184 19.7286 20.2736V16.2656C19.7286 15.8773 19.4138 15.5625 19.0255 15.5625H18.3294V14.1152H16.9232V15.5625Z"
            fill="#C1C1C1"
          />
        </g>
        <defs>
          <clipPath id="clip0_5440_3561">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    moving: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_5440_3574)">
          <path
            d="M10.5938 9.89062H13.4062C13.7943 9.89062 14.1094 9.5755 14.1094 9.1875C14.1094 8.7995 13.7943 8.48438 13.4062 8.48438H10.5938C10.2057 8.48438 9.89062 8.7995 9.89062 9.1875C9.89062 9.5755 10.2057 9.89062 10.5938 9.89062Z"
            fill="#C1C1C1"
          />
          <path
            d="M23.6732 4.26562L21.0695 0.31311C20.9389 0.117371 20.7194 0 20.4844 0H3.56256C3.32764 0 3.10809 0.117371 2.97754 0.31311L0.326904 4.26562H23.6732Z"
            fill="#C1C1C1"
          />
          <path
            d="M0.703125 24H23.2969C23.6854 24 24 23.6854 24 23.2969V5.67188H0V23.2969C0 23.6854 0.314575 24 0.703125 24ZM10.5938 7.07812H13.4062C14.5693 7.07812 15.5156 8.02441 15.5156 9.1875C15.5156 10.3506 14.5693 11.2969 13.4062 11.2969H10.5938C9.43066 11.2969 8.48438 10.3506 8.48438 9.1875C8.48438 8.02441 9.43066 7.07812 10.5938 7.07812ZM8.27838 16.7628C8.00372 17.0374 7.55878 17.0374 7.28412 16.7628C7.00946 16.4881 7.00946 16.0432 7.28412 15.7685L8.69037 14.3622C8.96503 14.0876 9.40997 14.0876 9.68463 14.3622L11.0909 15.7685C11.3655 16.0432 11.3655 16.4881 11.0909 16.7628C10.8162 17.0374 10.3713 17.0374 10.0966 16.7628L9.89062 16.5568V19.7812H14.1094V16.5568L13.9034 16.7628C13.6287 17.0374 13.1838 17.0374 12.9091 16.7628C12.6345 16.4881 12.6345 16.0432 12.9091 15.7685L14.3154 14.3622C14.59 14.0876 15.035 14.0876 15.3096 14.3622L16.7159 15.7685C16.9905 16.0432 16.9905 16.4881 16.7159 16.7628C16.4412 17.0374 15.9963 17.0374 15.7216 16.7628L15.5156 16.5568V19.7812H16.2188C16.6073 19.7812 16.9219 20.0958 16.9219 20.4844C16.9219 20.8729 16.6073 21.1875 16.2188 21.1875H7.78125C7.3927 21.1875 7.07812 20.8729 7.07812 20.4844C7.07812 20.0958 7.3927 19.7812 7.78125 19.7812H8.48438V16.5568L8.27838 16.7628Z"
            fill="#C1C1C1"
          />
        </g>
        <defs>
          <clipPath id="clip0_5440_3574">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
  };

  const icon = icons[category] || icons.diy;
  return cloneElementWithColor(icon, isSelected);
};

// Yup validation schemas for each step
const enterContactSchema = Yup.object().shape({
  emailOrMobile: Yup.string()
    .required("Email or Mobile Number is required")
    .test(
      "is-valid-email-or-mobile",
      "Please enter a valid email or mobile number",
      (value) => {
        if (!value) return false;
        return isValidEmailOrMobile(value);
      }
    ),
});

const verifyOtpSchema = Yup.object().shape({
  otp: Yup.array()
    .of(Yup.string())
    .length(4, "Please enter valid code")
    .test("all-filled", "Please enter valid code", (values) => {
      return values?.every((val) => val && val.length === 1) || false;
    }),
});

const createPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
    .test(
      "password-requirements",
      "Your password must be 8 characters long and include a capital letter, a small letter, and a number.",
      (value) => {
        if (!value) return false;
        if (value.length < 8) return false;
        if (!/[A-Z]/.test(value)) return false;
        if (!/[a-z]/.test(value)) return false;
        if (!/[0-9]/.test(value)) return false;
        return true;
      }
    ),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Please make sure your passwords match"),
});

const addDetailsSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters long"),
  mobileNo: Yup.string()
    .required("Mobile number is required")
    .test("is-valid-phone", "Please enter a valid phone number", (value) => {
      if (!value) return false;
      const cleaned = value.replace(/\s/g, "");
      return cleaned.length >= 10;
    }),
  email: Yup.string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  address: Yup.string().required("Address is required"),
});

export default function ProfessionalSignupPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();


  // "select-plan"
  // | "review-plan"
  // | "payment-mode"
  // | "additional-details"
  // | "select-category"
  // | "bank-details";
  const [step, setStep] = useState<SignupStep>("enter-contact");
  const [formData, setFormData] = useState({
    emailOrMobile: "",
    otp: ["", "", "", ""],
    password: "",
    confirmPassword: "",
    name: "",
    mobileNo: "",
    phoneCountryCode: "",
    email: "",
    address: "",
    profilePicture: null as File | null,
    profilePicturePreview: "",
  });
  const [phoneError, setPhoneError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState<string | null>(null);
  const [reviewPlan, setReviewPlan] = useState<Plan | null>(null);
  const [reviewPlanLoading, setReviewPlanLoading] = useState(false);
  const [reviewPlanError, setReviewPlanError] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentModePlan, setPaymentModePlan] = useState<Plan | null>(null);
  const [additionalDetails, setAdditionalDetails] = useState({
    experience: "",
    idCopy: null as File | null,
    kbisExtract: null as File | null,
    proofOfResidence: null as File | null,
  });
  const [filePreviews, setFilePreviews] = useState<{
    idCopy: string | null;
    kbisExtract: string | null;
    proofOfResidence: string | null;
  }>({
    idCopy: null,
    kbisExtract: null,
    proofOfResidence: null,
  });
  const [fileTypes, setFileTypes] = useState<{
    idCopy: 'image' | 'pdf' | null;
    kbisExtract: 'image' | 'pdf' | null;
    proofOfResidence: 'image' | 'pdf' | null;
  }>({
    idCopy: null,
    kbisExtract: null,
    proofOfResidence: null,
  });
  const [additionalDetailsError, setAdditionalDetailsError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [subcategories, setSubcategories] = useState<Array<{
    id: string;
    subcategory_name: string;
    image: string | null;
  }>>([]);
  const [subcategoriesLoading, setSubcategoriesLoading] = useState(false);
  const [selectedServices, setSelectedServices] = useState<Record<string, string[]>>({});
  const [subcategoriesByCategory, setSubcategoriesByCategory] = useState<Record<string, Array<{
    id: string;
    subcategory_name: string;
    image: string | null;
  }>>>({});
  const [bankDetails, setBankDetails] = useState({
    accountHolderName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    bankName: "",
  });
  const [bankDetailsErrors, setBankDetailsErrors] = useState<Record<string, string>>({});
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [pendingCategorySelection, setPendingCategorySelection] = useState<{categoryId: string; serviceId: string} | null>(null);
  const [providerId, setProviderId] = useState<string | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);

  const paymentMethods = [
    {
      id: "google-pay",
      name: "Google Pay",
    },
    {
      id: "apple-pay",
      name: "Apple Pay",
    },
    {
      id: "credit-card",
      name: "Credit Card",
    },
  ];

  // Start countdown timer when OTP step is reached
  useEffect(() => {
    if (step === "verify-otp") {
      setOtpCountdown(60);
    }
  }, [step]);

  // Auto-populate email and mobile from emailOrMobile when reaching add-details step
  useEffect(() => {
    if (step === "add-details" && formData.emailOrMobile) {
      try {
        const validData = buildInputData(formData.emailOrMobile);
        setFormData((prev) => {
          const updates: any = {};
          
          if (validData.email && !prev.email) {
            updates.email = validData.email;
          }
          
          if (validData.mobile && validData.phone_country_code && !prev.mobileNo) {
            updates.mobileNo = `${validData.phone_country_code}${validData.mobile}`;
            updates.phoneCountryCode = validData.phone_country_code;
          }
          
          if (Object.keys(updates).length > 0) {
            return { ...prev, ...updates };
          }
          
          return prev;
        });
      } catch (error) {
        console.log("Could not auto-populate from emailOrMobile:", error);
      }
    }
  }, [step]);

  // Countdown timer effect
  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => {
        setOtpCountdown(otpCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCountdown]);

  // Fetch plans when select-plan step is reached
  useEffect(() => {
    if (step === "select-plan") {
      const fetchPlans = async () => {
        try {
          setPlanLoading(true);
          setPlanError(null);
          const response = await apiGet<PlansResponse>(API_ENDPOINTS.AUTH.PLANS_ALL);

          if (!response.success) {
            setPlanError(response.error?.message || "Failed to fetch plans");
            return;
          }

          if (response.data) {
            // Combine professional and non_professional plans with type field
            const professionalPlans = (response.data.data.professional || []).map(plan => ({
              ...plan,
              type: "professional"
            }));
            const nonProfessionalPlans = (response.data.data.non_professional || []).map(plan => ({
              ...plan,
              type: "non_professional"
            }));
            const allPlans = [...professionalPlans, ...nonProfessionalPlans];
            setPlans(allPlans);
            
            // Set first plan as default selected
            if (allPlans.length > 0) {
              setSelectedPlan(allPlans[0].id);
            }
          } else {
            setPlanError(response.error?.message || "Failed to fetch plans");
          }
        } catch (err: any) {
          console.error("Error fetching plans:", err);
          setPlanError(err.message || "Something went wrong");
        } finally {
          setPlanLoading(false);
        }
      };

      fetchPlans();
    }
  }, [step]);

  // Fetch plan details when review-plan step is reached
  useEffect(() => {
    if (step === "review-plan") {
      const loadReviewPlan = async () => {
        try {
          setReviewPlanLoading(true);
          setReviewPlanError(null);

          // Get the selected plan from sessionStorage or from state
          const planDetailsStr = sessionStorage.getItem("selected_plan_details");
          if (planDetailsStr) {
            const parsedPlan = JSON.parse(planDetailsStr);
            setReviewPlan(parsedPlan);
          } else if (selectedPlan) {
            // Fallback: find plan from plans array
            const plan = plans.find(p => p.id === selectedPlan);
            if (plan) {
              setReviewPlan(plan);
            } else {
              setReviewPlanError("No plan selected. Please go back and select a plan.");
            }
          } else {
            setReviewPlanError("No plan selected. Please go back and select a plan.");
          }
        } catch (err: any) {
          console.error("Error loading plan:", err);
          setReviewPlanError(err.message || "Something went wrong");
        } finally {
          setReviewPlanLoading(false);
        }
      };

      loadReviewPlan();
    }
  }, [step, selectedPlan, plans]);

  // Fetch categories from API (similar to BookServiceModal)
  const fetchCategories = useCallback(async () => {
    setCategoryLoading(true);
    setCategoryError(null);
    try {
      const response = await apiGet<{
        message: string;
        data: Array<{
          id: string;
          category_name: string;
          category_logo: string;
        }>;
        success: boolean;
        status_code: number;
      }>(API_ENDPOINTS.HOME.ALL_CATEGORIES);

      if (response.success && response.data?.data) {
        setCategories(response.data.data);
      } else {
        setCategoryError(response.error?.message || "Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategoryError("Something went wrong");
    } finally {
      setCategoryLoading(false);
    }
  }, []);

  // Fetch subcategories for selected category (similar to BookServiceModal)
  const fetchSubcategories = useCallback(async (catId: string) => {
    setSubcategoriesLoading(true);
    try {
      const endpoint = `${API_ENDPOINTS.HOME.HOME}/${catId}`;
      const response = await apiGet<{
        message: string;
        data: {
          Banner: {
            url: string | null;
            category_name: string;
            file_name: string | null;
            file_type: string | null;
          };
          subcategories: Array<{
            id: string;
            subcategory_name: string;
            image: string | null;
          }>;
        };
        success: boolean;
        status_code: number;
      }>(endpoint);

      if (response.success && response.data?.data) {
        const fetchedSubcategories = response.data.data.subcategories || [];
        setSubcategories(fetchedSubcategories);
        // Store subcategories by category ID for later retrieval
        setSubcategoriesByCategory((prev) => ({
          ...prev,
          [catId]: fetchedSubcategories,
        }));
      } else {
        setSubcategories([]);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubcategories([]);
    } finally {
      setSubcategoriesLoading(false);
    }
  }, []);

  // Fetch categories when select-category step is reached
  useEffect(() => {
    if (step === "select-category") {
      fetchCategories();
    }
  }, [step, fetchCategories]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // Don't clear selected services when category changes - keep them for other categories
    setSubcategories([]); // Clear subcategories for the new selection
    // Fetch subcategories for the selected category
    if (categoryId) {
      fetchSubcategories(categoryId);
    }
  };

  const handleServiceToggle = (serviceId: string) => {
    if (!selectedCategory) return;

    // Check if this is adding a service (not removing)
    const currentServices = selectedServices[selectedCategory] || [];
    const isAdding = !currentServices.includes(serviceId);

    if (isAdding) {
      // Check if user already has services in another category
      const existingCategories = Object.keys(selectedServices).filter(
        (cat) => cat !== selectedCategory && selectedServices[cat] && selectedServices[cat].length > 0
      );

      // If user has services in another category, check if plan is non-professional
      if (existingCategories.length > 0) {
        // Get plan from sessionStorage or state
        let planType: string | null = null;
        if (typeof window !== "undefined") {
          const planDetailsStr = sessionStorage.getItem("selected_plan_details");
          if (planDetailsStr) {
            try {
              const plan = JSON.parse(planDetailsStr);
              planType = plan.type;
            } catch (e) {
              console.error("Error parsing plan details:", e);
            }
          }
        }

        // If plan is non-professional, show modal
        if (planType === "non_professional") {
          setPendingCategorySelection({ categoryId: selectedCategory, serviceId });
          setShowAddCategoryModal(true);
          return;
        }
      }
    }

    // Proceed with normal toggle
    setSelectedServices((prev) => {
      const current = prev[selectedCategory] || [];
      const exists = current.includes(serviceId);
      const updatedForCategory = exists
        ? current.filter((id) => id !== serviceId)
        : [...current, serviceId];

      return {
        ...prev,
        [selectedCategory]: updatedForCategory,
      };
    });
  };

  const handleRemoveService = (category: string, serviceId: string) => {
    setSelectedServices((prev) => {
      const current = prev[category] || [];
      const updatedForCategory = current.filter((id) => id !== serviceId);
      return {
        ...prev,
        [category]: updatedForCategory,
      };
    });
  };

  // Load plan when payment-mode step is reached
  useEffect(() => {
    if (step === "payment-mode") {
      if (typeof window !== "undefined") {
        const planDetailsStr = sessionStorage.getItem("selected_plan_details");
        if (planDetailsStr) {
          try {
            const parsedPlan = JSON.parse(planDetailsStr);
            setPaymentModePlan(parsedPlan);
          } catch (error) {
            console.error("Error parsing plan details:", error);
          }
        } else if (reviewPlan) {
          setPaymentModePlan(reviewPlan);
        }
      }
    }
  }, [step, reviewPlan]);

  // Helper function to validate and handle file upload
  const handleFileUpload = (
    file: File,
    fieldName: 'idCopy' | 'kbisExtract' | 'proofOfResidence'
  ) => {
    // Check if file is video
    if (file.type.startsWith('video/')) {
      toast.error('Videos are not allowed. Please upload an image or PDF file.');
      return;
    }

    // Check if file is image or PDF
    const isImage = file.type.startsWith('image/');
    const isPDF = file.type === 'application/pdf';

    if (!isImage && !isPDF) {
      toast.error('Only image and PDF files are allowed.');
      return;
    }

    // Set file
    setAdditionalDetails(prev => ({ ...prev, [fieldName]: file }));

    // Set file type
    setFileTypes(prev => ({
      ...prev,
      [fieldName]: isImage ? 'image' : 'pdf'
    }));

    // Create preview for images
    if (isImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreviews(prev => ({
          ...prev,
          [fieldName]: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    } else {
      // For PDF, clear preview
      setFilePreviews(prev => ({
        ...prev,
        [fieldName]: null
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...formData.otp];
    newOtp[index] = value;
    setFormData((prev) => ({ ...prev, otp: newOtp }));

    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (e.key === "Backspace" && !formData.otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleContinue = async () => {
    setLoading(true);
    if (step === "enter-contact") {
      let { data, error } = await apiCallToSignUpUser("");
      const responseData: any = data?.data || data;
      const nestedData = responseData?.data || responseData;

      if (nestedData && nestedData.is_otp_verified === true) {
        setStep("create-password");
        setLoading(false);
        return;
      }

      if (nestedData && nestedData.is_password_set === true) {
        setStep("add-details");
        setLoading(false);
        return;
      }

      if (data && !error) {
        setStep("verify-otp");
      } else if (error) {
        console.log("error", {error});
        const errorMsg =
          error.submit ||
          error.otp ||
          error.password ||
          error.general ||
          error.msg ||
          "Something Went Wrong";
        if (errorMsg.includes("OTP already sent")) {
          setStep("verify-otp");
        } else if (
          errorMsg.includes("OTP already verified. Redirect to Password page.")
        ) {
          setStep("create-password");
        } else if (errorMsg.includes("Email already registered")) {
          toast.error(errorMsg);
        } else if (errorMsg.includes("Password already set")) {
          setStep("add-details");
        } else {
          toast.error(errorMsg);
        }
      }
      setLoading(false);
    } else if (step === "verify-otp") {
      let { data, error } = await apiCallToSignUpUser("");

      const responseData: any = data?.data || data;
      const nestedData = responseData?.data || responseData;

      if (nestedData && nestedData.is_otp_verified === true) {
        setStep("create-password");
        setLoading(false);
        return;
      }

      if (nestedData && nestedData.is_password_set === true) {
        setStep("add-details");
        setLoading(false);
        return;
      }

      if (data && !error) {
        if (data?.status === "success") {
          const successMsg = data?.message;
          toast.success(successMsg);
        }
        setStep("create-password");
      } else if (error) {
        const errorMsg =
          error.message ||
          error.submit ||
          error.otp ||
          error.password ||
          error.general ||
          error.msg ||
          "Something Went Wrong";
        if (errorMsg.includes("OTP already sent")) {
          setStep("verify-otp");
        } else if (errorMsg.includes("OTP already verified")) {
          setStep("create-password");
        } else if (errorMsg.includes("Password already set")) {
          setStep("add-details");
        } else {
          toast.error(errorMsg);
        }
      }
      setLoading(false);
    } else if (step === "create-password") {
      let { data, error } = await apiCallToSignUpUser("");

      const responseData: any = data?.data || data;
      const nestedData = responseData?.data || responseData;

      if (nestedData && nestedData.is_password_set === true) {
        setStep("add-details");
        setLoading(false);
        return;
      }

      if (data && !error) {
        setStep("add-details");
      } else if (error) {
        const errorMsg =
          error.submit ||
          error.otp ||
          error.password ||
          error.general ||
          error.msg ||
          "Something Went Wrong";
        if (errorMsg.includes("OTP already sent")) {
          setStep("verify-otp");
        } else if (errorMsg.includes("OTP already verified")) {
          setStep("create-password");
        } else if (errorMsg.includes("Password already set")) {
          setStep("add-details");
        } else {
          toast.error(errorMsg);
        }
      }
      setLoading(false);
    } else if (step === "select-plan") {
      if (!selectedPlan) {
        toast.error("Please select a plan");
        return;
      }
      
      const plan = plans.find(p => p.id === selectedPlan);
      if (plan) {
        sessionStorage.setItem("selected_plan", selectedPlan);
        sessionStorage.setItem("selected_plan_details", JSON.stringify(plan));
        // Move to review-plan step
        setStep("review-plan");
      }
      setLoading(false);
    } else if (step === "review-plan") {
      // Call select-plan API before moving to payment-mode
      if (!providerId) {
        toast.error("Provider ID not found. Please try again.");
        setLoading(false);
        return;
      }
      
      if (!reviewPlan || !reviewPlan.id) {
        toast.error("Plan not selected. Please go back and select a plan.");
        setLoading(false);
        return;
      }
      
      if (!reviewPlan.type) {
        toast.error("Plan type not found. Please go back and select a plan.");
        setLoading(false);
        return;
      }
      
      try {
        const payload = {
          provider_id: providerId,
          plan_id: reviewPlan.id,
          provider_type: reviewPlan.type
        };
        
        const response = await apiPost(API_ENDPOINTS.AUTH.SELECT_PLAN, payload);
        
        if (response.success && response.data) {
          // Store subscription data from API response
          // response.data is the entire API response, which contains status, message, and data
          const apiResponse = response.data as any;
          setSubscriptionData(apiResponse.data || null);
          
          // Show success message from API response
          const successMessage = apiResponse.message || "Plan selected successfully";
          toast.success(successMessage);
          
          // Move to payment-mode step
          setStep("payment-mode");
        } else {
          const errorMsg = response.error?.message || "Failed to select plan. Please try again.";
          toast.error(errorMsg);
        }
      } catch (error: any) {
        console.error("Select plan error:", error);
        toast.error(error.message || "Failed to select plan. Please try again.");
      } finally {
        setLoading(false);
      }
    } else if (step === "payment-mode") {
      // Validate payment method is selected
      if (!selectedPaymentMethod) {
        toast.error("Please select a payment method");
        setLoading(false);
        return;
      }
      
      // Show success modal with subscription details
      setShowSuccessModal(true);
      setLoading(false);
    } else if (step === "additional-details") {
      setLoading(true);
      setAdditionalDetailsError(null);

      try {
        // Validate experience with Yup
        const experienceSchema = Yup.string()
          .matches(/^\d+$/, "Experience must be a valid number")
          .test('min-value', 'Experience must be 0 or greater', (value) => {
            if (!value) return true; // Optional field
            const num = parseInt(value, 10);
            return !isNaN(num) && num >= 0;
          });

        // If experience is provided, validate and call the API
        if (additionalDetails.experience) {
          try {
            await experienceSchema.validate(additionalDetails.experience);
            const experienceValue = parseInt(additionalDetails.experience, 10);
            
            const response = await apiPatch(API_ENDPOINTS.AUTH.EXPERIENCE, {
              years_of_experience: experienceValue,
            });

            if (!response.success) {
              setAdditionalDetailsError(response.error?.message || "Failed to save experience");
              setLoading(false);
              return;
            }
          } catch (error: any) {
            setAdditionalDetailsError(error.message || "Please enter a valid number of years");
            setLoading(false);
            return;
          }
        }

        // Save additional details (for file uploads, if needed later)
        if (typeof window !== "undefined") {
          sessionStorage.setItem("additional_details", JSON.stringify({
            ...additionalDetails,
            // Don't store File objects in sessionStorage, just metadata
            idCopy: additionalDetails.idCopy ? { name: additionalDetails.idCopy.name, size: additionalDetails.idCopy.size } : null,
            kbisExtract: additionalDetails.kbisExtract ? { name: additionalDetails.kbisExtract.name, size: additionalDetails.kbisExtract.size } : null,
            proofOfResidence: additionalDetails.proofOfResidence ? { name: additionalDetails.proofOfResidence.name, size: additionalDetails.proofOfResidence.size } : null,
          }));
        }

        // Move to select-category step
        setStep("select-category");
      } catch (err: any) {
        console.error("Error saving experience:", err);
        setAdditionalDetailsError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    } else if (step === "select-category") {
      const selectedCategoryKeys = Object.keys(selectedServices).filter(
        (key) => selectedServices[key] && selectedServices[key].length > 0
      );

      if (selectedCategoryKeys.length === 0) {
        toast.error("Please select at least one service");
        return;
      }

      setLoading(true);
      try {
        // Transform selectedServices into the API format
        const servicesPayload = selectedCategoryKeys.map((categoryId) => ({
          category_id: categoryId,
          sub_category_ids: selectedServices[categoryId] || [],
        }));

        const payload = {
          services: servicesPayload,
        };

        const response = await apiPost(API_ENDPOINTS.AUTH.SAVE_SERVICES, payload);

        if (response.success) {
          toast.success("Services saved successfully");
          
          // Store new multi-category structure
          if (typeof window !== "undefined") {
            sessionStorage.setItem(
              "selected_categories",
              JSON.stringify(selectedCategoryKeys)
            );
            sessionStorage.setItem(
              "selected_services_by_category",
              JSON.stringify(selectedServices)
            );

            // Backwards-compatible single category storage (first category)
            const primaryCategory = selectedCategoryKeys[0];
            const primaryServices = primaryCategory
              ? selectedServices[primaryCategory] || []
              : [];
            sessionStorage.setItem("selected_category", primaryCategory || "");
            sessionStorage.setItem(
              "selected_services",
              JSON.stringify(primaryServices)
            );
          }

          // Move to bank-details step
          setStep("bank-details");
        } else {
          const errorMsg = response.error?.message || "Failed to save services. Please try again.";
          toast.error(errorMsg);
        }
      } catch (error: any) {
        console.error("Error saving services:", error);
        toast.error(error.message || "Failed to save services. Please try again.");
      } finally {
        setLoading(false);
      }
    } else if (step === "bank-details") {
      // This is handled by handleBankDetailsSubmit
    }
  };

  const handleBankDetailsSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    // Save bank details
    if (typeof window !== "undefined") {
      sessionStorage.setItem("bank_details", JSON.stringify(bankDetails));
    }
    
    // Show success modal for 2 seconds, then navigate
    setShowThankYouModal(true);
    setTimeout(() => {
      setShowThankYouModal(false);
      handleThankYouClose();
    }, 2000);
  };

  const handleBankDetailsSkip = () => {
    setShowThankYouModal(true);
  };

  const handleThankYouClose = () => {
    setShowThankYouModal(false);
    // Clear all onboarding data
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("selected_plan");
      sessionStorage.removeItem("selected_plan_details");
      sessionStorage.removeItem("additional_details");
      sessionStorage.removeItem("selected_categories");
      sessionStorage.removeItem("selected_services_by_category");
      sessionStorage.removeItem("selected_category");
      sessionStorage.removeItem("selected_services");
      sessionStorage.removeItem("bank_details");
    }
    
    // Navigate to professional dashboard
    router.push(ROUTES.PROFESSIONAL_HOME);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setStep("additional-details");
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      const { data, error } = await apiCallToSignUpUser("resendOTP");
      if (data && !error) {
        toast.success("OTP has been resent successfully");
        setOtpCountdown(60);
      } else if (error) {
        const errorMsg = error.message || error.msg || error.general || "Failed to resend OTP. Please try again.";
        toast.error(errorMsg);
      }
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const apiCallToSignUpUser = async (
    submit: string
  ): Promise<SignUpApiResponse> => {
    try {
      let payload = {};
      let url = "";
      let validData: any = {};

      if (!(step === "add-details" && submit === "submit") && formData.emailOrMobile) {
        try {
          validData = buildInputData(formData.emailOrMobile);
        } catch (error: any) {
          return {
            data: null,
            error: { general: error.message || "Invalid email or mobile input" },
          };
        }
      }

      if (step === "enter-contact") {
        url = API_ENDPOINTS.AUTH.START;

        if (validData.email) {
          payload = {
            email: validData.email || "",
            role: "service_provider",
          };
        } else {
          payload = {
            mobile: validData.mobile || "",
            phone_country_code: validData.phone_country_code || "",
            role: "service_provider",
          };
        }
      } else if (step === "verify-otp") {
        url = API_ENDPOINTS.AUTH.VERIFY_OTP;

        if (validData.email) {
          payload = {
            email: validData.email || "",
            otp: formData.otp.join(""),
          };
        } else {
          payload = {
            mobile: validData.mobile || "",
            phone_country_code: validData.phone_country_code || "",
            otp: formData.otp.join(""),
          };
        }
      } else if (step === "create-password") {
        url = API_ENDPOINTS.AUTH.CREATE_PASSWORD;

        if (validData.email) {
          payload = {
            email: validData.email || "",
            password: formData.password,
            confirm_password: formData.confirmPassword,
          };
        } else {
          payload = {
            mobile: validData.mobile || "",
            phone_country_code: validData.phone_country_code || "",
            password: formData.password,
            confirm_password: formData.confirmPassword,
          };
        }
      }

      if (submit == "submit") {
        url = API_ENDPOINTS.AUTH.CREATE_ACCOUNT;

        let phoneCountryCode = formData.phoneCountryCode;
        let mobile = formData.mobileNo;

        if (phoneCountryCode && mobile) {
          const countryCodeWithPlus = phoneCountryCode.startsWith("+")
            ? phoneCountryCode
            : `+${phoneCountryCode}`;
          if (mobile.startsWith(countryCodeWithPlus)) {
            mobile = mobile.substring(countryCodeWithPlus.length).trim();
          }
        }

        if (!phoneCountryCode && mobile) {
          const mobileData = parseMobile(mobile);
          if (mobileData) {
            phoneCountryCode = mobileData.countryCode;
            mobile = mobileData.mobile;
          }
        }

        payload = {
          email: formData.email || "",
          address: formData.address,
          name: formData.name,
          role: "service_provider",
          mobile: mobile || "",
          phone_country_code: phoneCountryCode || "",
        };
      }

      if (submit == "resendOTP") {
        url = API_ENDPOINTS.AUTH.RESEND_OTP;

        if (validData.email) {
          payload = {
            email: validData.email || "",
          };
        } else {
          payload = {
            mobile: validData.mobile || "",
            phone_country_code: validData.phone_country_code || "",
          };
        }
      }

      let response = await apiPost(url, payload);

      console.log({response},"this is the response");

      let responseData: any = response.data;
      const nestedData = responseData?.data;

      const isOtpVerified =
        nestedData?.is_otp_verified === true ||
        responseData?.is_otp_verified === true;
      const isPasswordSet =
        nestedData?.is_password_set === true ||
        responseData?.is_password_set === true;
      const hasRedirectFlags = isOtpVerified || isPasswordSet;

      if (hasRedirectFlags) {
        return {
          data: responseData,
          error: null,
        };
      }

      let errorObj: SignUpApiError | null = null;
      if (response?.error) {
        errorObj = {};
        if (step === "enter-contact") {
          errorObj = {
            submit: response.error.message || "Something went wrong.",
          };
        } else if (step === "verify-otp") {
          errorObj = { otp: response.error.message || "Something went wrong." };
        } else if (step === "create-password") {
          errorObj = {
            password: response.error.message || "Something went wrong.",
          };
        } else if (step === "add-details") {
          errorObj = {
            message: response.error.message || "Something went wrong.",
          };
        }

        if (
          responseData &&
          responseData.status === "error" &&
          !hasRedirectFlags
        ) {
          const errorMessage =
            responseData.message ||
            response.error.message ||
            "Something went wrong.";
          if (step === "enter-contact") {
            errorObj = { submit: errorMessage };
          } else if (step === "verify-otp") {
            errorObj = { otp: errorMessage };
          } else if (step === "create-password") {
            errorObj = { password: errorMessage };
          }
        }
        setErrors(errorObj);
      }

      return {
        data: responseData,
        error: errorObj,
      };
    } catch (error: any) {
      console.error("Signup error:", error);
      const errorObj: SignUpApiError = {
        general: error.message || "Something went wrong. Please try again.",
      };
      return {
        data: null,
        error: errorObj,
      };
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let { data, error } = await apiCallToSignUpUser("submit");
      
      if (data && data.status === "success" && data.data) {
        const responseData = data.data;
        
        const accessToken = responseData.access_token;
        const refreshToken = responseData.refresh_token;
        const accessTokenExpire = responseData.access_token_expire;
        const refreshTokenExpire = responseData.refresh_token_expire;
        const userData = responseData.user_data || {};
        
        // Store provider_id (user_id) for select-plan API call
        if (userData.user_id) {
          setProviderId(userData.user_id);
        }
        
        if (typeof window !== "undefined") {
          document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${7*24*60*60}`;
          localStorage.setItem("token", accessToken);
          localStorage.setItem("userEmail", userData.email || "");
          localStorage.setItem("userInitial", (userData.name?.charAt(0) || "U").toUpperCase());
          localStorage.setItem("role", userData.role || "");
        }
        
        const user = {
          email: userData.email || "",
          initial: (userData.name?.charAt(0) || "U").toUpperCase(),
          role: userData.role || "",
        };
        
        dispatch(setTokens({
          accessToken,
          refreshToken,
          accessTokenExpire,
          refreshTokenExpire,
          user,
        }));
        
        toast.success("Account created successfully");
        
        // Move to select-plan step instead of redirecting
        setStep("select-plan");
      } else if (data && data.status === "success") {
        toast.success("Account created successfully"); 
        setStep("select-plan");
      } else {
        if (error) {
          const errorMsg = error.general || error.msg || error.message || "Something Went Wrong";
          toast.error(errorMsg);
          if (errorMsg.includes("Name is required")) {
            setErrors({ name: errorMsg });
          } else if (errorMsg.includes("Address")) {
            setErrors({ address: errorMsg });
          } else if (
            errorMsg.includes("country code") ||
            errorMsg.includes("Mobile")
          ) {
            setErrors({ mobileNo: errorMsg });
          } else if (errorMsg.includes("email")) {
            setErrors({ email: errorMsg });
          } else {
            toast.error(errorMsg);
          }
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrors({ submit: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return `€${price.toFixed(2)}`;
  };

  const formatDuration = (duration: string) => {
    return duration.charAt(0).toUpperCase() + duration.slice(1);
  };

  const uploadProfileImage = async (file: File): Promise<void> => {
    setLoading(true);
    try {
      const url = API_ENDPOINTS.AUTH.UPLOAD_PROFILE_PIC;
      const validData = buildInputData(formData.emailOrMobile);
      
      const formDataPayload = new FormData();
      
      if (validData.email) {
        formDataPayload.append("email", validData.email || "");
      } else {
        formDataPayload.append("mobile", validData.mobile || "");
        formDataPayload.append("phone_country_code", validData.phone_country_code || "");
      }
      
      formDataPayload.append("file", file);

      const response: ProfilePhotoApi = await apiPostFormData(url, formDataPayload);
      if (response?.error?.message) {
        toast.error(response.error.message);
        return;
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error("Failed to upload profile picture. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case "enter-contact":
        return (
          <Formik
            initialValues={{ emailOrMobile: formData.emailOrMobile || "" }}
            validationSchema={enterContactSchema}
            onSubmit={async (values, { setFieldError }) => {
              setFormData((prev) => ({
                ...prev,
                emailOrMobile: values.emailOrMobile,
              }));
              await handleContinue();
            }}
            enableReinitialize
          >
            {({
              values,
              errors: formikErrors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <Form>
                <Typography
                  sx={{
                    fontWeight: `700`,
                    fontSize: { xs: `1.25rem`, sm: `1.375rem`, md: `1.5rem` },
                    color: `primary.normal`,
                    mb: { xs: "0.5rem", md: "0.75rem" },
                    lineHeight: { xs: "1.5rem", md: "1.75rem" },
                    textAlign: "center",
                  }}
                >
                  Welcome To CoudPouss!
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 400,
                    fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
                    textAlign: "center",
                    lineHeight: "140%",
                    mb: { xs: "2rem", md: "2.5rem" },
                    color: "secondary.neutralWhiteDark",
                  }}
                >
                  Empowering seniors with easy access to trusted help, care, and
                  companionship whenever needed.
                </Typography>

                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: { xs: "0.9375rem", md: "1.0625rem" },
                    lineHeight: "1.25rem",
                    color: "#424242",
                    mb: "0.5rem",
                  }}
                >
                  Email / Mobile No
                </Typography>
                <Field name="emailOrMobile">
                  {({ field, meta }: FieldProps) => (
                    <TextField
                      {...field}
                      sx={{
                        m: 0,
                        mb: 3,
                        "& .MuiFormHelperText-root": {
                          fontWeight: 400,
                          fontSize: "16px",
                          lineHeight: "140%",
                          letterSpacing: "0%",
                          color: "#EF5350",
                          marginTop: "12px !important",
                          marginLeft: "0 !important",
                          marginRight: "0 !important",
                          marginBottom: "0 !important",
                        },
                      }}
                      fullWidth
                      placeholder="Enter Email/ Mobile No"
                      onChange={(e) => {
                        handleChange(e);
                        setFormData((prev) => ({
                          ...prev,
                          emailOrMobile: e.target.value,
                        }));
                      }}
                      onBlur={handleBlur}
                      error={!!(meta.touched && meta.error)}
                      helperText={(meta.touched && meta.error) || ""}
                      margin="normal"
                      FormHelperTextProps={{
                        sx: {
                          marginTop: "12px",
                          marginLeft: 0,
                          marginRight: 0,
                          marginBottom: 0,
                        },
                      }}
                    />
                  )}
                </Field>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    bgcolor: "primary.dark",
                    color: "white",
                    py: { xs: 1.25, md: 1.5 },
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: { xs: "1rem", sm: "1.125rem", md: "1.1875rem" },
                    "&:hover": {
                      bgcolor: "#25608A",
                    },
                  }}
                >
                  Continue
                </Button>
              </Form>
            )}
          </Formik>
        );

      case "verify-otp":
        return (
          <Box  sx={{
            px: { xs: 0, md: 4 }
          }} >
            <Typography
              sx={{
                fontWeight: `700`,
                fontSize: { xs: `1.25rem`, sm: `1.375rem`, md: `1.5rem` },
                color: `primary.normal`,
                mb: { xs: "0.5rem", md: "0.75rem" },
                lineHeight: { xs: "1.5rem", md: "1.75rem" },
                textAlign: "center",
              }}
            >
              Welcome To CoudPouss!
            </Typography>
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
                textAlign: "center",
                lineHeight: "140%",
                mb: { xs: "2rem", md: "2.5rem" },
                color: "secondary.neutralWhiteDark",
              }}
            >
              Empowering seniors with easy access to trusted help, care, and
              companionship whenever needed.
            </Typography>

            <Typography
              sx={{
                fontWeight: 400,
                fontSize: { xs: "14px", sm: "15px", md: "16px" },
                textAlign: "center",
                lineHeight: "140%",
                mb: { xs: "1rem", md: "1.5rem" },
                color: "secondary.neutralWhiteDark",
              }}
            >
              To continue Please enter the 4 Digit OTP sent to your Email or
              Phone Number.
            </Typography>
            <Formik
              initialValues={{ otp: formData.otp || ["", "", "", ""] }}
              validationSchema={verifyOtpSchema}
              validateOnChange={false}
              validateOnBlur={false}
              onSubmit={async (values) => {
                setFormData((prev) => ({ ...prev, otp: values.otp }));
                await handleContinue();
              }}
              enableReinitialize
            >
              {({
                values,
                errors: formikErrors,
                touched,
                setFieldValue,
                handleSubmit,
                submitCount,
              }) => {
                const handleOtpChangeFormik = (
                  index: number,
                  value: string
                ) => {
                  // Only allow numeric digits (0-9)
                  const numericValue = value.replace(/[^0-9]/g, "");
                  if (numericValue.length > 1) return;
                  const newOtp = [...values.otp];
                  newOtp[index] = numericValue;
                  setFieldValue("otp", newOtp);
                  setFormData((prev) => ({ ...prev, otp: newOtp }));

                  // Auto-focus next input
                  if (numericValue && index < 3) {
                    const nextInput = document.getElementById(
                      `otp-${index + 1}`
                    );
                    nextInput?.focus();
                  }
                };

                const handleOtpKeyDownFormik = (
                  index: number,
                  e: React.KeyboardEvent<HTMLDivElement>
                ) => {
                  if (
                    e.key === "Backspace" &&
                    !values.otp[index] &&
                    index > 0
                  ) {
                    const prevInput = document.getElementById(
                      `otp-${index - 1}`
                    );
                    prevInput?.focus();
                  }
                };

                return (
                  <Form  >
                    <Typography
                      sx={{
                        fontSize: { xs: "16px", md: "18px" },
                        fontWeight: "500",
                        lineHeight: "100%",
                        color: "#555555",
                        margin: "0 auto",
                        mb: { xs: 1.5, md: 2 },
                        
                      }}
                    >
                      Code
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        gap: "20px",
                        justifyContent: "space-between",

                      margin: "0 auto",
                        mb: formikErrors.otp && submitCount > 0 ? 1 : 2,
                      }}
                    >
                      {values.otp.map((digit, index) => (
                        <TextField
                          key={index}
                          id={`otp-${index}`}
                          value={digit || ""}
                          error={!!(formikErrors.otp && submitCount > 0)}
                          onChange={(e) =>
                            handleOtpChangeFormik(index, e.target.value)
                          }
                          onKeyDown={(e) => handleOtpKeyDownFormik(index, e)}
                          inputProps={{
                            maxLength: 1,
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                            style: {
                              textAlign: "center",
                              fontSize: "1.25rem",
                              fontWeight: "bold",
                            },
                          }}
                          InputProps={{
                            sx: {
                              "& input": {
                                fontSize: { xs: "1.125rem", sm: "1.25rem", md: "1.5rem" },
                              },
                            },
                          }}
                          sx={{
                            borderColor: formikErrors.otp && submitCount > 0 ? "#EF5350" : "",
                            "& .MuiOutlinedInput-root": {
                              borderColor: formikErrors.otp && submitCount > 0 ? "#EF5350" : "",
                              width: "100%",
                              borderRadius: "12px",
                            },
                          }}
                        />
                      ))}
                    </Box>
                    {formikErrors.otp && submitCount > 0 && (
                      <Typography
                        sx={{
                          fontWeight: 400,
                          fontSize: "16px",
                          lineHeight: "140%",
                          letterSpacing: "0%",
                          color: "#EF5350",
                          mb: 2,
                          mt: "12px",
                          textAlign: "center",
                        }}
                      >
                        Please enter valid code
                      </Typography>
                    )}
                    {otpCountdown > 0 ? (
                      <Typography
                        sx={{
                          display: "block",
                          textAlign: "center",
                          mb: { xs: 2, md: 5 },
                          fontSize: { xs: "1.125rem", md: "1.25rem" },
                          lineHeight: "1.5rem",
                          fontWeight: 600,
                          color: "#2C6587",
                        }}
                      >
                        Resend code in {otpCountdown} seconds
                      </Typography>
                    ) : (
                      <Box sx={{ textAlign: "center", mb: { xs: 2, md: "2.5rem" } }}>
                        <Typography
                          onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                            e.preventDefault();
                            setOtpCountdown(60);
                            apiCallToSignUpUser("resendOTP");
                          }}
                          sx={{
                            cursor: "pointer",
                            display: "inline-block",
                            fontSize: { xs: "1.125rem", md: "1.25rem" },
                            lineHeight: "1.5rem",
                            fontWeight: 600,
                            color: "#2C6587",
                            textDecoration: "none",
                            "&:hover": {
                              textDecoration: "underline",
                            },
                          }}
                        >
                          Resend code
                        </Typography>
                      </Box>
                    )}
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={loading}
                      sx={{
                        bgcolor: "primary.dark",
                        color: "white",
                        py: { xs: 1.25, md: 1.5 },
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: { xs: "1rem", sm: "1.125rem", md: "1.1875rem" },
                        "&:hover": {
                          bgcolor: "#25608A",
                        },
                      }}
                    >
                      Verify OTP
                    </Button>
                  </Form>
                );
              }}
            </Formik>
          </Box>
        );

      case "create-password":
        return (
          <Box
          
          sx={{
            px: { xs: 0, md: 4 }
          }} 
          >
            <Typography
              sx={{
                fontWeight: `700`,
                fontSize: { xs: `1.25rem`, sm: `1.375rem`, md: `1.5rem` },
                color: `primary.normal`,
                mb: { xs: "0.5rem", md: "0.75rem" },
                lineHeight: { xs: "1.5rem", md: "1.75rem" },
                textAlign: "center",
              }}
            >
              CoudPouss
            </Typography>
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
                textAlign: "center",
                lineHeight: "140%",
                mb: { xs: "2rem", md: "2.5rem" },
                color: "secondary.neutralWhiteDark",
              }}
            >
              Empowering seniors with easy access to trusted help, care, and
              companionship whenever needed.
            </Typography>

            <Typography
              sx={{
                fontWeight: `700`,
                fontSize: { xs: `1.25rem`, sm: `1.375rem`, md: `1.5rem` },
                color: `primary.normal`,
                mb: { xs: "0.5rem", md: "0.75rem" },
                lineHeight: { xs: "1.5rem", md: "1.75rem" },
                textAlign: "center",
              }}
            >
              Create a strong password
            </Typography>
            <Formik
              initialValues={{
                password: formData.password || "",
                confirmPassword: formData.confirmPassword || "",
              }}
              validationSchema={createPasswordSchema}
              onSubmit={async (values) => {
                setFormData((prev) => ({
                  ...prev,
                  password: values.password,
                  confirmPassword: values.confirmPassword,
                }));
                await handleContinue();
              }}
              enableReinitialize
            >
              {({
                values,
                errors: formikErrors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
              }) => {
                return (
                  <Form>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        fontSize: { xs: "15px", md: "17px" },
                        lineHeight: "20px",
                        color: "#6D6D6D",
                        mb: "8px",
                      }}
                    >
                      Password
                    </Typography>
                    <Field name="password">
                      {({ field, meta }: FieldProps) => (
                        <TextField
                          {...field}
                          fullWidth
                          sx={{
                            m: 0,
                            mb: 2,
                            "& .MuiFormHelperText-root": {
                              fontWeight: 400,
                              fontSize: "16px",
                              lineHeight: "140%",
                              letterSpacing: "0%",
                              color: "#EF5350",
                              marginTop: "12px !important",
                              marginLeft: "0 !important",
                              marginRight: "0 !important",
                              marginBottom: "0 !important",
                            },
                          }}
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter Password"
                          onChange={(e) => {
                            handleChange(e);
                            const value = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              password: value,
                            }));
                          }}
                          onBlur={handleBlur}
                          error={!!(meta.touched && meta.error)}
                          helperText={(meta.touched && meta.error) || ""}
                          margin="normal"
                          FormHelperTextProps={{
                            sx: {
                              marginTop: "12px",
                              marginLeft: 0,
                              marginRight: 0,
                              marginBottom: 0,
                            },
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowPassword(!showPassword)}
                                  edge="end"
                                >
                                  {showPassword ? (
                                    <img 
                                      src="/icons/blueOpenIcon.svg" 
                                      alt="Hide password" 
                                      style={{ width: 20, height: 20 }}
                                    />
                                  ) : (
                                    <img 
                                      src="/icons/blueHideIcon.svg" 
                                      alt="Show password" 
                                      style={{ width: 20, height: 20 }}
                                    />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    </Field>
                    <Typography
                      sx={{
                        mt: "8px",
                        fontWeight: 500,
                        fontSize: { xs: "15px", md: "17px" },
                        lineHeight: "20px",
                        color: "#6D6D6D",
                        mb: "8px",
                      }}
                    >
                      Confirm Password
                    </Typography>
                    <Field name="confirmPassword">
                      {({ field, meta }: FieldProps) => (
                        <TextField
                          {...field}
                          sx={{
                            m: 0,
                            mb: "44px",
                            "& .MuiFormHelperText-root": {
                              fontWeight: 400,
                              fontSize: "16px",
                              lineHeight: "140%",
                              letterSpacing: "0%",
                              color: "#EF5350",
                              marginTop: "12px !important",
                              marginLeft: "0 !important",
                              marginRight: "0 !important",
                              marginBottom: "0 !important",
                            },
                          }}
                          fullWidth
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Re-enter Password"
                          onChange={(e) => {
                            handleChange(e);
                            setFormData((prev) => ({
                              ...prev,
                              confirmPassword: e.target.value,
                            }));
                          }}
                          onBlur={handleBlur}
                          error={!!(meta.touched && meta.error)}
                          helperText={(meta.touched && meta.error) || ""}
                          margin="normal"
                          FormHelperTextProps={{
                            sx: {
                              marginTop: "12px",
                              marginLeft: 0,
                              marginRight: 0,
                              marginBottom: 0,
                            },
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                  }
                                  edge="end"
                                >
                                  {showConfirmPassword ? (
                                    <img 
                                      src="/icons/blueOpenIcon.svg" 
                                      alt="Hide password" 
                                      style={{ width: 20, height: 20 }}
                                    />
                                  ) : (
                                    <img 
                                      src="/icons/blueHideIcon.svg" 
                                      alt="Show password" 
                                      style={{ width: 20, height: 20 }}
                                    />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    </Field>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={loading}
                      sx={{
                        bgcolor: "primary.dark",
                        color: "white",
                        py: { xs: 1.25, md: 1.5 },
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: { xs: "1rem", sm: "1.125rem", md: "1.1875rem" },
                        "&:hover": {
                          bgcolor: "#25608A",
                        },
                      }}
                    >
                      Next
                    </Button>
                  </Form>
                );
              }}
            </Formik>
          </Box>
        );

      case "add-details":
        return (
          <Formik
            initialValues={{
              name: formData.name || "",
              mobileNo: formData.mobileNo || "",
              email: formData.email || "",
              address: formData.address || "",
            }}
            validationSchema={addDetailsSchema}
            onSubmit={async (values) => {
              setFormData((prev) => ({
                ...prev,
                name: values.name,
                mobileNo: values.mobileNo,
                email: values.email,
                address: values.address,
              }));
              await handleSubmit();
            }}
            enableReinitialize
          >
            {({
              values,
              errors: formikErrors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <Box component={Form} onSubmit={handleSubmit}>
                <Box
                  sx={{
                    width: { xs: 100, sm: 120, md: 140 },
                    height: { xs: 100, sm: 120, md: 140 },
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "left",
                  }}
                >
                  <Image
                    alt="appLogo"
                    width={140}
                    height={140}
                    src={"/icons/appLogo.png"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                  <Typography
                    sx={{
                      fontWeight: `700`,
                      fontSize: { xs: `1.25rem`, sm: `1.375rem`, md: `1.5rem` },
                      marginLeft: { xs: "4px", md: "6px" },
                      color: `primary.normal`,
                      mb: "0.75rem",
                      lineHeight: { xs: "1.5rem", md: "1.75rem" },
                      textAlign: "center",
                    }}
                  >
                    CoudPouss
                  </Typography>
                </Box>

                <Typography
                  gutterBottom
                  sx={{
                    mb: 1,
                    mt: { xs: 1.5, md: 2 },
                    fontSize: { xs: "20px", sm: "22px", md: "24px" },
                    fontWeight: 700,
                    color: "#424242",
                    lineHeight: { xs: "24px", md: "28px" },
                  }}
                >
                  Add Personal Details
                </Typography>
                <Typography
                  sx={{
                    mb: { xs: 2, md: 3 },
                    color: "#6D6D6D",
                    lineHeight: "20px",
                    fontSize: { xs: "16px", md: "18px" },
                  }}
                >
                  Enter profile details
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 100, sm: 110, md: 120 },
                      height: { xs: 100, sm: 110, md: 120 },
                      borderRadius: "50%",
                      bgcolor: "grey.200",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 1,
                      overflow: "hidden",
                      borderColor: "primary.dark",
                    }}
                  >
                    {formData.profilePicturePreview ? (
                      <img
                        src={formData.profilePicturePreview}
                        alt="Profile"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <Typography
                        variant="h4"
                        sx={{
                          color: "primary.dark",
                          fontSize: "1.125rem",
                          fontWeight: 400,
                        }}
                      >
                        {formData.name
                          ? formData.name
                              .split(" ")
                              .map((n) => n.charAt(0).toUpperCase())
                              .join("")
                          : "BC"}
                      </Typography>
                    )}
                  </Box>
                  <Typography
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById("profile-upload")?.click();
                    }}
                    sx={{
                      cursor: "pointer",
                      color: "primary.normal",
                      textDecoration: "none",
                      lineHeight: "140%",
                      fontSize: { xs: "0.875rem", md: "1rem" },
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    upload profile picture
                  </Typography>
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const previewURL = URL.createObjectURL(file);
                        setFormData((prev) => ({
                          ...prev,
                          profilePicture: file,
                          profilePicturePreview: previewURL,
                        }));
                        await uploadProfileImage(file);
                      }
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        fontSize: { xs: "15px", md: "17px" },
                        lineHeight: "20px",
                        color: "#6D6D6D",
                        mb: "8px",
                      }}
                    >
                      Name
                    </Typography>
                    <Field name="name">
                      {({ field, meta }: FieldProps) => (
                        <TextField
                          {...field}
                          fullWidth
                          placeholder="Enter Name"
                          onChange={(e) => {
                            handleChange(e);
                            setFormData((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }));
                          }}
                          onBlur={handleBlur}
                          error={!!(meta.touched && meta.error)}
                          helperText={(meta.touched && meta.error) || ""}
                          margin="normal"
                          sx={{
                            m: 0,
                            "& .MuiFormHelperText-root": {
                              fontWeight: 400,
                              fontSize: "16px",
                              lineHeight: "140%",
                              letterSpacing: "0%",
                              color: "#EF5350",
                              marginTop: "12px !important",
                              marginLeft: "0 !important",
                              marginRight: "0 !important",
                              marginBottom: "0 !important",
                            },
                          }}
                          FormHelperTextProps={{
                            sx: {
                              marginTop: "12px",
                              marginLeft: 0,
                              marginRight: 0,
                              marginBottom: 0,
                            },
                          }}
                        />
                      )}
                    </Field>
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        fontSize: { xs: "15px", md: "17px" },
                        lineHeight: "20px",
                        color: "#6D6D6D",
                        mb: "8px",
                      }}
                    >
                      Mobile No.
                    </Typography>
                    <Field name="mobileNo">
                      {({ field, meta, form }: FieldProps) => {
                        const isError = !!(meta.touched && meta.error) || (meta.touched && phoneError);
                        return (
                          <>
                            <PhoneInputWrapper
                              value={form.values.mobileNo || ""}
                              onChange={(phone: string, country?: any) => {
                                setFormData((prev) => ({
                                  ...prev,
                                  mobileNo: phone,
                                  phoneCountryCode: country?.dialCode
                                    ? `+${country.dialCode}`
                                    : "",
                                }));
                                form.setFieldValue("mobileNo", phone);
                                form.setFieldTouched("mobileNo", true);
                                if (phoneError && phone) {
                                  setPhoneError(false);
                                }
                              }}
                              setShowPhoneError={(isValid: boolean) => {
                                if (meta.touched) {
                                  setPhoneError(!isValid);
                                }
                              }}
                              error={isError}
                              placeholder="Enter Mobile No."
                              defaultCountry="us"
                              preferredCountries={["in", "us"]}
                            />
                            {isError && (
                              <Typography
                                sx={{
                                  fontWeight: 400,
                                  fontSize: "16px",
                                  lineHeight: "140%",
                                  letterSpacing: "0%",
                                  color: "#EF5350",
                                  marginTop: "12px !important",
                                  marginLeft: "0 !important",
                                  marginRight: "0 !important",
                                  marginBottom: "0 !important",
                                }}
                              >
                                {meta.error || "Please enter a valid phone number"}
                              </Typography>
                            )}
                          </>
                        );
                      }}
                    </Field>
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        fontSize: { xs: "15px", md: "17px" },
                        lineHeight: "20px",
                        color: "#6D6D6D",
                        mb: "8px",
                      }}
                    >
                      Email
                    </Typography>
                    <Field name="email">
                      {({ field, meta }: FieldProps) => (
                        <TextField
                          {...field}
                          fullWidth
                          type="email"
                          placeholder="Enter Email"
                          onChange={(e) => {
                            handleChange(e);
                            setFormData((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }));
                          }}
                          onBlur={handleBlur}
                          error={!!(meta.touched && meta.error)}
                          helperText={(meta.touched && meta.error) || ""}
                          margin="normal"
                          sx={{
                            m: 0,
                            "& .MuiFormHelperText-root": {
                              fontWeight: 400,
                              fontSize: "16px",
                              lineHeight: "140%",
                              letterSpacing: "0%",
                              color: "#EF5350",
                              margin: 0,
                              marginTop: "12px",
                              mt: "12px",
                            },
                          }}
                        />
                      )}
                    </Field>
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        fontSize: { xs: "15px", md: "17px" },
                        lineHeight: "20px",
                        color: "#6D6D6D",
                        mb: "8px",
                      }}
                    >
                      Address
                    </Typography>
                    <Field name="address">
                      {({ field, meta }: FieldProps) => (
                        <TextField
                          {...field}
                          fullWidth
                          placeholder="Enter Address"
                          onChange={(e) => {
                            handleChange(e);
                            setFormData((prev) => ({
                              ...prev,
                              address: e.target.value,
                            }));
                          }}
                          onBlur={handleBlur}
                          error={!!(meta.touched && meta.error)}
                          helperText={(meta.touched && meta.error) || ""}
                          margin="normal"
                          multiline
                          rows={3}
                          sx={{
                            m: 0,
                            "& .MuiFormHelperText-root": {
                              fontWeight: 400,
                              fontSize: "16px",
                              lineHeight: "140%",
                              letterSpacing: "0%",
                              color: "#EF5350",
                              marginTop: "12px !important",
                              marginLeft: "0 !important",
                              marginRight: "0 !important",
                              marginBottom: "0 !important",
                            },
                          }}
                          FormHelperTextProps={{
                            sx: {
                              marginTop: "12px",
                              marginLeft: 0,
                              marginRight: 0,
                              marginBottom: 0,
                            },
                          }}
                        />
                      )}
                    </Field>
                  </Box>
                </Box>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    bgcolor: "primary.dark",
                    color: "white",
                    py: { xs: 1.25, md: 1.5 },
                    mt: { xs: "30px", md: "40px" },
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: { xs: "1rem", sm: "1.125rem", md: "1.1875rem" },
                    "&:hover": {
                      bgcolor: "#25608A",
                    },
                  }}
                >
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </Box>
            )}
          </Formik>
        );

      case "select-plan":
        return (
          <Box sx={{ px: { xs: 0, md: 4 } }}>
            {/* Logo Section */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{
                display: "flex",
                alignItems: "center",
                gap: "0.526875rem"
              }}>
                <Image
                  alt='logo'
                  width={80}
                  height={80}
                  src={"/icons/appLogo.png"}
                />
                <Typography sx={{
                  color: "primary.normal",
                  fontSize: "1.25rem",
                  lineHeight: "1.5rem",
                  fontWeight: 700
                }}>
                  CoudPouss
                </Typography>
              </Box>
            </Box>

            <Typography
              sx={{
                fontWeight: 700,
                fontSize: `1.5rem`,
                color: `#424242`,
                mb: "0.75rem",
                lineHeight: "1.75rem",
                textAlign: "left"
              }}
            >
              Choose your subscription
            </Typography>
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: "16px",
                textAlign: "left",
                lineHeight: "140%",
                letterSpacing: "0%",
                mb: "2.5rem",
                color: "#939393",
              }}
            >
              Select the plan that fits your activity. You can change it later in your profile.
            </Typography>

            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "19px",
                lineHeight: "28px",
                letterSpacing: "0%",
                color: "#214C65",
                mb: "1rem"
              }}
            >
              All Premium Plans
            </Typography>

            {planLoading && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            )}

            {planError && (
              <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
                {planError}
              </Typography>
            )}

            {!planLoading && !planError && plans.length === 0 && (
              <Typography sx={{ mb: 2, textAlign: "center", color: "text.secondary" }}>
                No plans available
              </Typography>
            )}

            {!planLoading && plans.map((plan) => (
              <Paper
                key={plan.id}
                elevation={0}
                sx={{
                  mb: 2,
                  paddingTop: "24px",
                  paddingRight: "20px",
                  paddingBottom: "24px",
                  paddingLeft: "20px",
                  border: selectedPlan === plan.id ? "2px solid #2F6B8E" : "1px solid rgba(204, 204, 204, 0.4)",
                  borderRadius: "12px",
                  cursor: "pointer",
                  position: "relative",
                  "&:hover": {
                    borderColor: "#2F6B8E",
                  },
                }}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: "19px",
                        lineHeight: "20px",
                        letterSpacing: "1%",
                        color: "#214C65",
                        mb:"19px"
                      }}
                    >
                      {plan.name}
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        fontSize: "18px",
                        lineHeight: "24px",
                        letterSpacing: "0%",
                        color: "#214C65",
                        mb:"8px"
                      }}
                    >
                      {formatDuration(plan.duration)}
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: "19px",
                        lineHeight: "20px",
                        letterSpacing: "1%",
                        color: "#214C65",
                        mt: 1
                      }}
                    >
                      {formatPrice(plan.price)}
                      <Typography
                        component="span"
                        sx={{
                          fontWeight: 400,
                          fontSize: "14px",
                          lineHeight: "20px",
                          letterSpacing: "0%",
                          color: "#214C65",
                          ml: 0.5
                        }}
                      >
                        /month
                      </Typography>
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 400,
                        fontSize: "12px",
                        lineHeight: "150%",
                        letterSpacing: "0%",
                        color: "#214C65",
                        display: "block",
                        mt: 1
                      }}
                    >
                      *Billed & recurring monthly cancel anytime
                    </Typography>
                  </Box>
                  <Radio
                    checked={selectedPlan === plan.id}
                    value={plan.id}
                    sx={{
                      color: "#2F6B8E",
                      "&.Mui-checked": {
                        color: "#2F6B8E",
                      },
                    }}
                  />
                </Box>
              </Paper>
            ))}

            <Typography variant="caption" sx={{ display: "block", fontWeight: 400, fontSize: "11px", lineHeight: "16px", color: "#2C6587", mb: 2 }}>
              Your membership starts as soon as you set up payment and subscribe. Your monthly charge will occur on the last day of the current billing period. We'll renew your membership for you can manage your subscription or turn off auto-renewal under accounts setting.
            </Typography>

            <Typography variant="caption" sx={{ display: "block", fontWeight: 400, fontSize: "11px", lineHeight: "16px", color: "#2C6587", mb: 3 }}>
              By continuing, you are agreeing to these terms. See the privacy statement and restricions.
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Button
                fullWidth
                variant="text"
                size="large"
                onClick={() => router.push(ROUTES.PROFESSIONAL_DASHBOARD)}
                sx={{
                  color: "primary.dark",
                  bgcolor: "transparent",
                  py: "20px",
                  fontWeight: 600,
                  fontSize: "14px",
                  textTransform: "none",
                  borderRadius: "8px",
                  lineHeight: "16px",
                  "&:hover": {
                    bgcolor: "transparent",
                  },
                }}
              >
                Skip
              </Button>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleContinue}
                disabled={!selectedPlan || loading || planLoading}
                sx={{
                  bgcolor: "#214C65",
                  color: "white",
                  py: "18px",
                  fontWeight: 700,
                  lineHeight: "20px",
                  textTransform: "none",
                  fontSize: "19px",
                  borderRadius: "8px",
                  "&:hover": {
                    bgcolor: "#25608A",
                  },
                  "&:disabled": {
                    bgcolor: "#ccc",
                    color: "#666",
                  },
                }}
              >
                Subscribe
              </Button>
            </Box>
          </Box>
        );

      case "review-plan":
        return (
          <Box sx={{ px: { xs: 0, md: 4 } }}>
            {/* Logo Section */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{
                display: "flex",
                alignItems: "center",
                gap: "0.526875rem"
              }}>
                <Image
                  alt='logo'
                  width={80}
                  height={80}
                  src={"/icons/appLogo.png"}
                />
                <Typography sx={{
                  color: "primary.normal",
                  fontSize: "1.25rem",
                  lineHeight: "1.5rem",
                  fontWeight: 600
                }}>
                  CoudPouss
                </Typography>
              </Box>
            </Box>

            {/* Content */}
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: `1.5rem`,
                color: `primary.normal`,
                mb: "0.75rem",
                lineHeight: "1.75rem",
                textAlign: "left"
              }}
            >
              Start Your Journey Today - First Month on Us!
            </Typography>
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: "1rem",
                textAlign: "left",
                lineHeight: "140%",
                letterSpacing: "0%",
                mb: "2.5rem",
                color: "#939393",
              }}
            >
              Subscribe now and enjoy your first month completely free. No payment today – your subscription will start immediately, and you'll be charged only after 30 days.
            </Typography>

            {/* Loading State */}
            {reviewPlanLoading && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            )}

            {/* Error State */}
            {reviewPlanError && !reviewPlanLoading && (
              <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
                {reviewPlanError}
              </Typography>
            )}

            {/* Plan Details */}
            {!reviewPlanLoading && reviewPlan ? (
              <Paper
                elevation={0}
                sx={{
                  border: "0.0625rem solid rgba(204, 204, 204, 0.4)",
                  borderRadius: "0.75rem",
                  paddingTop: "1.5rem",
                  paddingRight: "1.25rem",
                  paddingBottom: "1.5rem",
                  paddingLeft: "1.25rem",
                  gap: "0.75rem",
                  mb: 3,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: "1.1875rem",
                    lineHeight: "1.25rem",
                    letterSpacing: "1%",
                    color: "#214C65",
                  }}
                  gutterBottom
                >
                  {reviewPlan.name}
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "1.6875rem",
                    lineHeight: "2rem",
                    letterSpacing: "3%",
                    color: "#214C65",
                  }}
                  gutterBottom
                >
                  {formatPrice(reviewPlan.price)}
                  <Typography
                    component="span"
                    sx={{
                      fontWeight: 400,
                      fontSize: "1rem",
                      lineHeight: "1.125rem",
                      letterSpacing: "0%",
                      color: "#214C65",
                    }}
                  >
                    /month
                  </Typography>
                </Typography>

                {reviewPlan.description && (
                  <Typography
                    sx={{
                      fontWeight: 400,
                      fontSize: "0.875rem",
                      lineHeight: "140%",
                      color: "#939393",
                      mt: 1,
                      mb: 2,
                    }}
                  >
                    {reviewPlan.description}
                  </Typography>
                )}

                <Divider sx={{ my: 2 }} />

                <List dense disablePadding>
                  {reviewPlan.features && reviewPlan.features.length > 0 ? (
                    reviewPlan.features.map((feature, index) => (
                      <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                        <Image
                          src="/icons/verify.png"
                          alt="verify"
                          width={18}
                          height={18}
                          style={{ marginRight: "0.5rem" }}
                        />
                        <ListItemText
                          primary={feature}
                          primaryTypographyProps={{
                            sx: {
                              fontWeight: 500,
                              fontSize: "1rem",
                              lineHeight: "150%",
                              letterSpacing: "0%",
                              color: "#424242",
                            },
                          }}
                        />
                      </ListItem>
                    ))
                  ) : (
                    <Typography sx={{ color: "text.secondary", fontStyle: "italic" }}>
                      No features listed
                    </Typography>
                  )}
                </List>
              </Paper>
            ) : !reviewPlanLoading ? (
              <Typography sx={{ mb: 3, color: "text.secondary" }}>
                No plan selected. Please go back and select a plan.
              </Typography>
            ) : null}

            {/* Buttons */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={() => setStep("select-plan")}
                sx={{
                  borderColor: "primary.dark",
                  color: "primary.dark",
                  py: "18px",
                  textTransform: "none",
                  fontSize: "19px",
                  fontWeight: 700,
                  lineHeight: "20px",
                  "&:hover": {
                    borderColor: "#25608A",
                    bgcolor: "rgba(47, 107, 142, 0.04)",
                  },
                }}
              >
                Back
              </Button>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleContinue}
                disabled={!reviewPlan || loading}
                sx={{
                  bgcolor: "#214C65",
                  color: "white",
                  py: "18px",
                  textTransform: "none",
                  fontSize: "19px",
                  fontWeight: 700,
                  lineHeight: "20px",
                  "&:hover": {
                    bgcolor: "#25608A",
                  },
                  "&:disabled": {
                    bgcolor: "#ccc",
                    color: "#666",
                  },
                }}
              >
                Subscribe
              </Button>
            </Box>
          </Box>
        );

      case "payment-mode":
        return (
          <Box sx={{ px: { xs: 0, md: 4 } }}>
            {/* Logo Section */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{
                display: "flex",
                alignItems: "center",
                gap: "0.526875rem"
              }}>
                <Image
                  alt='logo'
                  width={80}
                  height={80}
                  src={"/icons/appLogo.png"}
                />
                <Typography sx={{
                  color: "primary.normal",
                  fontSize: "1.25rem",
                  lineHeight: "1.5rem",
                  fontWeight: 600
                }}>
                  CoudPouss
                </Typography>
              </Box>
            </Box>

            {/* Content */}
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: `1.5rem`,
                color: `primary.normal`,
                mb: "0.75rem",
                lineHeight: "1.75rem",
                textAlign: "left"
              }}
            >
              Payment Mode
            </Typography>
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: "1rem",
                textAlign: "left",
                lineHeight: "140%",
                letterSpacing: "0%",
                mb: "2.5rem",
                color: "#939393",
              }}
            >
              Select a quick and secure way to complete your subscription
            </Typography>

            {/* Plan Summary */}
            {paymentModePlan ? (
              <Paper
                elevation={0}
                sx={{
                  border: "0.0625rem solid #e0e0e0",
                  borderRadius: 2,
                  p: 2,
                  mb: 3,
                  bgcolor: "#f9fafb",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: "1.1875rem",
                    lineHeight: "1.25rem",
                    letterSpacing: "1%",
                    color: "#214C65",
                    marginBottom: "1.1875rem",
                  }}
                >
                  {paymentModePlan.name}
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "1.1875rem",
                    lineHeight: "1.25rem",
                    letterSpacing: "1%",
                    color: "#214C65",
                  }}
                >
                  {formatPrice(paymentModePlan.price)}
                  <Typography
                    component="span"
                    sx={{
                      fontWeight: 400,
                      fontSize: "1.125rem",
                      lineHeight: "1.5rem",
                      letterSpacing: "0%",
                      color: "#214C65",
                    }}
                  >
                    /month
                  </Typography>
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 400,
                    fontSize: "0.75rem",
                    lineHeight: "150%",
                    letterSpacing: "0%",
                    color: "#214C65",
                    display: "block",
                    mt: 0.5
                  }}
                >
                  *Billed & recurring {formatDuration(paymentModePlan.duration).toLowerCase()} cancel anytime
                </Typography>
              </Paper>
            ) : (
              <Paper
                elevation={0}
                sx={{
                  border: "0.0625rem solid #e0e0e0",
                  borderRadius: 2,
                  p: 2,
                  mb: 3,
                  bgcolor: "#f9fafb",
                }}
              >
                <Typography sx={{ color: "text.secondary" }}>
                  No plan selected. Please go back and select a plan.
                </Typography>
              </Paper>
            )}

            {/* Payment Method Selection */}
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: "1.0625rem",
                lineHeight: "1.25rem",
                letterSpacing: "0%",
                color: "#424242",
                mb: "1rem"
              }}
            >
              Choose payment method
            </Typography>

            {/* Payment methods */}
            {paymentMethods.map((method) => (
              <Paper
                key={method.id}
                elevation={0}
                sx={{
                  mb: 2,
                  paddingTop: "0.5rem",
                  paddingRight: "0.75rem",
                  paddingBottom: "0.5rem",
                  paddingLeft: "0.75rem",
                  border: selectedPaymentMethod === method.id ? "0.125rem solid #2F6B8E" : "0.03125rem solid #e0e0e0",
                  borderRadius: "1rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  bgcolor: "#FFFFFF",
                  gap: "0.9375rem",
                  "&:hover": {
                    borderColor: "#DFE8ED",
                  },
                }}
                onClick={() => setSelectedPaymentMethod(method.id)}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                  <Box
                    sx={{
                      borderRadius: "1rem",
                      border: "0.015625rem solid #EAF0F3",
                      padding: "1rem",
                      bgcolor: "#F2F2F2",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      src={
                        method.id === "google-pay"
                          ? "/icons/G_Pay_Lockup_1_.png"
                          : method.id === "apple-pay"
                          ? "/icons/appleLogo.png"
                          : "/icons/creditcard.png"
                      }
                      alt={method.name}
                      width={28}
                      height={28}
                    />
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: "1.125rem",
                      lineHeight: "1.25rem",
                      letterSpacing: "0%",
                      color: "#424242",
                    }}
                  >
                    {method.name}
                  </Typography>
                </Box>
                <Image
                  src="/icons/chevron-right.png"
                  alt="chevron right"
                  width={24}
                  height={24}
                />
              </Paper>
            ))}

            {/* Buttons */}
            <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={() => setStep("review-plan")}
                sx={{
                  borderColor: "primary.dark",
                  color: "primary.dark",
                  textTransform: "none",
                  py: "18px",
                  fontWeight: 700,
                  lineHeight: "20px",
                  fontSize: "18px",
                  "&:hover": {
                    borderColor: "#25608A",
                    bgcolor: "rgba(47, 107, 142, 0.04)",
                  },
                }}
              >
                Back
              </Button>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleContinue}
                disabled={!paymentModePlan || loading}
                sx={{
                  bgcolor: "primary.dark",
                  color: "white",
                  py: "18px",
                  fontWeight: 700,
                  lineHeight: "20px",
                  fontSize: "18px",
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "#25608A",
                  },
                  "&:disabled": {
                    bgcolor: "#ccc",
                    color: "#666",
                  },
                }}
              >
                Continue
              </Button>
            </Box>
          </Box>
        );

      case "additional-details":
        return (
          <Box sx={{ px: { xs: 0, md: 4 } }}>
            {/* Logo Section */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{
                display: "flex",
                alignItems: "center",
                gap: "0.526875rem"
              }}>
                <Image
                  alt='logo'
                  width={80}
                  height={80}
                  src={"/icons/appLogo.png"}
                />
                <Typography sx={{
                  color: "primary.normal",
                  fontSize: "1.25rem",
                  lineHeight: "1.5rem",
                  fontWeight: 600
                }}>
                  CoudPouss
                </Typography>
              </Box>
            </Box>

            {/* Content */}
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: `1.5rem`,
                color: `primary.normal`,
                mb: "0.75rem",
                lineHeight: "1.75rem",
                textAlign: "left"
              }}
            >
              Additional Details
            </Typography>
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "1rem",
                textAlign: "left",
                lineHeight: "150%",
                letterSpacing: "0%",
                mb: "2.5rem",
                color: "#939393",
              }}
            >
              Upload the required documents to complete your profile and gain the Certified badge.
            </Typography>

            {/* Years of Experience */}
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "1.0625rem",
                lineHeight: "1.25rem",
                color: "#424242",
                mb: "0.5rem"
              }}
            >
              Years of Experience
            </Typography>
            <TextField
              fullWidth
              name="experience"
              type="text"
              placeholder="Enter years of experience"
              value={additionalDetails.experience}
              onChange={(e) => {
                // Only allow numbers
                const value = e.target.value.replace(/[^0-9]/g, '');
                setAdditionalDetails(prev => ({ ...prev, experience: value }));
                if (additionalDetailsError) setAdditionalDetailsError(null);
              }}
              error={!!additionalDetailsError && additionalDetailsError.includes("experience")}
              helperText={additionalDetailsError && additionalDetailsError.includes("experience") ? additionalDetailsError : ""}
              sx={{ mb: 3 }}
            />
            {additionalDetailsError && !additionalDetailsError.includes("valid number") && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                {additionalDetailsError}
              </Typography>
            )}

            {/* A copy of ID */}
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "1.0625rem",
                lineHeight: "1.25rem",
                color: "#424242",
                mb: "0.5rem"
              }}
            >
              A copy of ID
            </Typography>
            <Paper
              elevation={0}
              sx={{
                border: "2px dashed #d1d5db",
                borderRadius: 2,
                p: 4,
                textAlign: "center",
                cursor: "pointer",
                mb: 3,
                position: "relative",
                minHeight: "120px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => document.getElementById("id-upload")?.click()}
            >
              {filePreviews.idCopy && fileTypes.idCopy === 'image' ? (
                <Box sx={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
                  <Image
                    src={filePreviews.idCopy}
                    alt="ID Preview"
                    fill
                    style={{ objectFit: "cover", borderRadius: "8px" }}
                  />
                  <Box sx={{ position: "absolute", bottom: 8, left: 8, right: 8, bgcolor: "rgba(0,0,0,0.6)", borderRadius: 1, p: 0.5 }}>
                    <Typography variant="body2" color="white" sx={{ fontSize: "0.75rem", textAlign: "center" }}>
                      {additionalDetails.idCopy?.name}
                    </Typography>
                  </Box>
                </Box>
              ) : fileTypes.idCopy === 'pdf' ? (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <PictureAsPdfIcon sx={{ fontSize: 48, color: "#d32f2f", mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {additionalDetails.idCopy?.name}
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Image src="/icons/folder-upload-line.png" width={24} height={24} alt="Upload" style={{ marginBottom: "0.5rem" }} />
                  <Typography variant="body2" color="text.secondary">
                    Upload from device
                  </Typography>
                </Box>
              )}
              <input
                id="id-upload"
                type="file"
                accept="image/*,.pdf"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileUpload(file, 'idCopy');
                  }
                }}
              />
            </Paper>

            {/* Kbis Extract */}
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "1.0625rem",
                lineHeight: "1.25rem",
                color: "#424242",
                mb: "0.5rem"
              }}
            >
              Kbis Extract
            </Typography>
            <Paper
              elevation={0}
              sx={{
                border: "2px dashed #d1d5db",
                borderRadius: 2,
                p: 4,
                textAlign: "center",
                cursor: "pointer",
                mb: 3,
                position: "relative",
                minHeight: "120px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => document.getElementById("kbis-upload")?.click()}
            >
              {filePreviews.kbisExtract && fileTypes.kbisExtract === 'image' ? (
                <Box sx={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
                  <Image
                    src={filePreviews.kbisExtract}
                    alt="Kbis Preview"
                    fill
                    style={{ objectFit: "cover", borderRadius: "8px" }}
                  />
                  <Box sx={{ position: "absolute", bottom: 8, left: 8, right: 8, bgcolor: "rgba(0,0,0,0.6)", borderRadius: 1, p: 0.5 }}>
                    <Typography variant="body2" color="white" sx={{ fontSize: "0.75rem", textAlign: "center" }}>
                      {additionalDetails.kbisExtract?.name}
                    </Typography>
                  </Box>
                </Box>
              ) : fileTypes.kbisExtract === 'pdf' ? (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <PictureAsPdfIcon sx={{ fontSize: 48, color: "#d32f2f", mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {additionalDetails.kbisExtract?.name}
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Image src="/icons/folder-upload-line.png" width={24} height={24} alt="Upload" style={{ marginBottom: "0.5rem" }} />
                  <Typography variant="body2" color="text.secondary">
                    Upload from device
                  </Typography>
                </Box>
              )}
              <input
                id="kbis-upload"
                type="file"
                accept="image/*,.pdf"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileUpload(file, 'kbisExtract');
                  }
                }}
              />
            </Paper>

            {/* Proof of residence */}
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "1.0625rem",
                lineHeight: "1.25rem",
                color: "#424242",
                mb: "0.5rem"
              }}
            >
              Proof of residence
            </Typography>
            <Typography variant="caption" color="error" sx={{ display: "block", mb: 1 }}>
              *less than 3 months old (e.g., water or electricity bill)
            </Typography>
            <Paper
              elevation={0}
              sx={{
                border: "2px dashed #d1d5db",
                borderRadius: 2,
                p: 4,
                textAlign: "center",
                cursor: "pointer",
                mb: 3,
                position: "relative",
                minHeight: "120px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => document.getElementById("residence-upload")?.click()}
            >
              {filePreviews.proofOfResidence && fileTypes.proofOfResidence === 'image' ? (
                <Box sx={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
                  <Image
                    src={filePreviews.proofOfResidence}
                    alt="Residence Proof Preview"
                    fill
                    style={{ objectFit: "cover", borderRadius: "8px" }}
                  />
                  <Box sx={{ position: "absolute", bottom: 8, left: 8, right: 8, bgcolor: "rgba(0,0,0,0.6)", borderRadius: 1, p: 0.5 }}>
                    <Typography variant="body2" color="white" sx={{ fontSize: "0.75rem", textAlign: "center" }}>
                      {additionalDetails.proofOfResidence?.name}
                    </Typography>
                  </Box>
                </Box>
              ) : fileTypes.proofOfResidence === 'pdf' ? (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <PictureAsPdfIcon sx={{ fontSize: 48, color: "#d32f2f", mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {additionalDetails.proofOfResidence?.name}
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Image src="/icons/folder-upload-line.png" width={24} height={24} alt="Upload" style={{ marginBottom: "0.5rem" }} />
                  <Typography variant="body2" color="text.secondary">
                    Upload from device
                  </Typography>
                </Box>
              )}
              <input
                id="residence-upload"
                type="file"
                accept="image/*,.pdf"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileUpload(file, 'proofOfResidence');
                  }
                }}
              />
            </Paper>

            {/* Buttons */}
            <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={() => setStep("select-category")}
                sx={{
                  borderRadius: "0.75rem",
                  border: "0.0625rem solid #214C65",
                  borderColor: "#214C65",
                  padding: "1.125rem 3.75rem",
                  gap: "0.625rem",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1.1875rem",
                  lineHeight: "1.25rem",
                  letterSpacing: "1%",
                  color: "#214C65",
                  "&:hover": {
                    borderColor: "#214C65",
                    bgcolor: "transparent",
                  },
                }}
              >
                Skip
              </Button>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleContinue}
                disabled={loading}
                sx={{
                  borderRadius: "0.75rem",
                  bgcolor: "#214C65",
                  padding: "1.125rem 3.75rem",
                  gap: "0.625rem",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1.1875rem",
                  lineHeight: "1.25rem",
                  letterSpacing: "1%",
                  color: "#FFFFFF",
                  "&:hover": {
                    bgcolor: "#214C65",
                  },
                  "&:disabled": {
                    bgcolor: "#ccc",
                    color: "#666",
                  },
                }}
              >
                {loading ? "Saving..." : "Next"}
              </Button>
            </Box>
          </Box>
        );

      case "select-category":
        return (
          <Box sx={{ px: { xs: 0, md: 4 } }}>
            {/* Logo Section */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{
                display: "flex",
                alignItems: "center",
                gap: "0.526875rem"
              }}>
                <Image
                  alt='logo'
                  width={80}
                  height={80}
                  src={"/icons/appLogo.png"}
                />
                <Typography sx={{
                  color: "primary.normal",
                  fontSize: "1.25rem",
                  lineHeight: "1.5rem",
                  fontWeight: 600
                }}>
                  CoudPouss
                </Typography>
              </Box>
            </Box>

            {/* Content */}
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: `20px`,
                lineHeight: "24px",
                color: `#323232`,
                mb: "0.75rem",
                textAlign: "left",
              }}
            >
              Select A Category
            </Typography>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "1rem",
                textAlign: "left",
                lineHeight: "150%",
                letterSpacing: "0%",
                mb: "2.5rem",
                color: "#939393",
              }}
            >
              Choose a category that best matches your services. This helps us connect you with the right clients.
            </Typography>

            {/* Category Dropdown */}
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "17px",
                lineHeight: "20px",
                color: "#424242",
                mb: "0.5rem",
              }}
            >
              Select a category
            </Typography>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <Select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                displayEmpty
                renderValue={(selected) => {
                  if (!selected) {
                    return (
                      <Typography
                        sx={{
                          fontWeight: 400,
                          fontSize: "1.125rem",
                          lineHeight: "140%",
                          letterSpacing: "0%",
                          color: "#939393",
                        }}
                      >
                        Select a category
                      </Typography>
                    );
                  }

                  const cat = categories.find((c) => c.id === selected);

                  if (!cat) {
                    return (
                      <Typography
                        sx={{
                          fontWeight: 400,
                          fontSize: "1.125rem",
                          lineHeight: "140%",
                          letterSpacing: "0%",
                          color: "#939393",
                        }}
                      >
                        Select a category
                      </Typography>
                    );
                  }

                  return (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {cat.category_logo ? (
                        <Image
                          src={cat.category_logo}
                          alt={cat.category_name}
                          width={24}
                          height={24}
                          style={{ objectFit: "contain" }}
                        />
                      ) : (
                        <CategoryIcon category={getCategoryIconKey(cat.category_name)} isSelected={true} />
                      )}
                      <Typography
                        sx={{
                          color: "primary.normal",
                        }}
                      >
                        {cat.category_name}
                      </Typography>
                    </Box>
                  );
                }}
                sx={{ mb: 2 }}
                disabled={categoryLoading}
              >
                {categoryLoading && (
                  <MenuItem disabled>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                        py: 2,
                      }}
                    >
                      <CircularProgress size={24} />
                    </Box>
                  </MenuItem>
                )}
                {categoryError && (
                  <MenuItem disabled>
                    <Typography color="error" sx={{ py: 1 }}>
                      {categoryError}
                    </Typography>
                  </MenuItem>
                )}
                {!categoryLoading && !categoryError && categories.length === 0 && (
                  <MenuItem disabled>
                    <Typography sx={{ py: 1, color: "text.secondary" }}>
                      No categories available
                    </Typography>
                  </MenuItem>
                )}
                {!categoryLoading &&
                  categories.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <MenuItem
                        key={cat.id}
                        value={cat.id}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontWeight: 400,
                          fontSize: "1rem",
                          lineHeight: "140%",
                          letterSpacing: "0%",
                          color: isSelected ? "primary.normal" : "text.primary",
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {cat.category_logo ? (
                            <Image
                              src={cat.category_logo}
                              alt={cat.category_name}
                              width={24}
                              height={24}
                              style={{ objectFit: "contain" }}
                            />
                          ) : (
                            <CategoryIcon
                              category={getCategoryIconKey(cat.category_name)}
                              isSelected={isSelected}
                            />
                          )}
                          <Typography
                            sx={{
                              fontWeight: 400,
                              fontSize: "1rem",
                              lineHeight: "140%",
                              letterSpacing: "0%",
                              color: isSelected
                                ? "primary.normal"
                                : "text.primary",
                            }}
                          >
                            {cat.category_name}
                          </Typography>
                        </Box>
                        <Radio checked={isSelected} />
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>

            {/* Service Selection */}
            {selectedCategory && (
              <Box sx={{ mb: 3 }}>
                {subcategoriesLoading ? (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <CircularProgress size={24} />
                    <Typography sx={{ mt: 2, color: "text.secondary" }}>
                      Loading services...
                    </Typography>
                  </Box>
                ) : subcategories.length === 0 ? (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography sx={{ color: "text.secondary" }}>
                      No services available for this category
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      maxHeight: { xs: "300px", md: "400px" },
                      overflowY: "auto",
                      scrollbarWidth: "none", // Firefox
                      msOverflowStyle: "none", // IE and Edge
                      "&::-webkit-scrollbar": {
                        display: "none", // Chrome, Safari, Opera
                      },
                    }}
                  >
                    {subcategories.map((subcategory) => {
                    const isSelected = selectedServices[selectedCategory]?.includes(
                      subcategory.id
                    ) ?? false;
                    
                    return (
                      <Paper
                        key={subcategory.id}
                        elevation={0}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          p: 2,
                          mb: 2,
                          border: "1px solid #e5e7eb",
                          borderRadius: 2,
                          cursor: "pointer",
                          bgcolor: isSelected ? "#f9fafb" : "white",
                          "&:hover": {
                            bgcolor: "#f9fafb",
                          },
                        }}
                        onClick={() => handleServiceToggle(subcategory.id)}
                      >
                        <Box
                          sx={{
                            width: 100,
                            height: 80,
                            borderRadius: 1,
                            overflow: "hidden",
                            bgcolor: "#f3f4f6",
                            flexShrink: 0,
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {subcategory.image ? (
                            <Image
                              src={subcategory.image}
                              alt={subcategory.subcategory_name}
                              fill
                              style={{ objectFit: "cover" }}
                            />
                          ) : (
                            <Typography
                              sx={{
                                color: "text.secondary",
                                fontSize: "0.875rem",
                              }}
                            >
                              {subcategory.subcategory_name.charAt(0)}
                            </Typography>
                          )}
                        </Box>
                        <Typography
                          sx={{
                            flex: 1,
                            fontWeight: 600,
                            fontSize: "1.125rem",
                            lineHeight: "1.25rem",
                            letterSpacing: "0%",
                            color: "#323232",
                            ml: "0.875rem",
                          }}
                        >
                          {subcategory.subcategory_name}
                        </Typography>
                        <Checkbox
                          checked={isSelected}
                          sx={{
                            color: "#d1d5db",
                            "&.Mui-checked": {
                              color: "#2F6B8E",
                            },
                          }}
                        />
                      </Paper>
                    );
                  })}
                  </Box>
                )}
              </Box>
            )}

            {/* Selected Services Display */}
            {Object.values(selectedServices).some(
              (servicesForCategory) =>
                servicesForCategory && servicesForCategory.length > 0
            ) && (
              <Box sx={{ mb: 4 }}>
                <Divider sx={{ my: "2rem", borderColor: "#EBEBEB" }} />

                <Box
                  sx={{
                    maxHeight: { xs: "300px", md: "400px" },
                    overflowY: "auto",
                    scrollbarWidth: "none", // Firefox
                    msOverflowStyle: "none", // IE and Edge
                    "&::-webkit-scrollbar": {
                      display: "none", // Chrome, Safari, Opera
                    },
                  }}
                >
                  {Object.keys(selectedServices)
                    .filter(
                      (cat) =>
                        selectedServices[cat] &&
                        selectedServices[cat].length > 0
                    )
                    .map((cat) => {
                    // Find the category from API using category ID
                    const apiCategory = categories.find(
                      (c) => c.id === cat
                    );
                    
                    return (
                      <Box key={cat} sx={{ mb: 3 }}>
                        <Box
                          sx={{
                            mb: 2,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.875rem",
                            bgcolor: "white",
                            border: "1px solid #2C6587",
                            borderRadius: "0.625rem",
                            px: "12px",
                            py: "10px",
                          }}
                        >
                          {apiCategory?.category_logo ? (
                            <Image
                              src={apiCategory.category_logo}
                              alt={apiCategory.category_name}
                              width={24}
                              height={24}
                              style={{ objectFit: "contain" }}
                            />
                          ) : (
                            <CategoryIcon
                              category={getCategoryIconKey(
                                apiCategory?.category_name || cat
                              )}
                              isSelected={true}
                            />
                          )}
                          <Typography
                            sx={{
                              fontWeight: 600,
                              fontSize: "1rem",
                              lineHeight: "150%",
                              letterSpacing: "0%",
                              color: "#2C6587",
                            }}
                          >
                            {apiCategory?.category_name || cat}
                          </Typography>
                        </Box>

                      {(() => {
                        // Get subcategories for this category from stored data
                        const categorySubcategories = subcategoriesByCategory[cat] || [];
                        const selectedSubcategoryIds = selectedServices[cat] || [];
                        const filteredSubcategories = categorySubcategories.filter(
                          (subcategory) =>
                            selectedSubcategoryIds.includes(subcategory.id)
                        );

                        return filteredSubcategories.map((subcategory) => (
                          <Paper
                            key={subcategory.id}
                            elevation={0}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              p: 2,
                              mb: 2,
                              border: "1px solid #e5e7eb",
                              borderRadius: 2,
                              bgcolor: "#f9fafb",
                            }}
                          >
                            <Box
                              sx={{
                                width: 100,
                                height: 80,
                                borderRadius: 1,
                                overflow: "hidden",
                                bgcolor: "#f3f4f6",
                                flexShrink: 0,
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {subcategory.image ? (
                                <Image
                                  src={subcategory.image}
                                  alt={subcategory.subcategory_name}
                                  fill
                                  style={{ objectFit: "cover" }}
                                />
                              ) : (
                                <Typography
                                  sx={{
                                    color: "text.secondary",
                                    fontSize: "0.875rem",
                                  }}
                                >
                                  {subcategory.subcategory_name.charAt(0)}
                                </Typography>
                              )}
                            </Box>
                            <Typography
                              sx={{
                                flex: 1,
                                fontWeight: 600,
                                fontSize: "1.125rem",
                                lineHeight: "1.25rem",
                                letterSpacing: "0%",
                                color: "#323232",
                                ml: "0.875rem",
                              }}
                            >
                              {subcategory.subcategory_name}
                            </Typography>
                            <IconButton
                              onClick={() =>
                                handleRemoveService(cat, subcategory.id)
                              }
                              sx={{
                                "&:hover": {
                                  bgcolor: "rgba(239, 68, 68, 0.1)",
                                },
                              }}
                            >
                              <Image
                                src="/icons/deleteIcon.png"
                                alt="Delete service"
                                width={20}
                                height={20}
                                style={{ objectFit: "contain" }}
                              />
                            </IconButton>
                          </Paper>
                        ));
                      })()}
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            )}

            {/* Buttons */}
            <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={() => setStep("additional-details")}
                sx={{
                  borderColor: "primary.dark",
                  color: "primary.dark",
                  textTransform: "none",
                  py: "18px",
                  lineHeight: "20px",
                  fontWeight: 700,
                  fontSize: "19px",
                  "&:hover": {
                    borderColor: "#25608A",
                    bgcolor: "rgba(47, 107, 142, 0.04)",
                  },
                }}
              >
                {Object.values(selectedServices).some(
                  (servicesForCategory) =>
                    servicesForCategory && servicesForCategory.length > 0
                )
                  ? "Back"
                  : "Skip"}
              </Button>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleContinue}
                disabled={
                  !Object.values(selectedServices).some(
                    (servicesForCategory) =>
                      servicesForCategory && servicesForCategory.length > 0
                  ) || loading
                }
                sx={{
                  bgcolor: "primary.dark",
                  color: "white",
                  textTransform: "none",
                  py: "18px",
                  lineHeight: "20px",
                  fontWeight: 700,
                  fontSize: "19px",
                  "&:hover": {
                    bgcolor: "#25608A",
                  },
                  "&:disabled": {
                    bgcolor: "#ccc",
                  },
                }}
              >
                Next
              </Button>
            </Box>
          </Box>
        );

      case "bank-details":
        return (
          <Box sx={{ px: 4 }}>
            {/* Logo Section */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{
                display: "flex",
                alignItems: "center",
                gap: "0.526875rem"
              }}>
                <Image
                  alt='logo'
                  width={80}
                  height={80}
                  src={"/icons/appLogo.png"}
                />
                <Typography sx={{
                  color: "primary.normal",
                  fontSize: "1.25rem",
                  lineHeight: "1.5rem",
                  fontWeight: 600
                }}>
                  CoudPouss
                </Typography>
              </Box>
            </Box>

            {/* Content */}
            <Typography
              sx={{
                fontWeight: `700`,
                fontSize: `1.5rem`,
                color: `primary.normal`,
                mb: "0.75rem",
                lineHeight: "1.75rem",
                textAlign: "left"
              }}
            >
              Add Bank Details
            </Typography>
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: "1rem",
                textAlign: "left",
                lineHeight: "140%",
                mb: "2.5rem",
                color: "secondary.neutralWhiteDark",
              }}
            >
              Select the plan that fits your activity. You can change it later in your profile.
            </Typography>

            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "1.0625rem",
                lineHeight: "1.25rem",
                color: "#424242",
                mb: "0.5rem"
              }}
            >
              Account Holder Name
            </Typography>
            <TextField
              fullWidth
              name="accountHolderName"
              placeholder="Enter Name"
              value={bankDetails.accountHolderName}
              onChange={(e) => {
                setBankDetails(prev => ({ ...prev, accountHolderName: e.target.value }));
              }}
              sx={{ mb: 2 }}
            />

            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "1.0625rem",
                lineHeight: "1.25rem",
                color: "#424242",
                mb: "0.5rem"
              }}
            >
              Account Number
            </Typography>
            <TextField
              fullWidth
              name="accountNumber"
              placeholder="Enter Account Number"
              value={bankDetails.accountNumber}
              onChange={(e) => {
                setBankDetails(prev => ({ ...prev, accountNumber: e.target.value }));
              }}
              sx={{ mb: 2 }}
            />

            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "1.0625rem",
                lineHeight: "1.25rem",
                color: "#424242",
                mb: "0.5rem"
              }}
            >
              Confirm Account Number
            </Typography>
            <TextField
              fullWidth
              name="confirmAccountNumber"
              placeholder="Re-enter Account Number"
              value={bankDetails.confirmAccountNumber}
              onChange={(e) => {
                setBankDetails(prev => ({ ...prev, confirmAccountNumber: e.target.value }));
              }}
              sx={{ mb: 2 }}
            />

            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "1.0625rem",
                lineHeight: "1.25rem",
                color: "#424242",
                mb: "0.5rem"
              }}
            >
              IFSC Code
            </Typography>
            <TextField
              fullWidth
              name="ifscCode"
              placeholder="Enter IFSC Code"
              value={bankDetails.ifscCode}
              onChange={(e) => {
                setBankDetails(prev => ({ ...prev, ifscCode: e.target.value }));
              }}
              sx={{ mb: 2 }}
            />

            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "1.0625rem",
                lineHeight: "1.25rem",
                color: "#424242",
                mb: "0.5rem"
              }}
            >
              Bank Name
            </Typography>
            <TextField
              fullWidth
              name="bankName"
              placeholder="Enter Bank Name"
              value={bankDetails.bankName}
              onChange={(e) => {
                setBankDetails(prev => ({ ...prev, bankName: e.target.value }));
              }}
              sx={{ mb: 3 }}
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={() => setStep("select-category")}
                sx={{
                  borderColor: "primary.dark",
                  color: "primary.dark",
                  py: 1.5,
                  textTransform: "none",
                  fontSize: "1rem",
                  "&:hover": {
                    borderColor: "#25608A",
                    bgcolor: "rgba(47, 107, 142, 0.04)",
                  },
                }}
              >
                Back
              </Button>
              <Button
                onClick={handleBankDetailsSubmit}
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  bgcolor: "primary.dark",
                  color: "white",
                  py: 1.5,
                  textTransform: "none",
                  fontSize: "1rem",
                  "&:hover": {
                    bgcolor: "#25608A",
                  },
                }}
              >
                Next
              </Button>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        bgcolor: "background.default",
      }}
    >
      {/* Left side - Image Section */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          width: { md: "56%" },
          position: "relative",
          bgcolor: "grey.100",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            minHeight: "100vh",
          }}
        >
          <Image
            src="/image/main.png"
            alt="CoudPouss Service"
            fill
            style={{
              objectFit: "cover",
              objectPosition: "top",
            }}
            sizes="66.666vw"
            priority
          />
        </Box>
      </Box>

      {/* Right side - Signup Form */}
      <Box
        sx={{
          width: { xs: "100%", md: "45%" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 0, sm: 0, md: 4 },
          py: { xs: 2, sm: 3, md: 4 },
          overflowY: "auto",
          pt: step !== "enter-contact" && step !== "select-plan" && step !== "review-plan" && step !== "payment-mode" && step !== "additional-details" && step !== "select-category" && step !== "bank-details" ? { xs: 2, sm: 4, md: 10 } : { xs: 2, md: 4 },
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{
              padding: { xs: '32px 12px', sm: 3, md: 4 },
              width: "100%",
            }}
          >
            {/* Logo Section */}
            {step != "add-details" && step !== "select-plan" && step !== "review-plan" && step !== "payment-mode" && step !== "additional-details" && step !== "select-category" && step !== "bank-details" && (
              <Box sx={{ textAlign: "center", mb: { xs: 2, md: 3 } }}>
                <Box
                  sx={{
                    width: { xs: 100, sm: 120, md: 140 },
                    height: { xs: 100, sm: 120, md: 140 },
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto",
                    mb: { xs: "12px", md: "16px" },
                  }}
                >
                  <Image
                    alt="appLogo"
                    width={140}
                    height={140}
                    src={"/icons/appLogo.png"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              </Box>
            )}

            {/* Step Content */}
            {renderStepContent()}

            {/* Login Link */}
            {step == "enter-contact" && (
              <Box sx={{ textAlign: "center", mt: { xs: 2, md: 3 } }}>
                <Typography
                  sx={{
                    color: "secondary.naturalGray",
                    fontSize: { xs: "16px", md: "18px" },
                    lineHeight: "20px",
                  }}
                >
                  Already have an account?{" "}
                  <Link
                    href={ROUTES.LOGIN}
                    style={{
                      fontFamily: "Lato, sans-serif",
                      fontWeight: 600,
                      lineHeight: "1.5rem",
                      letterSpacing: "0em",
                      textAlign: "center",
                      color: "#2C6587",
                      textDecorationLine: "underline",
                      textDecorationThickness: "0.08em",
                      textUnderlineOffset: "0.03em",
                      textDecorationSkipInk: "auto",
                      display: "inline-block",
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        fontSize: { xs: "1.125rem", md: "1.25rem" },
                      }}
                    >
                      Log In
                    </Box>
                  </Link>
                </Typography>
              </Box>
            )}
          </Paper>
        </Container>
      </Box>

      {/* Success Modal */}
      <SuccessModal
        open={showSuccessModal}
        onClose={handleSuccessClose}
        title=""
        message="Welcome aboard! Your subscription is now active. You can start exploring all features immediately."
        buttonText="Complete Profile Now"
        showSubscriptionDetails={true}
        subscriptionDetails={{
          plan: subscriptionData?.plan_details?.name 
            ? `${subscriptionData.plan_details.name} ${subscriptionData.plan_details.duration ? `(${subscriptionData.plan_details.duration})` : ''}`
            : paymentModePlan 
              ? `${paymentModePlan.name}/${formatDuration(paymentModePlan.duration)}` 
              : "N/A",
          modeOfPayment: selectedPaymentMethod === "google-pay" ? "Google Pay" : selectedPaymentMethod === "apple-pay" ? "Apple Pay" : selectedPaymentMethod === "credit-card" ? "Credit Card" : "Not selected",
          subscriptionDate: subscriptionData?.subscription?.subscribed_at 
            ? new Date(subscriptionData.subscription.subscribed_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
            : new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
          startDate: subscriptionData?.subscription?.subscribed_at 
            ? new Date(subscriptionData.subscription.subscribed_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
            : new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
          billingDate: subscriptionData?.plan_details?.duration 
            ? subscriptionData.plan_details.duration.charAt(0).toUpperCase() + subscriptionData.plan_details.duration.slice(1)
            : paymentModePlan 
              ? formatDuration(paymentModePlan.duration) 
              : "Monthly",
        }}
      />

      {/* Thank You Modal */}
      <ThankYouModal
        open={showThankYouModal}
        onClose={handleThankYouClose}
      />

      {/* Add Category Modal */}
      <AddCategoryModal
        open={showAddCategoryModal}
        onClose={() => {
          setShowAddCategoryModal(false);
          setPendingCategorySelection(null);
        }}
        onProceed={() => {
          if (pendingCategorySelection) {
            // Add the service to the category
            setSelectedServices((prev) => {
              const current = prev[pendingCategorySelection.categoryId] || [];
              const updatedForCategory = [...current, pendingCategorySelection.serviceId];
              return {
                ...prev,
                [pendingCategorySelection.categoryId]: updatedForCategory,
              };
            });
          }
          setShowAddCategoryModal(false);
          setPendingCategorySelection(null);
        }}
      />
    </Box>
  );
}

