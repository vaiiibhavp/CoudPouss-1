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
        p: { xs: 2, sm: 3, md: "1.5rem" },
        bgcolor: "white",
        borderRadius: 2,
        border: "0.0625rem solid #DBE0E5",
        width: "100%",
        minHeight: { xs: "auto", md: "calc(100vh - 18.75rem)" },
      }}
    >
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: "20px",
          lineHeight: "24px",
          letterSpacing: "0%",
          verticalAlign: "middle",
          color: "#2C6587",
          mb: 2,
        }}
      >
        Manage Services
      </Typography>

      <Typography
        sx={{
          fontWeight: 600,
          fontSize: "16px",
          lineHeight: "150%",
          letterSpacing: "0%",
          color: "#939393",
        }}
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
              bgcolor: "#214C65",
              color: "white",
              textTransform: "none",
              paddingTop: "10px",
              paddingRight: "20px",
              paddingBottom: "10px",
              paddingLeft: "20px",
              fontSize: "1rem",
              fontWeight: "500",
              borderRadius: "8px",
              gap: "10px",
              "&:hover": {
                bgcolor: "#1a3d52",
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
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, gap: { xs: 2, sm: 0 }, mt:"1.375rem" }}>
            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", width: { xs: "100%", sm: "auto" } }}>
              {categories.map((categoryId) => (
                <Chip
                  key={categoryId}
                  label={groupedServices[categoryId].categoryName}
                  sx={{
                    bgcolor: "#2C6587",
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
                bgcolor: "#214C65",
                color: "white",
                textTransform: "none",
                paddingTop: "10px",
                paddingRight: { xs: "20px", sm: "20px" },
                paddingBottom: "10px",
                paddingLeft: { xs: "20px", sm: "20px" },
                fontSize: { xs: "0.875rem", sm: "1rem" },
                fontWeight: "500",
                borderRadius: "8px",
                gap: "10px",
                whiteSpace: "nowrap",
                width: { xs: "100%", sm: "auto" },
                "&:hover": {
                  bgcolor: "#1a3d52",
                },
              }}
            >
              Add more services
            </Button>
          </Box>

          {/* Services List */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt:"1.375rem" }}>
            {selectedServices.map((service) => (
              <Box
                key={service.serviceId}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderRadius: "20px",
                  paddingTop: "10px",
                  paddingRight: "20px",
                  paddingBottom: "10px",
                  paddingLeft: "10px",
                  boxShadow: "none",
                  bgcolor: "#F2F2F2",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1.5, sm: 2, md: 3 }, flex: 1, minWidth: 0 }}>
                  <Box
                    sx={{
                      width: { xs: 60, sm: 70, md: "119px" },
                      height: { xs: 60, sm: 70, md: "96px" },
                      borderRadius: 2,
                      overflow: "hidden",
                      position: "relative",
                      flexShrink: 0,
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
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: "16px", sm: "17px", md: "18px" },
                      lineHeight: "20px",
                      letterSpacing: "0%",
                      color: "#323232",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
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
              </Box>
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
