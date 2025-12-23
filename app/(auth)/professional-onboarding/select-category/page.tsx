"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  IconButton,
  Radio,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import Image from "next/image";
import { apiGet } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";

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

// Helper function to normalize category name to value (for backward compatibility)
const normalizeCategoryValue = (categoryName: string): string => {
  return categoryName.toLowerCase().replace(/\s+/g, "-");
};

// Map category names to existing icon mappings
const getCategoryIconKey = (categoryName: string): string => {
  const normalized = categoryName.toLowerCase();
  if (normalized.includes("diy") || normalized === "diy") return "diy";
  if (normalized.includes("garden")) return "gardening";
  if (normalized.includes("move") || normalized.includes("transport")) return "moving";
  if (normalized.includes("housekeep") || normalized.includes("clean")) return "housekeeping";
  if (normalized.includes("child")) return "childcare";
  if (normalized.includes("pet")) return "pets";
  if (normalized.includes("tech") || normalized.includes("it")) return "it";
  if (normalized.includes("homecare") || normalized.includes("care")) return "homecare";
  if (normalized.includes("personal care")) return "homecare";
  return "diy"; // Default fallback
};

// Map API category names to service object keys
const getServiceKey = (categoryName: string): string => {
  const normalized = categoryName.toLowerCase();
  if (normalized.includes("diy") || normalized === "diy") return "diy";
  if (normalized.includes("garden")) return "gardening";
  if (normalized.includes("move") || normalized.includes("transport")) return "moving";
  if (normalized.includes("housekeep") || normalized.includes("clean")) return "housekeeping";
  if (normalized.includes("child")) return "childcare";
  if (normalized.includes("pet")) return "pets";
  if (normalized.includes("tech") || normalized.includes("it")) return "it";
  if (normalized.includes("homecare") || normalized.includes("care")) return "homecare";
  if (normalized.includes("personal care")) return "homecare";
  return "diy"; // Default fallback
};

