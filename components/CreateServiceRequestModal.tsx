"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
  LinearProgress,
  Button,
  Radio,
  RadioProps,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Card,
  InputAdornment,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import { apiGet, apiPost, apiPostFormData } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";

interface CreateServiceRequestModalProps {
  open: boolean;
  onClose: () => void;
  preSelectedCategoryId?: string;
  preSelectedSubcategoryId?: string;
}

// Helper function to clone SVG and modify fill colors
const cloneElementWithColor = (
  element: React.ReactElement,
  isSelected: boolean,
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
          React.isValidElement(c) ? cloneWithFill(c, idx) : c,
        );
      } else if (React.isValidElement(child.props.children)) {
        newProps.children = cloneWithFill(child.props.children);
      } else if (child.props.children) {
        newProps.children = React.Children.map(
          child.props.children,
          (c: any, idx: number) =>
            React.isValidElement(c) ? cloneWithFill(c, idx) : c,
        );
      }
    }

    return React.cloneElement(child, newProps);
  };

  return cloneWithFill(element) as React.ReactElement;
};

// SVG Icon Components - Simplified version (you can copy the full icons from BookServiceModal if needed)
const CategoryIcon = ({
  category,
  isSelected,
}: {
  category: string;
  isSelected: boolean;
}) => {
  // For now, return a simple icon - you can copy the full icon set from BookServiceModal
  return (
    <Box
      sx={{
        width: 24,
        height: 24,
        bgcolor: isSelected ? "#2C6587" : "#C1C1C1",
        borderRadius: 1,
      }}
    />
  );
};

// Custom bullet radio icons using Material-UI Box and styling
const BulletRadio = (props: RadioProps) => {
  return (
    <Radio
      {...props}
      disableRipple
      icon={
        <Box
          sx={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            border: "2px solid #C5D3DC",
            bgcolor: "#FFFFFF",
            boxShadow: "0px 4px 10px rgba(44, 101, 135, 0.12)",
          }}
        />
      }
      checkedIcon={
        <Box
          sx={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            bgcolor: "#2C6587",
            boxShadow: "0px 4px 12px rgba(44, 101, 135, 0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: "#FFFFFF",
            }}
          />
        </Box>
      }
      sx={{
        p: 0.5,
        "&:hover": { backgroundColor: "transparent" },
      }}
    />
  );
};

// Steps: Professional/Non-professional, then Service Description, Valuation, and Preview
const steps = [
  { id: 1, title: "Select Your Service Provider", progress: 25 },
  { id: 2, title: "Describe About Service", progress: 50 },
  { id: 3, title: "Valuation of Job", progress: 75 },
  { id: 4, title: "Preview", progress: 100 },
];

