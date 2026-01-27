"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Box, Typography, Button } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { apiGet } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";
import CreateServiceRequestModal from "@/components/CreateServiceRequestModal";

interface Category {
  id: string;
  category_name: string;
  category_logo: string;
}

interface CategoriesApiResponse {
  message: string;
  data: {
    categories: Category[];
  };
  success: boolean;
  status_code: number;
}

interface Banner {
  url: string | null;
  category_name: string;
  file_name: string | null;
  file_type: string | null;
}

interface Subcategory {
  id: string;
  subcategory_name: string;
  image: string | null;
}

interface SubcategoriesApiResponse {
  message: string;
  data: {
    Banner: Banner | null;
    subcategories: Subcategory[];
  };
  success: boolean;
  status_code: number;
}

export default function TransportPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [subcategories, setSubcategories] = useState<
    Record<string, Subcategory[]>
  >({});
  const [subcategoriesLoading, setSubcategoriesLoading] = useState<
    Record<string, boolean>
  >({});
  const [banners, setBanners] = useState<Record<string, Banner | null>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedSubcategoryId, setSelectedSubcategoryId] =
    useState<string>("");

  // Memoized function to handle modal close
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedCategoryId("");
    setSelectedSubcategoryId("");
  }, []);

  const fetchSubcategories = useCallback(async (categoryId: string) => {
    setSubcategoriesLoading((prev) => ({ ...prev, [categoryId]: true }));
    try {
      const endpoint = `${API_ENDPOINTS.HOME.HOME}/${categoryId}`;
      const response = await apiGet<SubcategoriesApiResponse>(endpoint);

      if (response.success && response.data?.data) {
        const apiData = response.data.data;
        if (Array.isArray(apiData.subcategories)) {
          setSubcategories((prev) => ({
            ...prev,
            [categoryId]: apiData.subcategories,
          }));
        }
        setBanners((prev) => ({
          ...prev,
          [categoryId]: apiData.Banner,
        }));
      }
    } catch (error) {
      console.error(
        `Error fetching subcategories for category ${categoryId}:`,
        error,
      );
    } finally {
      setSubcategoriesLoading((prev) => ({ ...prev, [categoryId]: false }));
    }
  }, []);

  // Fetch categories for transport service
  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true);
    try {
      const serviceName = "transport";
      const endpoint = `${
        API_ENDPOINTS.HOME.HOME
      }?service_name=${encodeURIComponent(serviceName)}`;
      const response = await apiGet<CategoriesApiResponse>(endpoint);

      if (response.success && response.data?.data?.categories) {
        const apiCategories = response.data.data.categories;
        setCategories(apiCategories);
        apiCategories.forEach((category) => {
          fetchSubcategories(category.id);
        });
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setCategoriesLoading(false);
    }
  }, [fetchSubcategories]);

  // Check if user is authenticated on mount and load data
  useEffect(() => {
    const storedInitial = localStorage.getItem("userInitial");
    const storedEmail = localStorage.getItem("userEmail");

    if (!storedInitial || !storedEmail) {
      router.push(ROUTES.LOGIN);
      return;
    }

    fetchCategories();
    apiCallToAllCategoriesList();
  }, [router, fetchCategories]);

  const apiCallToAllCategoriesList = async () => {
    let serviceName = "transport";
    const response = await apiGet(API_ENDPOINTS.HOME.SERVICENAME(serviceName));
    console.log(response);
  };

  // Transport service cards data
  const transportServices = [
    {
      id: 1,
      title: "Rent a Truck",
      image: "/image/service-image-2.png",
    },
    {
      id: 2,
      title: "Moving Help",
      image: "/image/service-image-2.png",
    },
    {
      id: 3,
      title: "Get rid of bulky items",
      image: "/image/service-image-2.png",
    },
    {
      id: 4,
      title: "Other Moving Job",
      image: "/image/service-image-2.png",
    },
    {
      id: 5,
      title: "Moving Appliance",
      image: "/image/service-image-2.png",
    },
    {
      id: 6,
      title: "Packing Your Boxes",
      image: "/image/service-image-2.png",
    },
  ];

  const primaryCategoryId = categories[0]?.id;
  const heroBanner = primaryCategoryId ? banners[primaryCategoryId] : null;

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Hero Section - Transport Banner */}
      <Box
        sx={{ pt: { xs: "2rem", md: "5rem" }, px: { xs: "1rem", md: "5rem" } }}
      >
        <Box
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            mb: { xs: 3, md: 6 },
          }}
        >
          <Box>
            {/* Banner Image */}
            <Box
              sx={{
                width: "100%",
                height: "100%",
              }}
            >
              <Image
                src={"/image/transportCareServiceBanner.png"}
                alt={heroBanner?.category_name || "Transport Service"}
                height={278}
                width={1248}
                style={{
                  width: "100%",
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* All Services Section */}
        <Box>
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{
              color: "#323232",
              mb: { xs: 2, md: 4 },
              lineHeight: "2rem",
              fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2.5rem" },
            }}
          >
            All Services
          </Typography>

          <Box sx={{ mt: { xs: 4, md: 8 } }}>
            {categoriesLoading ? (
              <Box
                sx={{
                  mb: "3.75rem",
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, minmax(0, 1fr))",
                    md: "repeat(3, minmax(0, 1fr))",
                  },
                  gap: { xs: 2, md: 3 },
                }}
              >
                {Array.from({ length: 6 }).map((_, index) => (
                  <Box
                    key={`loading-${index}`}
                    sx={{
                      borderRadius: 2,
                      overflow: "hidden",
                      bgcolor: "#EAF0F35C",
                      p: "0.75rem",
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        height: "225px",
                        bgcolor: "grey.200",
                        borderRadius: "0.75rem",
                      }}
                    />
                  </Box>
                ))}
              </Box>
            ) : categories.length > 0 ? (
              categories.map((category) => {
                const categorySubcategories = subcategories[category.id] || [];
                const isLoading = subcategoriesLoading[category.id];

                return (
                  <Box key={category.id} sx={{ mb: { xs: 3, md: "3.75rem" } }}>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "repeat(2, minmax(0, 1fr))",
                          md: "repeat(3, minmax(0, 1fr))",
                        },
                        gap: { xs: 2, md: 3 },
                      }}
                    >
                      {isLoading ? (
                        Array.from({ length: 6 }).map((_, index) => (
                          <Box
                            key={`loading-${category.id}-${index}`}
                            sx={{
                              borderRadius: 2,
                              overflow: "hidden",
                              bgcolor: "#EAF0F35C",
                              p: "0.75rem",
                            }}
                          >
                            <Box
                              sx={{
                                width: "100%",
                                height: "225px",
                                bgcolor: "grey.200",
                                borderRadius: "0.75rem",
                              }}
                            />
                          </Box>
                        ))
                      ) : categorySubcategories.length > 0 ? (
                        categorySubcategories.map((subcategory) => (
                          <Box
                            key={subcategory.id}
                            sx={{
                              borderRadius: 2,
                              overflow: "hidden",
                              bgcolor: "#EAF0F35C",
                              p: "0.75rem",
                            }}
                          >
                            <Box
                              sx={{
                                width: "100%",
                                height: "225px",
                                bgcolor: "grey.200",
                                borderRadius: "0.75rem",
                                overflow: "hidden",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {subcategory.image ? (
                                <Image
                                  src={subcategory.image}
                                  alt={subcategory.subcategory_name}
                                  width={376}
                                  height={225}
                                  style={{
                                    objectFit: "cover",
                                    width: "100%",
                                    height: "100%",
                                  }}
                                />
                              ) : (
                                <Box
                                  sx={{
                                    width: "100%",
                                    height: "100%",
                                    bgcolor: "grey.300",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Typography sx={{ color: "text.secondary" }}>
                                    {subcategory.subcategory_name}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                flexDirection: { xs: "column", sm: "row" },
                                alignItems: { xs: "flex-start", sm: "center" },
                                // alignItems:"center",
                                bgcolor: "white",
                                px: { xs: "1rem", md: "1.25rem" },
                                py: { xs: "0.75rem", md: "0.969rem" },
                                borderRadius: "0.75rem",
                                mt: "0.5rem",
                                flexWrap: { xs: "wrap", sm: "nowrap" },
                                gap: { xs: 1, sm: 0 },
                              }}
                            >
                              <Typography
                                title={subcategory.subcategory_name} // native browser hover
                                sx={{
                                  color: "primary.normal",
                                  fontSize: { xs: "16px", md: "20px" },
                                  lineHeight: "2rem",

                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",

                                  maxWidth: "100%", // important inside flex
                                }}
                              >
                                {subcategory.subcategory_name}
                              </Typography>

                              <Button
                                variant="contained"
                                size="small"
                                onClick={() => {
                                  setSelectedCategoryId(category.id);
                                  setSelectedSubcategoryId(subcategory.id);
                                  setIsModalOpen(true);
                                }}
                                endIcon={
                                  <ArrowOutwardIcon sx={{ fontSize: "1rem" }} />
                                }
                                sx={{
                                  bgcolor: "primary.normal",
                                  color: "white",
                                  textTransform: "none",
                                  borderRadius: 1,

                                  fontSize: { xs: "0.8rem", sm: "0.85rem" },
                                  lineHeight: "1.125rem",

                                  px: { xs: 1.25, sm: 1.5 },
                                  py: { xs: 0.5, sm: 0.75 },

                                  whiteSpace: "nowrap",
                                  alignSelf: "flex-start",
                                  minWidth: "fit-content",

                                  "& .MuiButton-endIcon": {
                                    ml: 0.5,
                                  },
                                }}
                              >
                                Create Request
                              </Button>
                            </Box>
                          </Box>
                        ))
                      ) : (
                        <Box
                          sx={{
                            gridColumn: "1 / -1",
                            py: 4,
                            textAlign: "center",
                            color: "text.secondary",
                          }}
                        >
                          <Typography>No subcategories available</Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                );
              })
            ) : (
              <Typography
                sx={{
                  color: "#787878",
                  textAlign: "center",
                  py: 4,
                }}
              >
                No categories available
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      {/* Create Service Request Modal */}
      <CreateServiceRequestModal
        open={isModalOpen}
        onClose={handleCloseModal}
        preSelectedCategoryId={selectedCategoryId}
        preSelectedSubcategoryId={selectedSubcategoryId}
      />
    </Box>
  );
}