const services: { [key: string]: { id: number; name: string; image: string }[] } = {
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
    // Other categories fall back to grey icons from modal for consistency
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
    // Fallback for other categories
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


export default function SelectCategoryPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedServices, setSelectedServices] = useState<
    Record<string, number[]>
  >({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiGet<CategoriesResponse>(
          API_ENDPOINTS.HOME.ALL_CATEGORIES
        );

        if (response.success && response.data) {
          setCategories(response.data.data || []);
        } else {
          setError(response.error?.message || "Failed to fetch categories");
        }
      } catch (err: any) {
        console.error("Error fetching categories:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleServiceToggle = (serviceId: number) => {
    if (!selectedCategory) return;

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

  const handleRemoveService = (category: string, serviceId: number) => {
    setSelectedServices((prev) => {
      const current = prev[category] || [];
      const updatedForCategory = current.filter((id) => id !== serviceId);
      return {
        ...prev,
        [category]: updatedForCategory,
      };
    });
  };

  const handleSkip = () => {
    router.push(ROUTES.LOGIN);
  };

  const handleContinue = () => {
    const selectedCategoryKeys = Object.keys(selectedServices).filter(
      (key) => selectedServices[key] && selectedServices[key].length > 0
    );

    if (selectedCategoryKeys.length === 0) {
      alert("Please select at least one service");
      return;
    }

    // Store new multi-category structure
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

    router.push(ROUTES.PROFESSIONAL_ONBOARDING_BANK_DETAILS);
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
          width: { md: "55%" },
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

      {/* Right side - Form */}
      <Box
        sx={{
          width: { xs: "100%", md: "45%" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 4,
          overflowY: "auto",
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{
              padding: 4,
              width: "100%",
            }}
          >
            {/* Logo Section */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{
                display: "flex",
                alignItems: "center",
                gap: "0.526875rem"
              }} >
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
            <Box>
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
                Select A Category
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
                Choose a category that best matches your services. This helps us connect you with the right clients.
              </Typography>

              {/* Category Dropdown */}
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "1.0625rem",
                  lineHeight: "1.25rem",
                  color: "#424242",
                  mb: "0.5rem"
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

                    const cat = categories.find(
                      (c) => normalizeCategoryValue(c.category_name) === selected || c.id === selected
                    );

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

                    const iconKey = getCategoryIconKey(cat.category_name);

                    return (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.875rem", // 14px
                        }}
                      >
                        <CategoryIcon category={iconKey} isSelected={true} />
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: "1.125rem",
                            lineHeight: "140%",
                            letterSpacing: "0%",
                            color: "primary.normal",
                          }}
                        >
                          {cat.category_name}
                        </Typography>
                      </Box>
                    );
                  }}
                  sx={{
                    mb: 2,
                  }}
                  disabled={loading}
                >
                  {loading && (
                    <MenuItem disabled>
                      <Box sx={{ display: "flex", justifyContent: "center", width: "100%", py: 2 }}>
                        <CircularProgress size={24} />
                      </Box>
                    </MenuItem>
                  )}
                  {error && (
                    <MenuItem disabled>
                      <Typography color="error" sx={{ py: 1 }}>
                        {error}
                      </Typography>
                    </MenuItem>
                  )}
                  {!loading && !error && categories.length === 0 && (
                    <MenuItem disabled>
                      <Typography sx={{ py: 1, color: "text.secondary" }}>
                        No categories available
                      </Typography>
                    </MenuItem>
                  )}
                  {!loading &&
                    categories.map((cat) => {
                      const categoryValue = normalizeCategoryValue(cat.category_name);
                      const isSelected = selectedCategory === categoryValue || selectedCategory === cat.id;
                      const iconKey = getCategoryIconKey(cat.category_name);

                      return (
                        <MenuItem
                          key={cat.id}
                          value={categoryValue}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontWeight: 400,
                            fontSize: "1rem",
                            lineHeight: "140%",
                            letterSpacing: "0%",
                            color: isSelected ? "primary.normal" : "#424242",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.875rem", // 14px
                            }}
                          >
                            <CategoryIcon
                              category={iconKey}
                              isSelected={isSelected}
                            />
                            <Typography
                              sx={{
                                fontWeight: 400,
                                fontSize: "1rem", // 16px
                                lineHeight: "150%",
                                letterSpacing: "0%",
                                color: isSelected
                                  ? "primary.normal"
                                  : "#424242",
                              }}
                            >
                              {cat.category_name}
                            </Typography>
                          </Box>
                          <Radio
                            checked={isSelected}
                            sx={{
                              color: "#C1C1C1",
                              "&.Mui-checked": {
                                color: "primary.normal",
                              },
                            }}
                          />
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>

              {/* Service Selection */}
              {selectedCategory && (() => {
                // Find the category from API to get the category name
                const apiCategory = categories.find(
                  (c) =>
                    normalizeCategoryValue(c.category_name) === selectedCategory ||
                    c.id === selectedCategory
                );
                const serviceKey = apiCategory
                  ? getServiceKey(apiCategory.category_name)
                  : selectedCategory;
                const categoryServices = services[serviceKey] || [];

                return categoryServices.length > 0 ? (
                  <Box sx={{ mb: 3 }}>
                    {categoryServices.map((service) => (
                      <Paper
                        key={service.id}
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
                          bgcolor:
                            selectedServices[selectedCategory]?.includes(
                              service.id
                            ) ?? false
                              ? "#f9fafb"
                              : "white",
                          "&:hover": {
                            bgcolor: "#f9fafb",
                          },
                        }}
                        onClick={() => handleServiceToggle(service.id)}
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
                          }}
                        >
                          <Image
                            src={service.image}
                            alt={service.name}
                            fill
                            style={{ objectFit: "cover" }}
                          />
                        </Box>
                        <Typography
                          sx={{
                            flex: 1,
                            fontWeight: 600,
                            fontSize: "1.125rem",
                            lineHeight: "1.25rem",
                            letterSpacing: "0%",
                            color: "#323232",
                            ml: "0.875rem", // 14px
                          }}
                        >
                          {service.name}
                        </Typography>
                        <Checkbox
                          checked={
                            selectedServices[selectedCategory]?.includes(
                              service.id
                            ) ?? false
                          }
                          sx={{
                            color: "#d1d5db",
                            "&.Mui-checked": {
                              color: "#2F6B8E",
                            },
                          }}
                        />
                      </Paper>
                    ))}
                  </Box>
                ) : null;
              })()}

              {/* Selected Services Display - across all categories */}
              {Object.values(selectedServices).some(
                (servicesForCategory) =>
                  servicesForCategory && servicesForCategory.length > 0
              ) && (
                <Box sx={{ mb: 4 }}>
                  <Divider sx={{ my: "2rem", borderColor: "#EBEBEB" }} />

                  {Object.keys(selectedServices)
                    .filter(
                      (cat) =>
                        selectedServices[cat] &&
                        selectedServices[cat].length > 0
                    )
                    .map((cat) => (
                      <Box key={cat} sx={{ mb: 3 }}>
                        <Box
                          sx={{
                            mb: 2,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.875rem", // 14px
                            bgcolor: "white",
                            border: "1px solid #2C6587",
                            borderRadius: "0.625rem", // 10px
                            px: "12px",
                            py: "10px",
                          }}
                        >
                          <CategoryIcon
                            category={getCategoryIconKey(
                              categories.find(
                                (c) =>
                                  normalizeCategoryValue(c.category_name) === cat ||
                                  c.id === cat
                              )?.category_name || cat
                            )}
                            isSelected={true}
                          />
                          <Typography
                            sx={{
                              fontWeight: 600,
                              fontSize: "1rem", // 16px
                              lineHeight: "150%",
                              letterSpacing: "0%",
                              color: "#2C6587",
                            }}
                          >
                            {
                              categories.find(
                                (c) =>
                                  normalizeCategoryValue(c.category_name) === cat ||
                                  c.id === cat
                              )?.category_name || cat
                            }
                          </Typography>
                        </Box>

                        {(() => {
                          // Map category key to service key
                          const apiCategory = categories.find(
                            (c) =>
                              normalizeCategoryValue(c.category_name) === cat ||
                              c.id === cat
                          );
                          const serviceKey = apiCategory
                            ? getServiceKey(apiCategory.category_name)
                            : cat;
                          const categoryServices = services[serviceKey] || [];
                          const filteredServices = categoryServices.filter((service) =>
                            selectedServices[cat]?.includes(service.id)
                          );

                          return filteredServices.map((service) => (
                            <Paper
                              key={service.id}
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
                                }}
                              >
                                <Image
                                  src={service.image}
                                  alt={service.name}
                                  fill
                                  style={{ objectFit: "cover" }}
                                />
                              </Box>
                              <Typography
                                sx={{
                                  flex: 1,
                                  fontWeight: 600,
                                  fontSize: "1.125rem",
                                  lineHeight: "1.25rem",
                                  letterSpacing: "0%",
                                  color: "#323232",
                                  ml: "0.875rem", // 14px
                                }}
                              >
                                {service.name}
                              </Typography>
                              <IconButton
                                onClick={() => handleRemoveService(cat, service.id)}
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
                    ))}
                </Box>
              )}

              {/* Buttons */}
              <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={handleSkip}
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
                    )
                  }
                  sx={{
                    bgcolor: "primary.dark",
                    color: "white",
                    py: 1.5,
                    textTransform: "none",
                    fontSize: "1rem",
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
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
