"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Chip, IconButton, Card, Menu, MenuItem } from "@mui/material";
import Image from "next/image";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddServiceModal from "./AddServiceModal";
import DeleteServiceModal from "./DeleteServiceModal";
import AdditionalCategoryWarningModal from "./AdditionalCategoryWarningModal";
import { apiGet, apiPatch, apiDelete } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";
import { toast } from "sonner";

interface SelectedService {
  categoryId: string;
  categoryName: string;
  categoryLogo: string;
  serviceId: string;
  serviceName: string;
  serviceImage: string;
}

interface ProviderServicesApiResponse {
  status: string;
  message: string;
  data: {
    category: Array<{
      category_id: string;
      category_name: string;
      category_logo_url: string;
    }>;
    subcategory: Array<{
      subcategory_id: string;
      subcategory_name: string;
      subcategory_img_url: string;
    }>;
  };
}

export default function ManageServices() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [serviceProviderType, setServiceProviderType] = useState<string | null>(null);

  // Helper function to extract category name from subcategory image URL
  const getCategoryFromImageUrl = (imageUrl: string, categories: Array<{ category_name: string }>): string | null => {
    try {
      // Extract category name from URL path (e.g., "DIY/Furniture_Assembly.png" -> "DIY")
      const urlParts = imageUrl.split('/');
      const categoryFolder = urlParts[urlParts.length - 2];
      
      // Normalize folder name (replace underscores with spaces, handle case)
      const normalizedFolder = categoryFolder.replace(/_/g, ' ').toLowerCase();
      
      // Try to match with category names (case-insensitive, handle spaces/underscores)
      const matchedCategory = categories.find(cat => {
        const normalizedCategory = cat.category_name.toLowerCase();
        return normalizedCategory === normalizedFolder || 
               normalizedCategory === categoryFolder.toLowerCase();
      });
      
      return matchedCategory ? matchedCategory.category_name : null;
    } catch (error) {
      return null;
    }
  };

  // Transform API response to SelectedService format
  const transformApiResponseToServices = (apiData: ProviderServicesApiResponse['data']): SelectedService[] => {
    const { category, subcategory } = apiData;
    
    if (!category || !subcategory || category.length === 0 || subcategory.length === 0) {
      return [];
    }

    // Create a map of category name to category data for quick lookup
    const categoryMap = new Map<string, { id: string; name: string; logo: string }>();
    category.forEach(cat => {
      categoryMap.set(cat.category_name.toLowerCase(), {
        id: cat.category_id,
        name: cat.category_name,
        logo: cat.category_logo_url,
      });
    });

    // Transform subcategories to services
    const services: SelectedService[] = subcategory.map(sub => {
      // Try to find category from image URL path
      const categoryName = getCategoryFromImageUrl(sub.subcategory_img_url, category);
      const categoryData = categoryName 
        ? categoryMap.get(categoryName.toLowerCase())
        : null;

      // If we can't determine category, skip this subcategory or use first category as fallback
      if (!categoryData) {
        // Fallback: use first category if we can't determine
        const firstCategory = category[0];
        return {
          categoryId: firstCategory.category_id,
          categoryName: firstCategory.category_name,
          categoryLogo: firstCategory.category_logo_url,
          serviceId: sub.subcategory_id,
          serviceName: sub.subcategory_name,
          serviceImage: sub.subcategory_img_url,
        };
      }

      return {
        categoryId: categoryData.id,
        categoryName: categoryData.name,
        categoryLogo: categoryData.logo,
        serviceId: sub.subcategory_id,
        serviceName: sub.subcategory_name,
        serviceImage: sub.subcategory_img_url,
      };
    });

    return services;
  };

  // Fetch provider services function (reusable)
  const fetchProviderServices = async () => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";
      const providerServicesEndpoint = `${apiBaseUrl}userService/provider-services`;
      const response = await apiGet<ProviderServicesApiResponse>(
        providerServicesEndpoint
      );

      if (response.success && response.data?.data) {
        const transformedServices = transformApiResponseToServices(response.data.data);
        setSelectedServices(transformedServices);
      } else {
        setSelectedServices([]);
      }
    } catch (error) {
      console.error("Error fetching provider services:", error);
      setSelectedServices([]);
    }
  };

  // Fetch provider services on mount
  useEffect(() => {
    const loadServices = async () => {
      setLoading(true);
      await fetchProviderServices();
      setLoading(false);
    };

    loadServices();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await apiGet<{ data: { user: { service_provider_type: string } } }>(
          API_ENDPOINTS.AUTH.GET_USER
        );
        console.log({ response })
        if (response.success && response.data) {
          setServiceProviderType(response.data.data.user.service_provider_type);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  }, []);

  const handleAddServices = async (services: SelectedService[]) => {
    try {
      if (!services || services.length === 0) return;

      // 1. Identify new services to add (avoid duplicates)
      const newServices = services.filter(
        (newService) => !selectedServices.some((existing) => existing.serviceId === newService.serviceId)
      );

      if (newServices.length === 0) return;

      // 2. Group new services by category (although modal usually returns one category)
      //    We need to make an API call per category if necessary, but typically it's just one.
      const categoryId = newServices[0].categoryId;
      if (!categoryId) return;

      const subCategoryIds = newServices.map(s => s.serviceId);

      // 3. Call API to update subcategories
      const response = await apiPatch(
        API_ENDPOINTS.USER.UPDATE_SUBCATEGORIES(categoryId),
        {
          sub_category_ids: subCategoryIds
        }
      );

      if (response.success) {
        // 4. Refetch services to get updated list from backend
        await fetchProviderServices();
        toast.success("Services added successfully!");
      } else {
        // Handle specific error messages
        const errorMessage = response.error?.message || (response.data as any)?.message || "Failed to update services";

        if (errorMessage === "All provided sub-categories are already added") {
          toast.error("All selected services are already added to your profile. Please select different services.");
        } else {
          toast.error(errorMessage);
        }

        console.error("Failed to update services:", response.error);
      }

    } catch (error: any) {
      console.error("Error adding services:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "An error occurred while adding services";
      toast.error(errorMessage);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    // Toggle selection: if already selected, deselect it; otherwise select it
    setSelectedCategoryFilter((prev) => (prev === categoryId ? null : categoryId));
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, serviceId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedServiceId(serviceId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // Don't clear selectedServiceId here - it's needed for delete operation
  };

  const handleRemoveClick = () => {
    setAnchorEl(null); // Close the menu
    setDeleteModalOpen(true);
    // Keep selectedServiceId for the delete operation
  };

  const handleConfirmDelete = async () => {
    if (selectedServiceId) {
      try {
        const response = await apiDelete(API_ENDPOINTS.USER.REMOVE_SERVICE(selectedServiceId));

        if (response.success) {
          // Refetch services to get updated list from backend
          await fetchProviderServices();
          toast.success("Service removed successfully");
        } else {
          const errorMessage = response.error?.message || "Failed to remove service";
          toast.error(errorMessage);
        }
      } catch (error) {
        console.error("Error removing service:", error);
        toast.error("An error occurred while removing the service");
      }
    }
    setSelectedServiceId(null);
    setDeleteModalOpen(false);
  };

  // Group services by category
  const groupedServices = selectedServices.reduce((acc, service) => {
    if (!acc[service.categoryId]) {
      acc[service.categoryId] = {
        categoryName: service.categoryName,
        categoryLogo: service.categoryLogo,
        services: [],
      };
    }
    acc[service.categoryId].services.push(service);
    return acc;
  }, {} as Record<string, { categoryName: string; categoryLogo: string; services: SelectedService[] }>);

  const categories = Object.keys(groupedServices);

  // Filter services based on selected category
  const filteredServicesList = selectedCategoryFilter
    ? selectedServices.filter((s) => s.categoryId === selectedCategoryFilter)
    : selectedServices;

  // Auto-select first category when services are available
  useEffect(() => {
    if (categories.length > 0 && !selectedCategoryFilter) {
      setSelectedCategoryFilter(categories[0]);
    }
  }, [categories.length, selectedCategoryFilter]);

  const handleAddMoreServicesClick = () => {
    // Check if user is Non-professional and has reached the limit (1 categories)
    // Note: Adjust the limit logic as per specific business requirements
    const isProfessional = serviceProviderType === 'professional';
    console.log({ isProfessional })
    if (!isProfessional && categories.length >= 1) {
      setWarningModalOpen(true);
    } else {
      setModalOpen(true);
    }
  };

  const handleProceedFromWarning = () => {
    setWarningModalOpen(false);
    setModalOpen(true);
  };

  return (
    <>
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
          variant="h6"
          sx={{
            color: "primary.main",
            mb: 3,
            fontWeight: 600,
            fontSize: "1.25rem",
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

        {
          loading ? (
            /* Loading State */
            <Box
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "400px",
              }}
            >
              <Typography sx={{ color: "#939393" }}>Loading services...</Typography>
            </Box>
          ) : selectedServices.length === 0 ? (
            /* Empty State - Centered Content */
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                minHeight: "400px",
              }}
            >
              {/* Manage Service Illustration */}
              <Box
                sx={{
                  width: 250,
                  height: 250,
                  bgcolor: "#F8FAFC",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                  position: "relative",
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
                onClick={handleAddMoreServicesClick}
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
              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, gap: { xs: 2, sm: 0 }, mt: "1.375rem" }}>
                <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", width: { xs: "100%", sm: "auto" } }}>
                  {categories.map((categoryId) => {
                    const isSelected = selectedCategoryFilter === categoryId;
                    return (
                      <Chip
                        key={categoryId}
                        onClick={() => handleCategoryClick(categoryId)}
                        avatar={
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "50%",
                              // p: 0.5,
                            }}
                          >
                            <Image
                              src={groupedServices[categoryId].categoryLogo}
                              alt={groupedServices[categoryId].categoryName}
                              width={20}
                              height={20}
                              style={{ objectFit: "contain" }}
                            />
                          </Box>
                        }
                        label={groupedServices[categoryId].categoryName}
                        sx={{
                          bgcolor: isSelected ? "#2C6587" : "#F7F7F7",
                          color: isSelected ? "white" : "#323232",
                          fontWeight: "500",
                          fontSize: "0.875rem",
                          height: "2.5rem",
                          borderRadius: "1.25rem",
                          px: "20px",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            bgcolor: isSelected ? "#1e4a5f" : "#E5E7EB",
                          },

                          "& .MuiChip-avatar": {
                            marginLeft: "0.5rem",
                            marginRight: "-0.25rem",
                          },
                        }}
                      />
                    );
                  })}
                </Box>
                <Button
                  variant="contained"
                  endIcon={<AddIcon />}
                  onClick={handleAddMoreServicesClick}
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
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  Add more services
                </Button>
              </Box>

              {/* Services List Grid */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  mt: 3,
                }}
              >
                {filteredServicesList.map((service) => (
                  <Card
                    key={service.serviceId}
                    sx={{
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderRadius: "16px",
                      bgcolor: "#F3F4F6", // Light grey background
                      border: "none",
                      boxShadow: "none",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                      <Box
                        sx={{
                          width: 80,
                          height: 60,
                          borderRadius: "12px",
                          overflow: "hidden",
                          position: "relative",
                          bgcolor: "#FFFFFF",
                        }}
                      >
                        <Image
                          src={service.serviceImage || "/image/explore-service-section-1.png"}
                          alt={service.serviceName}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            fontSize: "1rem",
                            fontWeight: 600,
                            color: "#1F2937",
                            mb: 0.5,
                          }}
                        >
                          {service.serviceName}
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, service.serviceId)}
                      size="small"
                    >
                      <MoreVertIcon sx={{ color: "#2F6B8E", fontSize: "1.25rem" }} />
                    </IconButton>
                  </Card>
                ))}
              </Box>

              {/* Menu for Remove Option */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => {
                  setAnchorEl(null);
                  setSelectedServiceId(null); // Clear when menu closes normally
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
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
          )
        }

        {/* Add Service Modal */}
        <AddServiceModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onAddServices={handleAddServices}
          existingServices={selectedServices}
        />

        {/* Additional Category Warning Modal */}
        <AdditionalCategoryWarningModal
          open={warningModalOpen}
          onClose={() => setWarningModalOpen(false)}
          onProceed={handleProceedFromWarning}
        />

        {/* Delete Confirmation Modal */}
        <DeleteServiceModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      </Box>
    </>
  );
}
