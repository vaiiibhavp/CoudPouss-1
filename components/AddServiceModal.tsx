"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  CircularProgress,
  RadioProps,
  Select,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
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

// Custom bullet radio to match BookServiceModal design
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

export default function AddServiceModal({
  open,
  onClose,
  onAddServices,
  existingServices = [],
}: AddServiceModalProps) {
  const [step, setStep] = useState<"category" | "service">("category");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [subcategories, setSubcategories] = useState<Service[]>([]);
  const [subcategoriesLoading, setSubcategoriesLoading] = useState(false);

  // Fetch categories
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

  // Fetch subcategories
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
      fetchSubcategories(selectedCategory);
      setStep("service");
    } else if (step === "service" && selectedServices.length > 0) {
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

  const handleBack = () => {
    if (step === "service") {
      setStep("category");
      setSelectedServices([]);
      setSubcategories([]);
    }
  };

  const handleClose = () => {
    setStep("category");
    setSelectedCategory("");
    setSelectedServices([]);
    setSubcategories([]);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          p: 0,
          minHeight: "500px",
        },
      }}
    >
      <DialogContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ position: "relative", mb: 2 }}>
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{ position: "absolute", right: -8, top: -8, color: "#9CA3AF" }}
          >
            <CloseIcon />
          </IconButton>

          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 1 }}>
            <Box
              component="img"
              src="/image/fi_9329880.png"
              alt="Logo"
              sx={{ width: 60, height: 60, mb: 1.5 }}
            />
            <Typography
              sx={{
                fontSize: "1.125rem",
                fontWeight: 500,
                color: "#2C6587",
                lineHeight: "100%",
                letterSpacing: "0%",
                textAlign: "center",
              }}
            >
              {step === "category" ? "Add Service Category" : "Select Services"}
            </Typography>
          </Box>
        </Box>

        {/* Subtitle */}
        <Typography
          sx={{
            fontSize: "0.875rem",
            color: "#939393",
            mb: 1
          }}
        >
          {step === "category" ? "Select a category" : "Select subcategories"}
        </Typography>

        {/* Content */}
        <Box
          sx={{
            minHeight: "300px",
            maxHeight: "400px",
            overflowY: "auto",
            mb: 3,
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {step === "category" ? (
            // Category Selection - SELECT INPUT
            categoriesLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress sx={{ color: "#2C6587" }} />
              </Box>
            ) : (
              <Select
                value={selectedCategory}
                onChange={(e) => handleCategorySelect(e.target.value)}
                displayEmpty
                IconComponent={KeyboardArrowDownIcon}
                renderValue={(selected) => {
                  if (!selected) {
                    return (
                      <Typography sx={{ color: "#939393", fontSize: "1rem" }}>
                        Select a category
                      </Typography>
                    );
                  }
                  const cat = categories.find((c) => c.id === selected);
                  return (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {cat?.category_logo && (
                        <Image
                          src={cat.category_logo}
                          alt={cat.category_name}
                          width={24}
                          height={24}
                          style={{ objectFit: "contain" }}
                        />
                      )}
                      <Typography sx={{ color: "#2C6587", fontWeight: 500 }}>
                        {cat?.category_name}
                      </Typography>
                    </Box>
                  );
                }}
                sx={{
                  width: "100%",
                  borderRadius: "8px",
                  "& .MuiSelect-select": {
                    color: "#2C6587",
                    py: 1.5,
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#E5E7EB",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#2C6587",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#2C6587",
                  },
                  "& .MuiSelect-icon": {
                    color: "#6B7280",
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: 250,
                      mt: 1,
                      borderRadius: "8px",
                      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
                    },
                  },
                }}
              >
                {categories.map((category) => (
                  <MenuItem
                    key={category.id}
                    value={category.id}
                    sx={{
                      py: 1.5,
                      "&.Mui-selected": {
                        bgcolor: "#F0F9FF",
                        "&:hover": { bgcolor: "#E0F2FE" },
                      },
                      "&:hover": {
                        bgcolor: "#F9FAFB",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
                      {category.category_logo && (
                        <Image
                          src={category.category_logo}
                          alt={category.category_name}
                          width={24}
                          height={24}
                          style={{ objectFit: "contain" }}
                        />
                      )}
                      <Typography sx={{ color: "#424242", flex: 1 }}>
                        {category.category_name}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            )
          ) : (
            // Service Selection
            subcategoriesLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress sx={{ color: "#2C6587" }} />
              </Box>
            ) : subcategories.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
                  No services available for this category
                </Typography>
              </Box>
            ) : (
              subcategories.map((service) => {
                const isAlreadyAdded = existingServices.some(
                  (existing) => existing.serviceId === service.id
                );
                const isSelected = selectedServices.includes(service.id);
                const isDisabled = isAlreadyAdded;

                return (
                  <Box
                    key={service.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      py: 1.5,
                      px: 1,
                      cursor: isDisabled ? "not-allowed" : "pointer",
                      borderRadius: "8px",
                      opacity: isDisabled ? 0.5 : 1,
                      "&:hover": {
                        bgcolor: isDisabled ? "transparent" : "#F9FAFB",
                      },
                    }}
                    onClick={() => !isDisabled && handleServiceToggle(service.id)}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      {service.image && (
                        <Image
                          src={service.image}
                          alt={service.subcategory_name}
                          width={24}
                          height={24}
                          style={{ objectFit: "contain" }}
                        />
                      )}
                      <Box>
                        <Typography
                          sx={{
                            fontSize: "1rem",
                            color: isDisabled ? "#9CA3AF" : isSelected ? "#2C6587" : "#424242",
                            fontWeight: isSelected ? 500 : 400,
                          }}
                        >
                          {service.subcategory_name}
                        </Typography>
                        {isAlreadyAdded && (
                          <Typography
                            sx={{
                              fontSize: "0.75rem",
                              color: "#10B981",
                              fontWeight: 500,
                            }}
                          >
                            ✓ Already Added
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    <FormControlLabel
                      value={service.id}
                      control={
                        <BulletRadio
                          checked={isAlreadyAdded || isSelected}
                          disabled={isDisabled}
                        />
                      }
                      label=""
                      sx={{ m: 0 }}
                    />
                  </Box>
                );
              })
            )
          )}
        </Box>

        {/* Footer Buttons */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            onClick={step === "service" ? handleBack : handleClose}
            variant="outlined"
            fullWidth
            sx={{
              borderColor: "#2C6587",
              color: "#2C6587",
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 500,
              py: 1.5,
              borderRadius: "8px",
              "&:hover": {
                borderColor: "#1e4a5f",
                bgcolor: "rgba(44, 101, 135, 0.05)",
              },
            }}
          >
            {step === "service" ? "Back" : "Cancel"}
          </Button>
          <Button
            onClick={handleNext}
            disabled={
              (step === "category" && !selectedCategory) ||
              (step === "service" && selectedServices.length === 0)
            }
            variant="contained"
            fullWidth
            sx={{
              bgcolor: "#2C6587",
              color: "white",
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 500,
              py: 1.5,
              borderRadius: "8px",
              "&:hover": {
                bgcolor: "#1e4a5f",
              },
              "&:disabled": {
                bgcolor: "#E5E7EB",
                color: "#9CA3AF",
              },
            }}
          >
            {step === "category" ? "Add Category" : "Add Services"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