export default function CreateServiceRequestModal({
  open,
  onClose,
  preSelectedCategoryId,
  preSelectedSubcategoryId,
}: CreateServiceRequestModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [serviceProvider, setServiceProvider] = useState("professional");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [serviceDescription, setServiceDescription] = useState("");
  const [valuation, setValuation] = useState("");
  const [selectedDate, setSelectedDate] = useState<number>(
    new Date().getDate(),
  );
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedTime, setSelectedTime] = useState({
    hour: "10",
    minute: "00",
    period: "AM",
  });
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [descriptionFiles, setDescriptionFiles] = useState<File[]>([]);
  const [barterPhotoFiles, setBarterPhotoFiles] = useState<File[]>([]);
  const [descriptionFilePreviews, setDescriptionFilePreviews] = useState<
    (string | null)[]
  >([]);
  const [barterPhotoFilePreviews, setBarterPhotoFilePreviews] = useState<
    (string | null)[]
  >([]);
  const [uploading, setUploading] = useState(false);
  const [categoryId, setCategoryId] = useState<string>("");
  const [subCategoryId, setSubCategoryId] = useState<string>("");
  const [apiCategories, setApiCategories] = useState<
    Array<{
      id: string;
      category_name: string;
      category_logo: string;
    }>
  >([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [subcategories, setSubcategories] = useState<
    Array<{
      id: string;
      subcategory_name: string;
      image: string | null;
    }>
  >([]);
  const [subcategoriesLoading, setSubcategoriesLoading] = useState(false);
  const wasOpenRef = React.useRef(open);

  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true);
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
        setApiCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  // Fetch subcategories for selected category
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
        setSubcategories(response.data.data.subcategories || []);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubcategories([]);
    } finally {
      setSubcategoriesLoading(false);
    }
  }, []);

  // Fetch categories on mount
  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open, fetchCategories]);

  // Auto-select category and subcategory when props are provided
  useEffect(() => {
    if (open && preSelectedCategoryId) {
      // Set the category
      setSelectedCategory(preSelectedCategoryId);
      setCategoryId(preSelectedCategoryId);

      // Fetch subcategories for the pre-selected category
      fetchSubcategories(preSelectedCategoryId).then(() => {
        // After subcategories are loaded, select the subcategory if provided
        if (preSelectedSubcategoryId) {
          setSelectedService(preSelectedSubcategoryId);
          setSubCategoryId(preSelectedSubcategoryId);

          // Skip to step 1 if both category and subcategory are pre-selected
          setCurrentStep(1);
        }
      });
    }
  }, [
    open,
    preSelectedCategoryId,
    preSelectedSubcategoryId,
    fetchSubcategories,
  ]);

  // Reset all form state to initial values
  const resetForm = useCallback(() => {
    // Clean up preview URLs using functional setState to access current values
    setDescriptionFilePreviews((prev) => {
      prev.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
      return [];
    });
    setBarterPhotoFilePreviews((prev) => {
      prev.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
      return [];
    });

    setCurrentStep(1);
    setServiceProvider("professional");
    setSelectedCategory("");
    setSelectedService(null);
    setServiceDescription("");
    setValuation("");
    setSelectedDate(new Date().getDate());
    setCurrentMonth(new Date().getMonth());
    setCurrentYear(new Date().getFullYear());
    setSelectedTime({ hour: "10", minute: "00", period: "AM" });
    setProductName("");
    setQuantity(1);
    setShowSuccess(false);
    setDescriptionFiles([]);
    setBarterPhotoFiles([]);
    setCategoryId("");
    setSubCategoryId("");
    setSubcategories([]);
  }, []);

  // Reset form when modal is closed
  // useEffect(() => {
  //   if (!open) {
  //     resetForm();
  //   }
  // }, [open, resetForm]);
  useEffect(() => {
    if (wasOpenRef.current && !open) {
      resetForm();
    }
    wasOpenRef.current = open;
  }, [open, resetForm]);

  // Recreate preview URLs if files exist but previews are missing
  useEffect(() => {
    if (descriptionFiles.length === 0) {
      // Clean up all previews if no files
      setDescriptionFilePreviews((prev) => {
        if (prev.length === 0) return prev; // No change needed
        prev.forEach((preview) => {
          if (preview) URL.revokeObjectURL(preview);
        });
        return [];
      });
      return;
    }

    setDescriptionFilePreviews((prev) => {
      // Start with existing previews, extend array if needed
      const newPreviews: (string | null)[] = [...prev];
      let hasChanges = false;

      // Ensure array length matches files array
      while (newPreviews.length < descriptionFiles.length) {
        newPreviews.push(null);
      }

      // Process each file
      descriptionFiles.forEach((file, index) => {
        if (file && file.type.startsWith("image/")) {
          const existingPreview = newPreviews[index];

          // Only create preview if it doesn't exist
          if (!existingPreview) {
            const previewURL = URL.createObjectURL(file);
            newPreviews[index] = previewURL;
            hasChanges = true;
          }
          // If preview exists, keep it as is
        } else {
          // Clear preview if file doesn't exist or is not an image
          const existingPreview = newPreviews[index];
          if (existingPreview) {
            URL.revokeObjectURL(existingPreview);
            newPreviews[index] = null;
            hasChanges = true;
          }
        }
      });

      // Clean up previews for indices that no longer have files
      if (newPreviews.length > descriptionFiles.length) {
        for (
          let index = descriptionFiles.length;
          index < newPreviews.length;
          index++
        ) {
          if (newPreviews[index]) {
            URL.revokeObjectURL(newPreviews[index]!);
            hasChanges = true;
          }
        }
        newPreviews.splice(descriptionFiles.length);
      }

      return hasChanges ? newPreviews : prev;
    });
  }, [descriptionFiles]);

  // Recreate previews when coming back to step 2 or preview steps (where images are displayed)
  useEffect(() => {
    if (
      (currentStep === 2 || currentStep === 4 || currentStep === 5) &&
      descriptionFiles.length > 0
    ) {
      setDescriptionFilePreviews((prev) => {
        // Clean up all old previews first
        prev.forEach((preview) => {
          if (preview) URL.revokeObjectURL(preview);
        });

        // Create fresh previews for all image files
        const newPreviews: (string | null)[] = [];
        descriptionFiles.forEach((file) => {
          if (file && file.type.startsWith("image/")) {
            const previewURL = URL.createObjectURL(file);
            newPreviews.push(previewURL);
          } else {
            newPreviews.push(null);
          }
        });

        return newPreviews;
      });
    }
  }, [currentStep, descriptionFiles.length]);

  useEffect(() => {
    if (barterPhotoFiles.length === 0) {
      // Clean up all previews if no files
      setBarterPhotoFilePreviews((prev) => {
        if (prev.length === 0) return prev; // No change needed
        prev.forEach((preview) => {
          if (preview) URL.revokeObjectURL(preview);
        });
        return [];
      });
      return;
    }

    setBarterPhotoFilePreviews((prev) => {
      // Start with existing previews, extend array if needed
      const newPreviews: (string | null)[] = [...prev];
      let hasChanges = false;

      // Ensure array length matches files array
      while (newPreviews.length < barterPhotoFiles.length) {
        newPreviews.push(null);
      }

      // Process each file
      barterPhotoFiles.forEach((file, index) => {
        if (file && file.type.startsWith("image/")) {
          const existingPreview = newPreviews[index];

          // Only create preview if it doesn't exist
          if (!existingPreview) {
            const previewURL = URL.createObjectURL(file);
            newPreviews[index] = previewURL;
            hasChanges = true;
          }
          // If preview exists, keep it as is
        } else {
          // Clear preview if file doesn't exist or is not an image
          const existingPreview = newPreviews[index];
          if (existingPreview) {
            URL.revokeObjectURL(existingPreview);
            newPreviews[index] = null;
            hasChanges = true;
          }
        }
      });

      // Clean up previews for indices that no longer have files
      if (newPreviews.length > barterPhotoFiles.length) {
        for (
          let index = barterPhotoFiles.length;
          index < newPreviews.length;
          index++
        ) {
          if (newPreviews[index]) {
            URL.revokeObjectURL(newPreviews[index]!);
            hasChanges = true;
          }
        }
        newPreviews.splice(barterPhotoFiles.length);
      }

      return hasChanges ? newPreviews : prev;
    });
  }, [barterPhotoFiles]);

  // Recreate previews when coming back to step 4/5 (where barter photos are displayed)
  useEffect(() => {
    if (
      (currentStep === 4 || currentStep === 5) &&
      barterPhotoFiles.length > 0
    ) {
      setBarterPhotoFilePreviews((prev) => {
        // Clean up all old previews first
        prev.forEach((preview) => {
          if (preview) URL.revokeObjectURL(preview);
        });

        // Create fresh previews for all image files
        const newPreviews: (string | null)[] = [];
        barterPhotoFiles.forEach((file) => {
          if (file && file.type.startsWith("image/")) {
            const previewURL = URL.createObjectURL(file);
            newPreviews.push(previewURL);
          } else {
            newPreviews.push(null);
          }
        });

        return newPreviews;
      });
    }
  }, [currentStep, barterPhotoFiles.length]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      descriptionFilePreviews.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
      barterPhotoFilePreviews.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [descriptionFilePreviews, barterPhotoFilePreviews]);

  // Auto-close success modal after 2 seconds
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        resetForm();
        onClose();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showSuccess, onClose, resetForm]);

  // Calculate progress based on current step
  const getProgress = () => {
    if (serviceProvider === "non-professional") {
      const totalSteps = 5;
      return Math.round((currentStep / totalSteps) * 100);
    } else {
      const totalSteps = 4;
      return Math.round((currentStep / totalSteps) * 100);
    }
  };

  const progress = getProgress();

  const handleNext = () => {
    const maxStep = serviceProvider === "non-professional" ? 5 : 4;
    if (currentStep < maxStep) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Upload a single file and return storage key
  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiPostFormData<{ storage_key: string }>(
        API_ENDPOINTS.SERVICE_REQUEST.UPLOAD_FILE,
        formData,
      );

      if (response.success && response.data?.storage_key) {
        return response.data.storage_key;
      }
      return null;
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  };

  // Upload multiple files and return array of storage keys
  const uploadFiles = async (
    files: File[],
  ): Promise<Array<{ storage_key: string }>> => {
    const uploadPromises = files.map((file) => uploadFile(file));
    const storageKeys = await Promise.all(uploadPromises);
    return storageKeys
      .filter((key): key is string => key !== null)
      .map((key) => ({ storage_key: key }));
  };

  // Format datetime for API (ISO 8601 format)
  const formatDateTime = (): string => {
    const date = new Date(
      currentYear,
      currentMonth,
      selectedDate,
      selectedTime.period === "AM"
        ? parseInt(selectedTime.hour) === 12
          ? 0
          : parseInt(selectedTime.hour)
        : parseInt(selectedTime.hour) === 12
          ? 12
          : parseInt(selectedTime.hour) + 12,
      parseInt(selectedTime.minute),
    );
    return date.toISOString();
  };

  const handleSubmit = async () => {
    if (!categoryId || !subCategoryId) {
      alert("Please select a category and service");
      return;
    }

    // Validate valuation for professional services
    if (
      serviceProvider === "professional" &&
      (!valuation || valuation.trim() === "")
    ) {
      alert("Please enter a valuation amount");
      return;
    }

    setUploading(true);
    try {
      const descriptionFileKeys = await uploadFiles(descriptionFiles);

      let barterPhotoKeys: Array<{ storage_key: string }> = [];
      if (
        serviceProvider === "non-professional" &&
        barterPhotoFiles.length > 0
      ) {
        barterPhotoKeys = await uploadFiles(barterPhotoFiles);
      }

      const isProfessional = serviceProvider === "professional";
      const chosenDateTime = formatDateTime();

      const requestBody: any = {
        is_professional: isProfessional,
        category_id: categoryId,
        sub_category_id: subCategoryId,
        description: serviceDescription,
        description_files: descriptionFileKeys,
        chosen_datetime: chosenDateTime,
      };

      if (isProfessional) {
        const validationAmount = parseFloat(valuation.replace(",", ""));
        const platformFees = validationAmount * 0.032;
        const tax = validationAmount * 0.072;

        requestBody.validation_amount = validationAmount;
        requestBody.platform_fees = parseFloat(platformFees.toFixed(2));
        requestBody.tax = parseFloat(tax.toFixed(2));
        requestBody.task_status = "open";
      } else {
        if (productName && barterPhotoKeys.length > 0) {
          requestBody.barter_product = {
            product_name: productName,
            quantity: quantity,
            barter_photo_files: barterPhotoKeys,
          };
        }
      }

      const response = await apiPost(
        API_ENDPOINTS.SERVICE_REQUEST.CREATE,
        requestBody,
      );

      if (response.success) {
        setShowSuccess(true);
      } else {
        alert(response.error?.message || "Failed to create service request");
      }
    } catch (error) {
      console.error("Error creating service request:", error);
      alert("An error occurred while creating the service request");
    } finally {
      setUploading(false);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    const category = apiCategories.find((c) => c.id === categoryId);
    if (category) {
      setSelectedCategory(categoryId);
      setCategoryId(categoryId);
      setSelectedService(null);
      setSubCategoryId("");
      setSubcategories([]);
      fetchSubcategories(categoryId);
    }
  };

  const handleServiceSelect = (subcategoryId: string) => {
    const subcategory = subcategories.find((s) => s.id === subcategoryId);
    if (subcategory) {
      setSelectedService(subcategoryId);
      setSubCategoryId(subcategoryId);
    }
  };

  const handleDescriptionFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview URL for images
      let previewURL: string | null = null;
      if (file.type.startsWith("image/")) {
        previewURL = URL.createObjectURL(file);
      }

      setDescriptionFiles((prev) => {
        const newFiles = [...prev];
        newFiles[index] = file;
        return newFiles;
      });

      setDescriptionFilePreviews((prev) => {
        const newPreviews = [...prev];
        // Clean up old preview URL if it exists
        if (newPreviews[index]) {
          URL.revokeObjectURL(newPreviews[index]!);
        }
        newPreviews[index] = previewURL;
        return newPreviews;
      });
    }
  };

  const handleBarterPhotoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview URL for images
      let previewURL: string | null = null;
      if (file.type.startsWith("image/")) {
        previewURL = URL.createObjectURL(file);
      }

      setBarterPhotoFiles((prev) => {
        const newFiles = [...prev];
        newFiles[index] = file;
        return newFiles;
      });

      setBarterPhotoFilePreviews((prev) => {
        const newPreviews = [...prev];
        // Clean up old preview URL if it exists
        if (newPreviews[index]) {
          URL.revokeObjectURL(newPreviews[index]!);
        }
        newPreviews[index] = previewURL;
        return newPreviews;
      });
    }
  };

  // Calendar helper functions
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const getMonthName = (month: number) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[month];
  };

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        // Step 1: Professional/Non-professional Selection
        return (
          <Box>
            <Typography
              sx={{
                color: "primary.normal",
                fontSize: "1.25rem",
                lineHeight: "2rem",
                fontWeight: 500,
              }}
            >
              {steps[0].title}
            </Typography>
            <Typography sx={{ mb: 3, color: "#939393", lineHeight: "150%" }}>
              To get started, please select a category. This will ensure we
              match you with the most suitable professional for your
              requirements.
            </Typography>
            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={serviceProvider}
                onChange={(e) => setServiceProvider(e.target.value)}
                sx={{ gap: 2 }}
              >
                <Box
                  sx={{
                    p: 2,
                    borderRadius: "0.75rem",
                    border: "0.0625rem solid",
                    borderColor:
                      serviceProvider === "professional"
                        ? "#2F6B8E"
                        : "grey.300",
                    bgcolor:
                      serviceProvider === "professional"
                        ? "rgba(47, 107, 142, 0.05)"
                        : "white",
                    cursor: "pointer",
                    "&:hover": {
                      borderColor: "#2F6B8E",
                    },
                  }}
                  onClick={() => setServiceProvider("professional")}
                >
                  <FormControlLabel
                    value="professional"
                    control={<BulletRadio />}
                    label="Professional"
                    labelPlacement="start"
                    sx={{
                      m: 0,
                      fontSize: "1.125rem",
                      fontWeight: 500,
                      color: "#2C6587",
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    p: 2,
                    border: "0.0625rem solid",
                    borderRadius: "0.75rem",
                    borderColor:
                      serviceProvider === "non-professional"
                        ? "#2F6B8E"
                        : "grey.300",
                    bgcolor:
                      serviceProvider === "non-professional"
                        ? "rgba(47, 107, 142, 0.05)"
                        : "white",
                    cursor: "pointer",
                    "&:hover": {
                      borderColor: "#2F6B8E",
                    },
                  }}
                  onClick={() => setServiceProvider("non-professional")}
                >
                  <FormControlLabel
                    value="non-professional"
                    control={<BulletRadio />}
                    label="Non-professional"
                    labelPlacement="start"
                    sx={{
                      fontSize: "1.125rem",
                      fontWeight: 500,
                      color: "#2C6587",
                      m: 0,
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  />
                </Box>
              </RadioGroup>
            </FormControl>
          </Box>
        );

      case 2:
        // Step 2: Service Description
        return (
          <Box>
            <Typography
              sx={{
                color: "primary.normal",
                fontSize: "1.25rem",
                lineHeight: "2rem",
                fontWeight: 500,
              }}
            >
              {steps[1].title}
            </Typography>
            <Typography sx={{ mb: 3, color: "#939393", lineHeight: "150%" }}>
              Great job! You&apos;ve selected your service. Now, please describe
              what you need so the professional can understand your request
              better.
            </Typography>

            {selectedCategory && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{
                    color: "#424242",
                    lineHeight: "20px",
                    fontSize: "1.125rem",
                    mb: "0.5rem",
                  }}
                >
                  Select a category
                </Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <Select
                    value={selectedCategory}
                    disabled
                    sx={{
                      "& .MuiSelect-select": {
                        color: "#2C6587 !important",
                      },
                      "& .MuiInputBase-input": {
                        color: "#2C6587 !important",
                      },
                      "&.Mui-disabled": {
                        "& .MuiSelect-select": {
                          color: "#2C6587 !important",
                          WebkitTextFillColor: "#2C6587",
                        },
                      },
                    }}
                  >
                    <MenuItem value={selectedCategory}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {(() => {
                          const cat = apiCategories.find(
                            (c) => c.id === selectedCategory,
                          );
                          if (cat?.category_logo) {
                            return (
                              <Image
                                src={cat.category_logo}
                                alt={cat.category_name}
                                width={24}
                                height={24}
                                style={{ objectFit: "contain" }}
                              />
                            );
                          }
                          return cat ? (
                            <CategoryIcon
                              category={cat.category_name.toLowerCase()}
                              isSelected={true}
                            />
                          ) : null;
                        })()}
                        <Typography
                          sx={{
                            color: "#2C6587",
                          }}
                        >
                          {
                            apiCategories.find((c) => c.id === selectedCategory)
                              ?.category_name
                          }
                        </Typography>
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
                {selectedService && (
                  <Card
                    sx={{
                      p: 2,
                      mb: 2,
                      border: "none",
                      bgcolor: "#F2F2F2",
                      borderRadius: "0.75rem",
                      boxShadow: "none",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: 1,
                          overflow: "hidden",
                          position: "relative",
                          bgcolor: "#FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {(() => {
                          const subcat = subcategories.find(
                            (s) => s.id === selectedService,
                          );
                          if (subcat?.image) {
                            return (
                              <Image
                                src={subcat.image}
                                alt={subcat.subcategory_name}
                                fill
                                style={{ objectFit: "cover" }}
                              />
                            );
                          }
                          return (
                            <Typography
                              sx={{
                                color: "text.secondary",
                                fontSize: "0.875rem",
                              }}
                            >
                              {subcat?.subcategory_name.charAt(0) || "?"}
                            </Typography>
                          );
                        })()}
                      </Box>
                      <Typography
                        variant="body1"
                        fontWeight="500"
                        sx={{ color: "primary.normal" }}
                      >
                        {
                          subcategories.find((s) => s.id === selectedService)
                            ?.subcategory_name
                        }
                      </Typography>
                    </Box>
                  </Card>
                )}
              </Box>
            )}

            <Box sx={{ mb: 3 }}>
              <Typography
                sx={{
                  mb: 1,
                  fontSize: "1.125rem",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  color: "#555555",
                }}
              >
                Enter Service description
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Enter description here..."
                value={serviceDescription}
                onChange={(e) => setServiceDescription(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "grey.300",
                    },
                    "&:hover fieldset": {
                      borderColor: "grey.400",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#2F6B8E",
                    },
                  },
                }}
              />
            </Box>

            <Typography
              sx={{
                mb: 1,
                fontSize: "1.125rem",
                lineHeight: "100%",
                letterSpacing: "0%",
                color: "#555555",
              }}
            >
              Upload Photos of a Job
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              {/* First Upload Box */}
              <Box
                component="label"
                htmlFor="description-file-0"
                sx={{
                  width: "100%",
                  height: "9rem",
                  border: "0.125rem dashed",
                  borderColor: descriptionFiles[0] ? "#2F6B8E" : "#D1D5DB",
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  bgcolor: "#FFFFFF",
                  position: "relative",
                  "&:hover": {
                    borderColor: "#9CA3AF",
                  },
                }}
              >
                <input
                  id="description-file-0"
                  type="file"
                  hidden
                  accept="image/*,video/*,.pdf"
                  onChange={(e) => handleDescriptionFileChange(e, 0)}
                />
                {descriptionFiles[0] ? (
                  descriptionFilePreviews[0] &&
                  descriptionFiles[0].type.startsWith("image/") ? (
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                      }}
                    >
                      <Image
                        src={descriptionFilePreviews[0]!}
                        alt="Preview"
                        fill
                        style={{ objectFit: "cover", borderRadius: "8px" }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 8,
                          left: 8,
                          right: 8,
                          bgcolor: "rgba(0,0,0,0.6)",
                          borderRadius: 1,
                          p: 0.5,
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="white"
                          sx={{ fontSize: "0.75rem", textAlign: "center" }}
                        >
                          {descriptionFiles[0].name.length > 20
                            ? `${descriptionFiles[0].name.substring(0, 20)}...`
                            : descriptionFiles[0].name}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <>
                      <Box sx={{ position: "relative", mb: 0.5 }}>
                        <Image
                          src="/icons/folder-upload-line.png"
                          alt="file uploaded"
                          width={24}
                          height={24}
                        />
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: "0.75rem",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#2F6B8E",
                          textAlign: "center",
                          px: 1,
                        }}
                      >
                        {descriptionFiles[0].name.length > 20
                          ? `${descriptionFiles[0].name.substring(0, 20)}...`
                          : descriptionFiles[0].name}
                      </Typography>
                    </>
                  )
                ) : (
                  <>
                    <Box sx={{ position: "relative", mb: 0.5 }}>
                      <Image
                        src="/icons/folder-upload-line.png"
                        alt="cloud upload"
                        width={24}
                        height={24}
                      />
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "0.75rem",
                        lineHeight: "100%",
                        letterSpacing: "0%",
                        color: "#818285",
                      }}
                    >
                      upload from device
                    </Typography>
                  </>
                )}
              </Box>

              {/* Second Upload Box */}
              <Box
                component="label"
                htmlFor="description-file-1"
                sx={{
                  width: "100%",
                  height: "9rem",
                  border: "0.125rem dashed",
                  borderColor: descriptionFiles[1] ? "#2F6B8E" : "#D1D5DB",
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  bgcolor: "#FFFFFF",
                  position: "relative",
                  "&:hover": {
                    borderColor: "#9CA3AF",
                  },
                }}
              >
                <input
                  id="description-file-1"
                  type="file"
                  hidden
                  accept="image/*,video/*,.pdf"
                  onChange={(e) => handleDescriptionFileChange(e, 1)}
                />
                {descriptionFiles[1] ? (
                  descriptionFilePreviews[1] &&
                  descriptionFiles[1].type.startsWith("image/") ? (
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                      }}
                    >
                      <Image
                        src={descriptionFilePreviews[1]!}
                        alt="Preview"
                        fill
                        style={{ objectFit: "cover", borderRadius: "8px" }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 8,
                          left: 8,
                          right: 8,
                          bgcolor: "rgba(0,0,0,0.6)",
                          borderRadius: 1,
                          p: 0.5,
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="white"
                          sx={{ fontSize: "0.75rem", textAlign: "center" }}
                        >
                          {descriptionFiles[1].name.length > 20
                            ? `${descriptionFiles[1].name.substring(0, 20)}...`
                            : descriptionFiles[1].name}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <>
                      <Box sx={{ position: "relative", mb: 0.5 }}>
                        <Image
                          src="/icons/folder-upload-line.png"
                          alt="file uploaded"
                          width={24}
                          height={24}
                        />
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: "0.75rem",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#2F6B8E",
                          textAlign: "center",
                          px: 1,
                        }}
                      >
                        {descriptionFiles[1].name.length > 20
                          ? `${descriptionFiles[1].name.substring(0, 20)}...`
                          : descriptionFiles[1].name}
                      </Typography>
                    </>
                  )
                ) : (
                  <>
                    <Box sx={{ position: "relative", mb: 0.5 }}>
                      <Image
                        src="/icons/folder-upload-line.png"
                        alt="cloud upload"
                        width={24}
                        height={24}
                      />
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "0.75rem",
                        lineHeight: "100%",
                        letterSpacing: "0%",
                        color: "#818285",
                      }}
                    >
                      upload from device
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 500,
                fontSize: "1rem",
                lineHeight: "150%",
                letterSpacing: "0%",
                color: "#939393",
              }}
            >
              Please upload photos of the job so the worker can understand the
              task better. <br /> (You can also upload a video)
            </Typography>
          </Box>
        );

      case 3:
        // Step 3: Valuation/Date & Time
        return (
          <Box>
            <Typography
              sx={{
                color: "primary.normal",
                fontSize: "1.25rem",
                lineHeight: "2rem",
                fontWeight: 500,
              }}
            >
              {steps[2].title}
            </Typography>
            <Typography sx={{ mb: 3, color: "#939393", lineHeight: "150%" }}>
              {serviceProvider === "professional"
                ? "Great, you're almost done. Please add the job valuation."
                : "Great, you're almost done. Please choose the date and time for your service."}
            </Typography>

            {serviceProvider === "professional" && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{
                    mb: 1,
                    fontSize: "1.125rem",
                    lineHeight: "100%",
                    letterSpacing: "0%",
                    color: "#555555",
                  }}
                >
                  Enter Valuation
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter amount"
                  value={valuation ? `€ ${valuation}` : "€ "}
                  onChange={(e) => {
                    let raw = e.target.value.replace("€", "").trim();

                    // Remove commas
                    raw = raw.replace(/,/g, "");

                    // Allow only digits and one decimal
                    raw = raw.replace(/[^0-9.]/g, "");

                    // Prevent multiple decimals
                    const parts = raw.split(".");
                    if (parts.length > 2) {
                      raw = parts[0] + "." + parts[1];
                    }

                    // Limit decimal places to 2
                    if (parts[1] && parts[1].length > 2) {
                      return;
                    }

                    // Limit integer digits
                    const integerPart = raw.split(".")[0];
                    if (integerPart.length > 9) {
                      return;
                    }

                    const numericValue = Number(raw);

                    if (raw !== "" && numericValue < 1) {
                      return;
                    }

                    if (numericValue > 999999999) {
                      return;
                    }

                    setValuation(raw);
                  }}
                  onBlur={() => {
                    if (!valuation || Number(valuation) < 1) {
                      setValuation("");
                    }
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "grey.300",
                      },
                      "&:hover fieldset": {
                        borderColor: "grey.400",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#2F6B8E",
                      },
                    },
                  }}
                />
              </Box>
            )}

            {/* Date and Time pickers - simplified for brevity */}
            <Typography
              sx={{
                mb: 1,
                fontSize: "1.125rem",
                lineHeight: "100%",
                letterSpacing: "0%",
                color: "#555555",
              }}
            >
              Choose Date
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  bgcolor: "#FBFBFB",
                  border: "none",
                  borderRadius: "1.125rem",
                  pt: "0.375rem",
                  pb: "0.375rem",
                  px: 2,
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <IconButton size="small" onClick={handlePreviousMonth}>
                    <ArrowBackIosIcon fontSize="small" />
                  </IconButton>
                  <Typography
                    sx={{
                      fontSize: "1.125rem",
                      lineHeight: "100%",
                      letterSpacing: "0%",
                      color: "primary.normal",
                    }}
                  >
                    {getMonthName(currentMonth)} {currentYear}
                  </Typography>
                  <IconButton size="small" onClick={handleNextMonth}>
                    <ArrowForwardIosIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              <Box
                sx={{
                  bgcolor: "#FBFBFB",
                  border: "none",
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: 1,
                    justifyContent: "center",
                  }}
                >
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <Box
                        key={day}
                        sx={{
                          width: 32,
                          height: 32,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "auto",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.75rem",
                            lineHeight: "1.125rem",
                            letterSpacing: "0%",
                            textAlign: "center",
                            color: "primary.normal",
                          }}
                        >
                          {day}
                        </Typography>
                      </Box>
                    ),
                  )}
                  {Array.from(
                    { length: getFirstDayOfMonth(currentMonth, currentYear) },
                    (_, i) => (
                      <Box key={`empty-${i}`} sx={{ width: 32, height: 32 }} />
                    ),
                  )}
                  {Array.from(
                    { length: getDaysInMonth(currentMonth, currentYear) },
                    (_, i) => {
                      const day = i + 1;

                      const dayString = day.toString();

                      // 1. Create a date object for the day being rendered
                      const dateBeingRendered = new Date(
                        currentYear,
                        currentMonth,
                        day,
                      );

                      // 2. Get today's date (set time to 00:00:00 for accurate comparison)
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);

                      // 3. Determine if the date is in the past
                      const isPast = dateBeingRendered < today;
                      const isSelected = selectedDate === day;

                      return (
                        <Box
                          key={day}
                          // 4. Only trigger onClick if it's NOT a past date
                          onClick={() => !isPast && setSelectedDate(day)}
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            margin: "auto",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            // 5. Update styles based on isPast
                            cursor: isPast ? "default" : "pointer",
                            opacity: isPast ? 0.4 : 1, // Visual cue for disabled state
                            bgcolor: isSelected ? "#2F6B8E" : "transparent",
                            color: isSelected ? "white" : "text.primary",
                            "&:hover": {
                              bgcolor: isPast
                                ? "transparent"
                                : isSelected
                                  ? "#2F6B8E"
                                  : "grey.100",
                            },
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "0.875rem",
                              lineHeight: "1.125rem",
                              color: isSelected ? "white" : "#323232",
                            }}
                          >
                            {day}
                          </Typography>
                        </Box>
                      );
                    },
                  )}
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                my: 3,
              }}
            >
              <Box
                sx={{
                  width: "80%",
                  height: "0.0625rem",
                  bgcolor: "grey.300",
                }}
              />
            </Box>

            <Typography
              sx={{
                mb: 1,
                fontSize: "1.125rem",
                lineHeight: "100%",
                letterSpacing: "0%",
                color: "#555555",
              }}
            >
              Choose Time
            </Typography>
            {/* Time picker - simplified version */}
            <Box
              sx={{
                border: "none",
                borderRadius: 2,
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "2.625rem",
                bgcolor: "#FBFBFB",
                boxShadow: "none",
              }}
            >
              {/* Hour, Minute, AM/PM selectors - you can copy the full implementation from BookServiceModal */}
              <TextField
                value={selectedTime.hour}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  if (value === "") {
                    setSelectedTime({ ...selectedTime, hour: "" });
                  } else {
                    value = value.slice(0, 2);
                    const numValue = parseInt(value);
                    if (numValue >= 1 && numValue <= 12) {
                      setSelectedTime({ ...selectedTime, hour: value });
                    }
                  }
                }}
                sx={{ width: "3rem" }}
              />
              <Typography>:</Typography>
              <TextField
                value={selectedTime.minute}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  if (value === "") {
                    setSelectedTime({ ...selectedTime, minute: "" });
                  } else {
                    value = value.slice(0, 2);
                    const numValue = parseInt(value);
                    if (numValue >= 0 && numValue <= 59) {
                      setSelectedTime({ ...selectedTime, minute: value });
                    }
                  }
                }}
                sx={{ width: "3rem" }}
              />
              <Box sx={{ display: "flex", gap: 2 }}>
                <Typography
                  onClick={() =>
                    setSelectedTime({ ...selectedTime, period: "AM" })
                  }
                  sx={{
                    cursor: "pointer",
                    color:
                      selectedTime.period === "AM"
                        ? "primary.normal"
                        : "#D5D5D5",
                  }}
                >
                  AM
                </Typography>
                <Typography
                  onClick={() =>
                    setSelectedTime({ ...selectedTime, period: "PM" })
                  }
                  sx={{
                    cursor: "pointer",
                    color:
                      selectedTime.period === "PM"
                        ? "primary.normal"
                        : "#D5D5D5",
                  }}
                >
                  PM
                </Typography>
              </Box>
            </Box>
          </Box>
        );

      case 4:
        // Step 4: Barter Product (if non-professional) or Preview (if professional)
        if (serviceProvider === "non-professional") {
          return (
            <Box>
              <Typography
                sx={{
                  color: "primary.normal",
                  fontSize: "1.25rem",
                  lineHeight: "2rem",
                  fontWeight: 500,
                }}
              >
                Barter Product Details
              </Typography>
              <Typography sx={{ mb: 3, color: "#939393", lineHeight: "150%" }}>
                Add details of the product or thing you want to offer in
                exchange for the service.
              </Typography>

              <Typography
                sx={{
                  mb: 1,
                  fontSize: "1.125rem",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  color: "#555555",
                }}
              >
                Add Product Name
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter Name"
                value={productName}
                onChange={(e) => {
                  let value = e.target.value;

                  // Block input if it's only spaces
                  if (value.trim() === "" && value.length > 0) {
                    setProductName("");
                    return;
                  }

                  // Remove leading spaces only
                  value = value.replace(/^\s+/, "");

                  setProductName(value);
                }}
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "grey.300",
                    },
                    "&:hover fieldset": {
                      borderColor: "grey.400",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#2F6B8E",
                    },
                  },
                }}
              />

              <Typography
                sx={{
                  mb: 1,
                  fontSize: "1.125rem",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  color: "#555555",
                }}
              >
                Quantity
              </Typography>
              <TextField
                value={quantity}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    setQuantity(1);
                    return;
                  }
                  const numValue = Number(value);
                  if (!isNaN(numValue) && numValue >= 1) {
                    // Get the number of digits (excluding decimal point)
                    const digitCount = Math.floor(numValue).toString().length;
                    // Allow values with 7-8 digits, or values less than 7 digits (for typing)
                    if (digitCount <= 8) {
                      const clampedValue = Math.max(
                        1,
                        Math.min(99999999, Math.floor(numValue)),
                      );
                      setQuantity(clampedValue);
                    }
                    // If more than 8 digits, don't update (keep current value)
                  }
                }}
                onBlur={(e) => {
                  // Enforce max limit of 8 digits when field loses focus
                  if (quantity > 99999999) {
                    setQuantity(99999999);
                  }
                }}
                inputProps={{
                  type: "number",
                  min: 1,
                  max: 99999999,
                  style: {
                    MozAppearance: "textfield",
                  },
                }}
                sx={{
                  mb: 3,
                  "& input[type=number]": {
                    MozAppearance: "textfield",
                  },
                  "& input[type=number]::-webkit-outer-spin-button": {
                    WebkitAppearance: "none",
                    margin: 0,
                  },
                  "& input[type=number]::-webkit-inner-spin-button": {
                    WebkitAppearance: "none",
                    margin: 0,
                  },
                }}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Box sx={{ display: "flex", flexDirection: "row" }}>
                        <IconButton
                          sx={{
                            "&:hover": {
                              bgcolor: "transparent",
                            },
                          }}
                          size="large"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                          <Typography
                            sx={{ fontSize: "2rem", color: "#343330" }}
                          >
                            -
                          </Typography>
                        </IconButton>
                        <IconButton
                          sx={{
                            "&:hover": {
                              bgcolor: "transparent",
                            },
                          }}
                          size="large"
                          onClick={() =>
                            setQuantity(Math.min(99999999, quantity + 1))
                          }
                        >
                          <Typography
                            sx={{ fontSize: "2rem", color: "#343330" }}
                          >
                            +
                          </Typography>
                        </IconButton>
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />

              <Typography
                sx={{
                  mb: 1,
                  fontSize: "1.125rem",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  color: "#555555",
                }}
              >
                Upload Photos of Product
              </Typography>
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                {/* First Barter Photo Upload Box */}
                <Box
                  component="label"
                  htmlFor="barter-photo-0"
                  sx={{
                    width: "100%",
                    height: "9rem",
                    border: "0.125rem dashed",
                    borderColor: barterPhotoFiles[0] ? "#2F6B8E" : "#D1D5DB",
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    bgcolor: "#FFFFFF",
                    position: "relative",
                    "&:hover": {
                      borderColor: "#9CA3AF",
                    },
                  }}
                >
                  <input
                    id="barter-photo-0"
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleBarterPhotoChange(e, 0)}
                  />
                  {barterPhotoFiles[0] ? (
                    barterPhotoFilePreviews[0] ? (
                      <Box
                        sx={{
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                        }}
                      >
                        <Image
                          src={barterPhotoFilePreviews[0]!}
                          alt="Preview"
                          fill
                          style={{ objectFit: "cover", borderRadius: "8px" }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 8,
                            left: 8,
                            right: 8,
                            bgcolor: "rgba(0,0,0,0.6)",
                            borderRadius: 1,
                            p: 0.5,
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="white"
                            sx={{ fontSize: "0.75rem", textAlign: "center" }}
                          >
                            {barterPhotoFiles[0].name.length > 20
                              ? `${barterPhotoFiles[0].name.substring(
                                  0,
                                  20,
                                )}...`
                              : barterPhotoFiles[0].name}
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <>
                        <Box sx={{ position: "relative", mb: 0.5 }}>
                          <Image
                            src="/icons/folder-upload-line.png"
                            alt="file uploaded"
                            width={24}
                            height={24}
                          />
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 300,
                            fontSize: "0.75rem",
                            lineHeight: "100%",
                            letterSpacing: "0%",
                            color: "#2F6B8E",
                            textAlign: "center",
                            px: 1,
                          }}
                        >
                          {barterPhotoFiles[0].name.length > 20
                            ? `${barterPhotoFiles[0].name.substring(0, 20)}...`
                            : barterPhotoFiles[0].name}
                        </Typography>
                      </>
                    )
                  ) : (
                    <>
                      <Box sx={{ position: "relative", mb: 0.5 }}>
                        <Image
                          src="/icons/folder-upload-line.png"
                          alt="cloud upload"
                          width={24}
                          height={24}
                        />
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 300,
                          fontSize: "0.75rem",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#818285",
                        }}
                      >
                        upload from device
                      </Typography>
                    </>
                  )}
                </Box>

                {/* Second Barter Photo Upload Box */}
                <Box
                  component="label"
                  htmlFor="barter-photo-1"
                  sx={{
                    width: "100%",
                    height: "9rem",
                    border: "0.125rem dashed",
                    borderColor: barterPhotoFiles[1] ? "#2F6B8E" : "#D1D5DB",
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    bgcolor: "#FFFFFF",
                    position: "relative",
                    "&:hover": {
                      borderColor: "#9CA3AF",
                    },
                  }}
                >
                  <input
                    id="barter-photo-1"
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleBarterPhotoChange(e, 1)}
                  />
                  {barterPhotoFiles[1] ? (
                    barterPhotoFilePreviews[1] ? (
                      <Box
                        sx={{
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                        }}
                      >
                        <Image
                          src={barterPhotoFilePreviews[1]!}
                          alt="Preview"
                          fill
                          style={{ objectFit: "cover", borderRadius: "8px" }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 8,
                            left: 8,
                            right: 8,
                            bgcolor: "rgba(0,0,0,0.6)",
                            borderRadius: 1,
                            p: 0.5,
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="white"
                            sx={{ fontSize: "0.75rem", textAlign: "center" }}
                          >
                            {barterPhotoFiles[1].name.length > 20
                              ? `${barterPhotoFiles[1].name.substring(
                                  0,
                                  20,
                                )}...`
                              : barterPhotoFiles[1].name}
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <>
                        <Box sx={{ position: "relative", mb: 0.5 }}>
                          <Image
                            src="/icons/folder-upload-line.png"
                            alt="file uploaded"
                            width={24}
                            height={24}
                          />
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 300,
                            fontSize: "0.75rem",
                            lineHeight: "100%",
                            letterSpacing: "0%",
                            color: "#2F6B8E",
                            textAlign: "center",
                            px: 1,
                          }}
                        >
                          {barterPhotoFiles[1].name.length > 20
                            ? `${barterPhotoFiles[1].name.substring(0, 20)}...`
                            : barterPhotoFiles[1].name}
                        </Typography>
                      </>
                    )
                  ) : (
                    <>
                      <Box sx={{ position: "relative", mb: 0.5 }}>
                        <Image
                          src="/icons/folder-upload-line.png"
                          alt="cloud upload"
                          width={24}
                          height={24}
                        />
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 300,
                          fontSize: "0.75rem",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#818285",
                        }}
                      >
                        upload from device
                      </Typography>
                    </>
                  )}
                </Box>
              </Box>
            </Box>
          );
        }
        // For professional, show Preview
        return renderPreviewStep();

      case 5:
        // Step 5: Preview (for non-professional)
        return renderPreviewStep();

      default:
        return null;
    }
  };

  const renderPreviewStep = () => {
    return (
      <Box>
        <Typography sx={{ mb: 3, color: "#939393", lineHeight: "150%" }}>
          Well done! You&apos;ve completed all the steps. Please review the
          preview and edit any details if needed.
        </Typography>

        <Typography
          sx={{
            mb: 2,
            fontSize: "1.5rem",
            lineHeight: "100%",
            letterSpacing: "0%",
            color: "#2C6587",
            fontWeight: 600,
          }}
        >
          {apiCategories.find((c) => c.id === selectedCategory)?.category_name}{" "}
          Service
        </Typography>
        {/* Preview content - simplified, you can copy full implementation from BookServiceModal */}
        <Box
          sx={{
            backgroundColor: "#EAF0F3",
            position: "relative",
            width: "100%",
            height: 230,
            borderRadius: 2,
            overflow: "hidden",
            mb: 3,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              flex: "1 1 0%",
              position: "relative",
              width: "100%",
              height: "80%",
              overflow: "hidden",
            }}
          >
            <Image
              src={
                subcategories.find((s) => s.id === selectedService)?.image ||
                "/image/service-image-5.png"
              }
              alt="Service Preview"
              width={800}
              height={600}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "22px",
                objectFit: "cover",
                objectPosition: "top",
              }}
            />
          </Box>
          <Box
            sx={{
              px: 2,
              py: 1,
              borderRadius: 1,
            }}
          >
            <Typography
              variant="body1"
              color="#2C6587"
              fontWeight="600"
              fontSize="1.25rem"
              noWrap
            >
              {
                subcategories.find((s) => s.id === selectedService)
                  ?.subcategory_name
              }
            </Typography>
          </Box>
        </Box>

        <Typography
          sx={{
            mb: 2,
            fontSize: "1.125rem",
            lineHeight: "100%",
            letterSpacing: "0%",
            color: "#555555",
            fontWeight: 600,
          }}
        >
          Job Details
        </Typography>
        <Card
          sx={{
            p: 2,
            mb: 3,
            bgcolor: "#FBFBFB",
            borderRadius: 2,
            boxShadow: "none",
            border: "none",
          }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            {serviceProvider == "non-professional" && productName != "" ? (
              <>
                <Box sx={{ flex: 1, textAlign: "center" }}>
                  <Typography
                    sx={{ fontSize: "1.125rem", color: "#989898", mb: 0.5 }}
                  >
                    Product
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "1.125rem",
                      color: "primary.normal",
                      fontWeight: 500,
                    }}
                  >
                    {productName}
                  </Typography>
                </Box>
                <Box
                  sx={{ width: "0.0625rem", bgcolor: "grey.300", my: 0.5 }}
                />
                <Box sx={{ flex: 1, textAlign: "center" }}>
                  <Typography
                    sx={{ fontSize: "1.125rem", color: "#989898", mb: 0.5 }}
                  >
                    Quantity
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "1.125rem",
                      color: "primary.normal",
                      fontWeight: 500,
                    }}
                  >
                    {quantity}
                  </Typography>
                </Box>
              </>
            ) : (
              <>
                <Box sx={{ flex: 1, textAlign: "center" }}>
                  <Typography
                    sx={{ fontSize: "1.125rem", color: "#989898", mb: 0.5 }}
                  >
                    Valuation
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "1.125rem",
                      color: "primary.normal",
                      fontWeight: 500,
                    }}
                  >
                    €{valuation}
                  </Typography>
                </Box>
              </>
            )}
            <Box sx={{ width: "0.0625rem", bgcolor: "grey.300", my: 0.5 }} />
            <Box sx={{ flex: 1, textAlign: "center" }}>
              <Typography
                sx={{ fontSize: "1.125rem", color: "#989898", mb: 0.5 }}
              >
                Job Date
              </Typography>
              <Typography
                sx={{
                  fontSize: "1.125rem",
                  color: "primary.normal",
                  fontWeight: 500,
                }}
              >
                {selectedDate} {getMonthName(currentMonth).substring(0, 3)}
              </Typography>
            </Box>
            <Box sx={{ width: "0.0625rem", bgcolor: "grey.300", my: 0.5 }} />
            <Box sx={{ flex: 1, textAlign: "center" }}>
              <Typography
                sx={{ fontSize: "1.125rem", color: "#989898", mb: 0.5 }}
              >
                Job Time
              </Typography>
              <Typography
                sx={{
                  fontSize: "1.125rem",
                  color: "primary.normal",
                  fontWeight: 500,
                }}
              >
                {selectedTime.hour}:{selectedTime.minute} {selectedTime.period}
              </Typography>
            </Box>
          </Box>
        </Card>

        <Typography
          sx={{
            mb: 2,
            fontSize: "1.125rem",
            lineHeight: "100%",
            letterSpacing: "0%",
            color: "#555555",
            fontWeight: 600,
          }}
        >
          Service description
        </Typography>
        <Box
          sx={{
            mb: 3,
            border: "0.0625rem solid",
            borderColor: "#D5D5D5",
            borderRadius: "0.75rem",
            p: 2,
            bgcolor: "#FFFFFF",
            minHeight: "120px",
            maxHeight: "400px",
            overflow: "auto",
          }}
        >
          <Typography
            sx={{
              fontSize: "1rem",
              lineHeight: "150%",
              letterSpacing: "0%",
              color: "#424242",
              whiteSpace: "pre-wrap",
            }}
          >
            {serviceDescription || "No description provided"}
          </Typography>
        </Box>

        {serviceProvider == "non-professional" ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 3,
              mb: 3,
              width: "100%",
            }}
          >
            {/* Job Photos Section */}
            <Box sx={{ width: "100%" }}>
              <Typography
                sx={{
                  mb: 2,
                  fontSize: "1.125rem",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  color: "#555555",
                  fontWeight: 600,
                }}
              >
                Job photos
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: { xs: "wrap", md: "nowrap" },
                }}
              >
                {descriptionFiles.length > 0 ? (
                  descriptionFiles.map((file, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: "100%",
                        height: "10.438rem",
                        borderRadius: "0.75rem",
                        overflow: "hidden",
                        position: "relative",
                        border: "none",
                      }}
                    >
                      {file.type.startsWith("image/") &&
                      descriptionFilePreviews[index] ? (
                        <Image
                          src={descriptionFilePreviews[index]}
                          alt={`Job photo ${index + 1}`}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "grey.100",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "text.secondary",
                              fontSize: "0.875rem",
                            }}
                          >
                            {file.name}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  ))
                ) : (
                  <Typography sx={{ color: "text.secondary", py: 2 }}>
                    No photos uploaded
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Product Images Section */}
            <Box sx={{ width: "100%" }}>
              <Typography
                sx={{
                  mb: 2,
                  fontSize: "1.125rem",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  color: "#555555",
                  fontWeight: 600,
                }}
              >
                Product Images
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: { xs: "wrap", md: "nowrap" },
                }}
              >
                {barterPhotoFiles.length > 0 ? (
                  barterPhotoFiles.map((file, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: "100%",
                        height: "10.438rem",
                        borderRadius: "0.75rem",
                        overflow: "hidden",
                        position: "relative",
                        border: "none",
                      }}
                    >
                      {file.type.startsWith("image/") &&
                      barterPhotoFilePreviews[index] ? (
                        <Image
                          src={barterPhotoFilePreviews[index]}
                          alt={`Product photo ${index + 1}`}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "grey.100",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "text.secondary",
                              fontSize: "0.875rem",
                            }}
                          >
                            {file.name}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  ))
                ) : (
                  <Typography sx={{ color: "text.secondary", py: 2 }}>
                    No product photos uploaded
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        ) : (
          <Box sx={{ mb: 3 }}>
            <Box width={"100%"}>
              <Typography
                sx={{
                  mb: 2,
                  fontSize: "1.125rem",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  color: "#555555",
                  fontWeight: 600,
                }}
              >
                Job photos
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              {descriptionFiles.length > 0 ? (
                descriptionFiles.map((file, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: "calc(50% - 0.5rem)",
                      minWidth: "200px",
                      height: "10.438rem",
                      borderRadius: "0.75rem",
                      overflow: "hidden",
                      position: "relative",
                      border: "none",
                    }}
                  >
                    {file.type.startsWith("image/") &&
                    descriptionFilePreviews[index] ? (
                      <Image
                        src={descriptionFilePreviews[index]}
                        alt={`Job photo ${index + 1}`}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: "grey.100",
                        }}
                      >
                        <Typography
                          sx={{ color: "text.secondary", fontSize: "0.875rem" }}
                        >
                          {file.name}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                ))
              ) : (
                <Typography sx={{ color: "text.secondary", py: 2 }}>
                  No photos uploaded
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <>
      <Dialog
        open={open && !showSuccess}
        onClose={() => {
          resetForm();
          onClose();
        }}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: "90vh",
            maxWidth: "42.438rem",
          },
        }}
      >
        <DialogContent
          sx={{
            p: "2.5rem",
            position: "relative",
            overflowY: "auto",
            maxHeight: "calc(90vh - 64px)",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            msOverflowStyle: "none",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: "2rem",
            }}
          >
            <Typography
              sx={{
                color: "primary.normal",
                lineHeight: "1.5rem",
                fontSize: "2rem",
                fontWeight: 700,
              }}
            >
              Create A Service Request
            </Typography>
            <Box
              onClick={() => {
                resetForm();
                onClose();
              }}
              sx={{
                pr: 0,
                cursor: "pointer",
              }}
            >
              <CloseIcon />
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  flex: 1,
                  height: 8,
                  borderRadius: 4,
                  bgcolor: "grey.200",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: "#2F6B8E",
                  },
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  ml: 2,
                  minWidth: 50,
                  textAlign: "right",
                  color: "#2F6B8E",
                }}
              >
                {progress}%
              </Typography>
            </Box>
          </Box>

          <Box sx={{ minHeight: 400, mb: 4 }}>{renderStepContent()}</Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: currentStep === 1 ? "center" : "space-between",
              gap: 2,
            }}
          >
            {currentStep === 1 ? null : (
              <Button
                variant="outlined"
                onClick={handleBack}
                sx={{
                  borderColor: "#2F6B8E",
                  color: "#2F6B8E",
                  textTransform: "none",
                  pt: "0.625rem",
                  pr: "3.75rem",
                  pb: "0.625rem",
                  pl: "3.75rem",
                }}
              >
                Back
              </Button>
            )}
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={
                uploading ||
                (currentStep === 1 && !serviceProvider) ||
                (currentStep === 2 &&
                  (!serviceDescription || descriptionFiles.length === 0)) ||
                (currentStep === 3 &&
                  serviceProvider === "professional" &&
                  (!valuation || valuation.trim() === "")) ||
                (currentStep === 4 &&
                  serviceProvider === "non-professional" &&
                  (!productName || barterPhotoFiles.length === 0))
              }
              sx={{
                bgcolor: "#214C65",
                textTransform: "none",
                pt: "0.625rem",
                pr: "3.75rem",
                pb: "0.625rem",
                pl: "3.75rem",
                "&:hover": {
                  bgcolor: "#25608A",
                },
              }}
            >
              {uploading
                ? "Submitting..."
                : currentStep ===
                    (serviceProvider === "non-professional" ? 5 : 4)
                  ? "Submit"
                  : "Next"}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog
        open={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          resetForm();
          onClose();
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            textAlign: "center",
            p: 4,
          },
        }}
      >
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              py: 2,
            }}
          >
            <Image
              src="/icons/thankyou.png"
              alt="Thank You"
              width={372}
              height={332}
            />
            <Typography
              sx={{
                mb: 1,
                color: "#939393",
                fontSize: "1.125rem",
                lineHeight: "1.75rem",
                fontWeight: 600,
              }}
            >
              Great job! Your request is now submitted successfully.
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
