"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  IconButton,
  Checkbox,
  Radio,
  RadioGroup,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import { apiGet } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";

interface Category {
  id: string;
  category_name: string;
  category_logo: string;
}

interface Service {
  id: string;
  subcategory_name: string;
  image: string | null;
}

interface SelectedService {
  categoryId: string;
  categoryName: string;
  categoryLogo: string;
  serviceId: string;
  serviceName: string;
  serviceImage: string;
}

interface AddServiceModalProps {
  open: boolean;
  onClose: () => void;
  onAddServices: (services: SelectedService[]) => void;
  existingServices?: SelectedService[];
}

// Helper function to get category icon based on category name
const getCategoryIcon = (categoryName: string): string => {
  const normalizedName = categoryName.toLowerCase().trim();

  // Map category names to icon filenames
  const iconMap: { [key: string]: string } = {
    'diy': '/icons/DIYIcon.png',
    'gardening': '/icons/gardening.png',
    'moving': '/icons/transport.png',
    'housekeeping': '/icons/HousekeepingIcons.png',
    'childcare': '/icons/ChildCareIcon.png',
    'pets': '/icons/PetIcons.png',
    'it': '/icons/support.png',
    'homecare': '/icons/HomecareIcon.png',
    'home assistance': '/icons/HomecareIcon.png',
    'personal care': '/icons/personal-care.png',
    'tech support': '/icons/support.png',
    'transport': '/icons/transport.png',
  };

  // Try to find exact match or partial match
  for (const [key, value] of Object.entries(iconMap)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return value;
    }
  }

  // Default fallback icon
  return '/icons/diy.png';
};


