"use client";

import React, { useState } from "react";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import HandymanIcon from "@mui/icons-material/Handyman";
import YardIcon from "@mui/icons-material/Yard";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import PetsIcon from "@mui/icons-material/Pets";
import ComputerIcon from "@mui/icons-material/Computer";
import HomeIcon from "@mui/icons-material/Home";

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface Service {
  id: string;
  name: string;
  image: string;
  categoryId: string;
}

interface SelectedService {
  categoryId: string;
  categoryName: string;
  serviceId: string;
  serviceName: string;
  serviceImage: string;
}

interface AddServiceModalProps {
  open: boolean;
  onClose: () => void;
  onAddServices: (services: SelectedService[]) => void;
}

const categories: Category[] = [
  { id: "diy", name: "DIY", icon: <HandymanIcon /> },
  { id: "gardening", name: "Gardening", icon: <YardIcon /> },
  { id: "moving", name: "Moving", icon: <LocalShippingIcon /> },
  { id: "housekeeping", name: "Housekeeping", icon: <CleaningServicesIcon /> },
  { id: "childcare", name: "Childcare", icon: <ChildCareIcon /> },
  { id: "pets", name: "Pets", icon: <PetsIcon /> },
  { id: "it", name: "IT", icon: <ComputerIcon /> },
  { id: "homecare", name: "Homecare", icon: <HomeIcon /> },
];

const services: Service[] = [
  {
    id: "furniture-assembly",
    name: "Furniture Assembly",
    image: "/image/explore-service-section-1.png",
    categoryId: "diy",
  },
  {
    id: "interior-painting",
    name: "Interior Painting",
    image: "/image/explore-service-section-2.png",
    categoryId: "diy",
  },
  {
    id: "tv-mounting",
    name: "TV Mounting",
    image: "/image/explore-service-section-3.png",
    categoryId: "diy",
  },
  {
    id: "plumbing",
    name: "Plumbing",
    image: "/image/explore-service-section-1.png",
    categoryId: "diy",
  },
  {
    id: "green-waste-removal",
    name: "Green Waste Removal",
    image: "/image/explore-service-section-2.png",
    categoryId: "gardening",
  },
  {
    id: "lawn-mowing",
    name: "Lawn Mowing",
    image: "/image/explore-service-section-3.png",
    categoryId: "gardening",
  },
  {
    id: "tree-trimming",
    name: "Tree Trimming",
    image: "/image/explore-service-section-1.png",
    categoryId: "gardening",
  },
];

export default function AddServiceModal({
  open,
  onClose,
  onAddServices,
}: AddServiceModalProps) {
  const [step, setStep] = useState<"category" | "service">("category");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

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
      setStep("service");
    } else if (step === "service" && selectedServices.length > 0) {
      // Convert selected services to the format needed
      const category = categories.find((c) => c.id === selectedCategory);
      const servicesData: SelectedService[] = selectedServices.map((serviceId) => {
        const service = services.find((s) => s.id === serviceId);
        return {
          categoryId: selectedCategory,
          categoryName: category?.name || "",
          serviceId: service?.id || "",
          serviceName: service?.name || "",
          serviceImage: service?.image || "",
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
    onClose();
  };

  const filteredServices = services.filter(
    (service) => service.categoryId === selectedCategory
  );

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
                        <Box sx={{ color: "#6B7280" }}>{category.icon}</Box>
                        <Typography variant="body1" sx={{ color: "#374151" }}>
                          {category.name}
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
                {filteredServices.map((service) => (
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
                      cursor: "pointer",
                      bgcolor: selectedServices.includes(service.id)
                        ? "#F0F9FF"
                        : "white",
                      "&:hover": {
                        bgcolor: "#F9FAFB",
                      },
                    }}
                    onClick={() => handleServiceToggle(service.id)}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 1,
                          overflow: "hidden",
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
                      <Typography variant="body1" sx={{ color: "#374151" }}>
                        {service.name}
                      </Typography>
                    </Box>
                    <Checkbox
                      checked={selectedServices.includes(service.id)}
                      sx={{
                        color: "#D1D5DB",
                        "&.Mui-checked": {
                          color: "#2F6B8E",
                        },
                      }}
                    />
                  </Box>
                ))}
              </Box>
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
