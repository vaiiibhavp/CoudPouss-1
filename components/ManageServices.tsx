"use client";

import React, { useState } from "react";
import { Box, Typography, Button, Chip, IconButton, Card, Menu, MenuItem } from "@mui/material";
import Image from "next/image";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddServiceModal from "./AddServiceModal";
import DeleteServiceModal from "./DeleteServiceModal";

interface SelectedService {
  categoryId: string;
  categoryName: string;
  serviceId: string;
  serviceName: string;
  serviceImage: string;
}

export default function ManageServices() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleAddServices = (services: SelectedService[]) => {
    setSelectedServices((prev) => [...prev, ...services]);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, serviceId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedServiceId(serviceId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedServiceId(null);
  };

  const handleRemoveClick = () => {
    handleMenuClose();
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedServiceId) {
      setSelectedServices((prev) => prev.filter((s) => s.serviceId !== selectedServiceId));
    }
    setSelectedServiceId(null);
  };

  // Group services by category
  const groupedServices = selectedServices.reduce((acc, service) => {
    if (!acc[service.categoryId]) {
      acc[service.categoryId] = {
        categoryName: service.categoryName,
        services: [],
      };
    }
    acc[service.categoryId].services.push(service);
    return acc;
  }, {} as Record<string, { categoryName: string; services: SelectedService[] }>);

  const categories = Object.keys(groupedServices);

  return (
    <Box
      sx={{
        p: 4,
        bgcolor: "white",
        borderRadius: 2,
        border: "0.0625rem solid #E5E7EB",
        boxShadow: "0 0.0625rem 0.1875rem rgba(0,0,0,0.1)",
        width: "100%",
        minHeight: "calc(100vh - 18.75rem)",
      }}
    >
      <Typography
        variant="h6"
        fontWeight="600"
        sx={{ color: "#2F6B8E", mb: 2 }}
      >
        Manage Services
      </Typography>

      <Typography
        variant="body2"
        sx={{ color: "#6B7280", mb: 4, lineHeight: 1.6 }}
      >
        Here, you can easily manage your service categories. Each additional
        category you add will incur a monthly fee of €1.
      </Typography>

      {selectedServices.length === 0 ? (
        /* Empty State - Centered Content */
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 6,
          }}
        >
          {/* Manage Service Illustration */}
          <Box
            sx={{
              mb: 4,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: 200,
                height: 200,
                position: "relative",
                p: 2,
              }}
            >
              <Image
                src="/icons/manage-service.png"
                alt="Manage Services"
                width={200}
                height={200}
                style={{ objectFit: "contain" }}
              />
            </Box>
          </Box>

          {/* Add More Services Button */}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setModalOpen(true)}
            sx={{
              bgcolor: "#2F6B8E",
              color: "white",
              textTransform: "none",
              px: 4,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: "500",
              borderRadius: 2,
              "&:hover": {
                bgcolor: "#1e4a5f",
              },
            }}
          >
            Add more services
          </Button>
        </Box>
      ) : (
        /* Services Display */
        <Box>
          {/* Category Chips and Add Button */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
              {categories.map((categoryId) => (
                <Chip
                  key={categoryId}
                  label={groupedServices[categoryId].categoryName}
                  sx={{
                    bgcolor: "#2F6B8E",
                    color: "white",
                    fontWeight: "500",
                    fontSize: "0.875rem",
                    height: "2.5rem",
                    borderRadius: "1.25rem",
                    px: 2,
                    "& .MuiChip-label": {
                      px: 2,
                    },
                  }}
                />
              ))}
            </Box>
            <Button
              variant="contained"
              endIcon={<AddIcon />}
              onClick={() => setModalOpen(true)}
              sx={{
                bgcolor: "#2F6B8E",
                color: "white",
                textTransform: "none",
                px: 3,
                py: 1.2,
                fontSize: "0.95rem",
                fontWeight: "500",
                borderRadius: 2,
                whiteSpace: "nowrap",
                "&:hover": {
                  bgcolor: "#1e4a5f",
                },
              }}
            >
              Add more services
            </Button>
          </Box>

          {/* Services List */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {selectedServices.map((service) => (
              <Card
                key={service.serviceId}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 2.5,
                  borderRadius: 2,
                  border: "0.0625rem solid #E5E7EB",
                  boxShadow: "none",
                  bgcolor: "#F9FAFB",
                  "&:hover": {
                    boxShadow: "0 0.125rem 0.5rem rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 2,
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <Image
                      src={service.serviceImage}
                      alt={service.serviceName}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </Box>
                  <Typography
                    variant="h6"
                    fontWeight="500"
                    sx={{ color: "#1F2937", fontSize: "1.1rem" }}
                  >
                    {service.serviceName}
                  </Typography>
                </Box>
                <IconButton
                  onClick={(e) => handleMenuOpen(e, service.serviceId)}
                  sx={{
                    color: "#6B7280",
                    "&:hover": {
                      bgcolor: "#E5E7EB",
                    },
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
              </Card>
            ))}
          </Box>

          {/* Menu for Remove Option */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                borderRadius: 2,
                boxShadow: "0 0.25rem 0.75rem rgba(0,0,0,0.15)",
                minWidth: 150,
              },
            }}
          >
            <MenuItem
              onClick={handleRemoveClick}
              sx={{
                color: "#2F6B8E",
                gap: 1,
                py: 1.5,
                "&:hover": {
                  bgcolor: "#F0F9FF",
                },
              }}
            >
              <DeleteOutlineIcon sx={{ fontSize: "1.2rem" }} />
              Remove
            </MenuItem>
          </Menu>
        </Box>
      )}

      {/* Add Service Modal */}
      <AddServiceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddServices={handleAddServices}
      />

      {/* Delete Confirmation Modal */}
      <DeleteServiceModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
}