export default function AddServiceModal({
  open,
  onClose,
  onAddServices,
  existingServices = [],
}: AddServiceModalProps) {
  const [step, setStep] = useState<"category" | "service">("category");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  // API state
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [subcategories, setSubcategories] = useState<Service[]>([]);
  const [subcategoriesLoading, setSubcategoriesLoading] = useState(false);

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
        setCategories(response.data.data);
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


  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleNext = () => {
    if (step === "category" && selectedCategory) {
      // Fetch subcategories for the selected category
      fetchSubcategories(selectedCategory);
      setStep("service");
    } else if (step === "service" && selectedServices.length > 0) {
      // Convert selected services to the format needed
      const category = categories.find((c) => c.id === selectedCategory);
      const servicesData: SelectedService[] = selectedServices.map((serviceId) => {
        const service = subcategories.find((s) => s.id === serviceId);
        return {
          categoryId: selectedCategory,
          categoryName: category?.category_name || "",
          categoryLogo: category?.category_logo || "",
          serviceId: service?.id || "",
          serviceName: service?.subcategory_name || "",
          serviceImage: service?.image || "/image/explore-service-section-1.png",
        };
      });

      onAddServices(servicesData);
      handleClose();
    }
  };

  const handleSkip = () => {
    if (step === "category") {
      handleClose();
    } else {
      setStep("category");
    }
  };

  const handleClose = () => {
    setStep("category");
    setSelectedCategory("");
    setSelectedServices([]);
    setSubcategories([]);
    onClose();
  };

  const filteredServices = subcategories;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 2,
          maxHeight: "80vh",
        },
      }}
    >
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ position: "relative" }}>
          {/* Close Button */}
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: -16,
              top: -16,
              color: "#6B7280",
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Category Selection Step */}
          {step === "category" && (
            <Box>
              <Typography
                variant="h6"
                fontWeight="600"
                sx={{ color: "#1F2937", mb: 3 }}
              >
                Select a category
              </Typography>

              {/* Loading State */}
              {categoriesLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress sx={{ color: "#2F6B8E" }} />
                </Box>
              ) : (
                <>
                  {/* Category List */}
                  <RadioGroup
                    value={selectedCategory}
                    onChange={(e) => handleCategorySelect(e.target.value)}
                  >
                    <Box
                      sx={{
                        maxHeight: "18.75rem",
                        overflowY: "auto",
                        "&::-webkit-scrollbar": {
                          width: "0.375rem",
                        },
                        "&::-webkit-scrollbar-thumb": {
                          backgroundColor: "#D1D5DB",
                          borderRadius: "0.1875rem",
                        },
                      }}
                    >
                      {categories.map((category) => (
                        <Box
                          key={category.id}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            p: 2,
                            mb: 1,
                            borderRadius: 2,
                            cursor: "pointer",
                            bgcolor:
                              selectedCategory === category.id
                                ? "#F0F9FF"
                                : "transparent",
                            "&:hover": {
                              bgcolor: "#F9FAFB",
                            },
                          }}
                          onClick={() => handleCategorySelect(category.id)}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            {/* Category Logo */}
                            <Box
                              sx={{
                                width: 32,
                                height: 32,
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Image
                                src={getCategoryIcon(category.category_name)}
                                alt={category.category_name}
                                width={32}
                                height={32}
                                style={{ objectFit: "contain" }}
                              />
                            </Box>
                            <Typography variant="body1" sx={{ color: "#374151" }}>
                              {category.category_name}
                            </Typography>
                          </Box>
                          <FormControlLabel
                            value={category.id}
                            control={
                              <Radio
                                checked={selectedCategory === category.id}
                                sx={{
                                  color: "#D1D5DB",
                                  "&.Mui-checked": {
                                    color: "#2F6B8E",
                                  },
                                }}
                              />
                            }
                            label=""
                            sx={{ m: 0 }}
                          />
                        </Box>
                      ))}
                    </Box>
                  </RadioGroup>
                </>
              )}
            </Box>
          )}

          {/* Service Selection Step */}
          {step === "service" && (
            <Box>
              <Typography
                variant="h6"
                fontWeight="600"
                sx={{ color: "#1F2937", mb: 3 }}
              >
                Select services
              </Typography>

              {/* Loading State */}
              {subcategoriesLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress sx={{ color: "#2F6B8E" }} />
                </Box>
              ) : (
                <Box
                  sx={{
                    maxHeight: "25rem",
                    overflowY: "auto",
                    "&::-webkit-scrollbar": {
                      width: "6px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "#D1D5DB",
                      borderRadius: "0.1875rem",
                    },
                  }}
                >
                  {filteredServices.length === 0 ? (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
                        No services available for this category
                      </Typography>
                    </Box>
                  ) : (
                    filteredServices.map((service) => {
                      const isAlreadyAdded = existingServices.some(
                        (existing) => existing.serviceId === service.id
                      );
                      const isDisabled = isAlreadyAdded;

                      return (
                        <Box
                          key={service.id}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            p: 2,
                            mb: 1,
                            borderRadius: 2,
                            border: "0.0625rem solid #E5E7EB",
                            cursor: isDisabled ? "not-allowed" : "pointer",
                            bgcolor: isDisabled
                              ? "#F9FAFB"
                              : selectedServices.includes(service.id)
                                ? "#F0F9FF"
                                : "white",
                            opacity: isDisabled ? 0.6 : 1,
                            "&:hover": {
                              bgcolor: isDisabled ? "#F9FAFB" : "#F9FAFB",
                            },
                          }}
                          onClick={() => !isDisabled && handleServiceToggle(service.id)}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Box
                              sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 1,
                                overflow: "hidden",
                                position: "relative",
                                bgcolor: "#F3F4F6",
                              }}
                            >
                              {service.image ? (
                                <Image
                                  src={service.image}
                                  alt={service.subcategory_name}
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
                                    bgcolor: "#E5E7EB",
                                  }}
                                >
                                  <Typography variant="caption" sx={{ color: "#9CA3AF" }}>
                                    No Image
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                            <Box>
                              <Typography variant="body1" sx={{ color: isDisabled ? "#9CA3AF" : "#374151" }}>
                                {service.subcategory_name}
                              </Typography>
                              {isAlreadyAdded && (
                                <Typography variant="caption" sx={{ color: "#10B981", fontWeight: 500 }}>
                                  ✓ Already Added
                                </Typography>
                              )}
                            </Box>
                          </Box>
                          <Checkbox
                            checked={isAlreadyAdded || selectedServices.includes(service.id)}
                            disabled={isDisabled}
                            sx={{
                              color: "#D1D5DB",
                              "&.Mui-checked": {
                                color: isAlreadyAdded ? "#10B981" : "#2F6B8E",
                              },
                              "&.Mui-disabled": {
                                color: "#10B981",
                              },
                            }}
                          />
                        </Box>
                      );
                    })
                  )}
                </Box>
              )}
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleSkip}
              sx={{
                textTransform: "none",
                py: 1.5,
                fontSize: "1rem",
                fontWeight: "500",
                borderRadius: 2,
                borderColor: "#D1D5DB",
                color: "#374151",
                "&:hover": {
                  borderColor: "#9CA3AF",
                  bgcolor: "#F9FAFB",
                },
              }}
            >
              {step === "service" ? "Back" : "Skip"}
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={handleNext}
              disabled={
                (step === "category" && !selectedCategory) ||
                (step === "service" && selectedServices.length === 0)
              }
              sx={{
                textTransform: "none",
                py: 1.5,
                fontSize: "1rem",
                fontWeight: "500",
                borderRadius: 2,
                bgcolor: "#2F6B8E",
                "&:hover": {
                  bgcolor: "#1e4a5f",
                },
                "&:disabled": {
                  bgcolor: "#D1D5DB",
                  color: "#9CA3AF",
                },
              }}
            >
              Next
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
