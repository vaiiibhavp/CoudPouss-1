"use client";

import React, { useState } from "react";
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
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import Image from "next/image";

const categories = [
  { value: "diy", label: "DIY", icon: "🔧" },
  { value: "gardening", label: "Gardening", icon: "🌿" },
  { value: "moving", label: "Moving", icon: "🚚" },
  { value: "housekeeping", label: "Housekeeping", icon: "🧹" },
  { value: "childcare", label: "Childcare", icon: "👶" },
  { value: "pets", label: "Pets", icon: "🐾" },
  { value: "it", label: "IT", icon: "💻" },
  { value: "homecare", label: "Homecare", icon: "❤️" },
];

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


export default function SelectCategoryPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedServices, setSelectedServices] = useState<number[]>([]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedServices([]);
  };

  const handleServiceToggle = (serviceId: number) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleRemoveService = (serviceId: number) => {
    setSelectedServices((prev) => prev.filter((id) => id !== serviceId));
  };

  const handleSkip = () => {
    router.push(ROUTES.LOGIN);
  };

  const handleContinue = () => {
    if (!selectedCategory) {
      alert("Please select a category");
      return;
    }
    if (selectedServices.length === 0) {
      alert("Please select at least one service");
      return;
    }
    sessionStorage.setItem("selected_category", selectedCategory);
    sessionStorage.setItem("selected_services", JSON.stringify(selectedServices));
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
          width: { md: "66.666%" },
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
            style={{ objectFit: "cover" }}
            sizes="66.666vw"
            priority
          />
        </Box>
      </Box>

      {/* Right side - Form */}
      <Box
        sx={{
          width: { xs: "100%", md: "33.333%" },
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 4 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h6" sx={{ color: "white" }}>
                  🏠
                </Typography>
              </Box>
              <Typography variant="h6" fontWeight="bold">
                CoudPouss
              </Typography>
            </Box>

            {/* Content */}
            <Box>
              <Typography variant="h5" fontWeight="600" gutterBottom sx={{ mb: 1 }}>
                Select A Category
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Please pick a category to begin. This will help us connect you with the right professional for your needs.
              </Typography>

              {/* Category Dropdown */}
              <FormControl fullWidth sx={{ mb: 3 }}>
                <Select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  displayEmpty
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="" disabled>
                    Select a category
                  </MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Service Selection */}
              {selectedCategory && (
                <Box sx={{ mb: 3 }}>
                  {services[selectedCategory]?.map((service) => (
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
                        bgcolor: selectedServices.includes(service.id) ? "#f9fafb" : "white",
                        "&:hover": {
                          bgcolor: "#f9fafb",
                        },
                      }}
                      onClick={() => handleServiceToggle(service.id)}
                    >
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
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
                        variant="body2"
                        fontWeight="500"
                        sx={{ flex: 1 }}
                      >
                        {service.name}
                      </Typography>
                      <Checkbox
                        checked={selectedServices.includes(service.id)}
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
              )}

              {/* Selected Services Display - Only for current category */}
              {selectedCategory && selectedServices.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
                    Select A Service
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Review your selected services. You can go back to make changes or continue to confirm your choices.
                  </Typography>

                  <Box>
                    <Chip
                      icon={<span>{categories.find((c) => c.value === selectedCategory)?.icon}</span>}
                      label={categories.find((c) => c.value === selectedCategory)?.label}
                      sx={{
                        mb: 2,
                        bgcolor: "white",
                        border: "1px solid #2F6B8E",
                        color: "#2F6B8E",
                        fontWeight: 600,
                        "& .MuiChip-icon": {
                          fontSize: "1.2rem",
                        },
                      }}
                    />
                    {services[selectedCategory]
                      ?.filter((service) => selectedServices.includes(service.id))
                      .map((service) => (
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
                              width: 60,
                              height: 60,
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
                            variant="body2"
                            fontWeight="500"
                            sx={{ flex: 1 }}
                          >
                            {service.name}
                          </Typography>
                          <IconButton
                            onClick={() => handleRemoveService(service.id)}
                            sx={{
                              color: "#6b7280",
                              "&:hover": {
                                color: "#ef4444",
                                bgcolor: "rgba(239, 68, 68, 0.1)",
                              },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Paper>
                      ))}
                  </Box>
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
                    borderColor: "#2F6B8E",
                    color: "#2F6B8E",
                    py: 1.5,
                    textTransform: "none",
                    fontSize: "1rem",
                    "&:hover": {
                      borderColor: "#25608A",
                      bgcolor: "rgba(47, 107, 142, 0.04)",
                    },
                  }}
                >
                  {selectedServices.length > 0 ? "Back" : "Skip"}
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleContinue}
                  disabled={!selectedCategory || selectedServices.length === 0}
                  sx={{
                    bgcolor: "#2F6B8E",
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
