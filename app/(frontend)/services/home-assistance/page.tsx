"use client";

import React, { useEffect, useRef, useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/Star";
import Image from "next/image";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  IconButton,
} from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { apiGet } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";

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

interface Subcategory {
  id: string;
  subcategory_name: string;
  image: string;
}

interface SubcategoriesApiResponse {
  message: string;
  data: {
    Banner: {
      url: string | null;
      category_name: string;
      file_name: string | null;
      file_type: string | null;
    };
    subcategories: Subcategory[];
  };
  success: boolean;
  status_code: number;
}

export default function HomeAssistancePage() {
  const router = useRouter();

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [subcategories, setSubcategories] = useState<
    Record<string, Subcategory[]>
  >({});
  const [subcategoriesLoading, setSubcategoriesLoading] = useState<
    Record<string, boolean>
  >({});

  // Check if user is authenticated on mount
  useEffect(() => {
    const storedInitial = localStorage.getItem("userInitial");
    const storedEmail = localStorage.getItem("userEmail");

    // If user details are not present, redirect to login
    if (!storedInitial || !storedEmail) {
      router.push(ROUTES.LOGIN);
    }
  }, [router]);

  // Service cards data

  // Touch handlers for carousel
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - (carouselRef.current?.offsetLeft || 0));
    setScrollLeft(carouselRef.current?.scrollLeft || 0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.touches[0].pageX - (carouselRef.current.offsetLeft || 0);
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Mouse handlers for carousel
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (carouselRef.current?.offsetLeft || 0));
    setScrollLeft(carouselRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - (carouselRef.current.offsetLeft || 0);
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Check if user is authenticated on mount
  useEffect(() => {
    const storedInitial = localStorage.getItem("userInitial");
    const storedEmail = localStorage.getItem("userEmail");

    // If user details are not present, redirect to login
    if (!storedInitial || !storedEmail) {
      router.push(ROUTES.LOGIN);
    }

    // Fetch categories for home assistance service
    fetchCategories();
  }, [router]);

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const serviceName = "home assistance";
      const endpoint = `${
        API_ENDPOINTS.HOME.HOME
      }?service_name=${encodeURIComponent(serviceName)}`;
      const response = await apiGet<CategoriesApiResponse>(endpoint);

      if (response.success && response.data) {
        const apiData = response.data;
        if (
          apiData.data?.categories &&
          Array.isArray(apiData.data.categories)
        ) {
          setCategories(apiData.data.categories);
          // Fetch subcategories for each category
          apiData.data.categories.forEach((category) => {
            fetchSubcategories(category.id);
          });
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fetchSubcategories = async (categoryId: string) => {
    setSubcategoriesLoading((prev) => ({ ...prev, [categoryId]: true }));
    try {
      const endpoint = `${API_ENDPOINTS.HOME.HOME}/${categoryId}`;
      const response = await apiGet<SubcategoriesApiResponse>(endpoint);

      if (response.success && response.data) {
        const apiData = response.data;
        if (
          apiData.data?.subcategories &&
          Array.isArray(apiData.data.subcategories)
        ) {
          setSubcategories((prev) => ({
            ...prev,
            [categoryId]: apiData.data.subcategories,
          }));
        }
      }
    } catch (error) {
      console.error(
        `Error fetching subcategories for category ${categoryId}:`,
        error
      );
    } finally {
      setSubcategoriesLoading((prev) => ({ ...prev, [categoryId]: false }));
    }
  };

  // Helper function to determine border radius based on grid position
  const getBorderRadius = (index: number, totalItems: number) => {
    const isFirstRow = index < 3;
    const isLastRow = index >= totalItems - 3;
    const isFirstColumn = index % 3 === 0;
    const isLastColumn = index % 3 === 2;

    return {
      borderTopLeftRadius: isFirstRow && isFirstColumn ? "2.5rem" : "0.75rem",
      borderTopRightRadius: isFirstRow && isLastColumn ? "2.5rem" : "0.75rem",
      borderBottomLeftRadius: isLastRow && isFirstColumn ? "2.5rem" : "0.75rem",
      borderBottomRightRadius: isLastRow && isLastColumn ? "2.5rem" : "0.75rem",
    };
  };

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Hero Section */}
      <Box sx={{ py: 8 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 4,
            px: "5rem",
            alignItems: "start",
          }}
        >
          {/* Left Section - Text and Service Categories */}
          <Box
            sx={{
              margin: "auto",
            }}
          >
            <Typography
              fontWeight="bold"
              gutterBottom
              sx={{
                fontSize: { xs: "2rem", md: "3rem" },
                lineHeight: "150%",
                color: "#323232",
                mb: "2.5rem",
              }}
            >
              Home Assistance Services At Your Doorstep
            </Typography>

            {/* Service Categories Card */}
            <Box
              sx={{
                p: "2.5rem",
                borderRadius: 2,
                bgcolor: "white",
                border: "0.0625rem solid #898A8D2E",
              }}
            >
              <Typography
                variant="h6"
                fontWeight="600"
                sx={{
                  fontWeight: 600,
                  mb: "2rem",
                  lineHeigh: "2.75rem",
                  color: "#1F2937",
                  fontSize: "1.5rem",
                  fontFamily: "sans-serif",
                }}
              >
                What are you looking for
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gridTemplateRows: "repeat(2, 1fr)",
                  gap: 2,
                }}
              >
                {categoriesLoading ? (
                  // Loading state
                  Array.from({ length: 6 }).map((_, index) => {
                    const borderRadius = getBorderRadius(index, 6);
                    return (
                      <Box
                        key={`loading-${index}`}
                        sx={{
                          p: 1.5,
                          borderRadius: "0.75rem",
                          ...borderRadius,
                          textAlign: "center",
                          bgcolor: "#F8F8F8",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 1,
                          minHeight: 100,
                        }}
                      >
                        <Typography
                          sx={{ color: "#787878", fontSize: "0.875rem" }}
                        >
                          Loading...
                        </Typography>
                      </Box>
                    );
                  })
                ) : categories.length > 0 ? (
                  categories.map((category, index) => {
                    const borderRadius = getBorderRadius(
                      index,
                      categories.length
                    );
                    return (
                      <Box
                        key={category.id}
                        sx={{
                          p: 1.5,
                          borderRadius: "0.75rem",
                          ...borderRadius,
                          textAlign: "center",
                          cursor: "pointer",
                          bgcolor: "#F8F8F8",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 1,
                          "&:hover": {
                            bgcolor: "#F0F0F0",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 50,
                            height: 50,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {category.category_logo ? (
                            <Image
                              src={category.category_logo}
                              alt={category.category_name}
                              width={50}
                              height={50}
                              style={{ objectFit: "contain" }}
                            />
                          ) : (
                            <Box
                              sx={{
                                width: 50,
                                height: 50,
                                bgcolor: "grey.300",
                                borderRadius: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: "0.75rem",
                                  color: "text.secondary",
                                }}
                              >
                                {category.category_name.charAt(0)}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                        <Typography
                          sx={{
                            color: "#787878",
                            fontSize: "1rem",
                            lineHeight: "1.125rem",
                          }}
                        >
                          {category.category_name}
                        </Typography>
                      </Box>
                    );
                  })
                ) : (
                  // Empty state
                  <Typography
                    sx={{
                      color: "#787878",
                      gridColumn: "1 / -1",
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

          {/* Right Section - Image Collage */}
          <Box
            sx={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              gap: "0.75rem",
              height: "100%",
            }}
          >
            <Box
              sx={{
                width: "50%",
                height: "100%",
                flexDirection: "column",
                gap: "0.75rem",
                display: "flex",
                borderTopLeftRadius: "0.75rem",
                overflow: "hidden",
                borderBottomLeftRadius: "8.5rem",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "50%",
                }}
              >
                <Image
                  height={500}
                  width={500}
                  className="size-full"
                  src="/image/service-image-1.png"
                  alt="Service - TV Installation"
                  style={{ objectFit: "cover" }}
                />
              </Box>
              <Box
                sx={{
                  width: "100%",
                  height: "50%",
                }}
              >
                <Image
                  height={500}
                  width={500}
                  className="size-full"
                  src="/image/service-image-3.png"
                  alt="Service - TV Installation"
                  style={{ objectFit: "cover" }}
                />
              </Box>
            </Box>
            <Box
              sx={{
                width: "50%",
                height: "100%",
                flexDirection: "column",
                gap: "0.75rem",
                display: "flex",
                borderTopRightRadius: "8.5rem",
                overflow: "hidden",
                borderBottomRightRadius: "0.75rem",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "30%",
                }}
              >
                <Image
                  height={500}
                  width={500}
                  className="size-full"
                  src="/image/service-image-2.png"
                  alt="Service - TV Installation"
                  style={{ objectFit: "cover" }}
                />
              </Box>
              <Box
                sx={{
                  width: "100%",
                  height: "70%",
                }}
              >
                <Image
                  height={500}
                  width={500}
                  className="size-full"
                  src="/image/service-image-4.png"
                  alt="Service - TV Installation"
                  style={{ objectFit: "cover" }}
                />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Service Sections */}
        <Box sx={{ mt: 8 }}>
          {categories.map((category) => {
            const categorySubcategories = subcategories[category.id] || [];
            const isLoading = subcategoriesLoading[category.id] || false;

            return (
              <Box key={category.id} sx={{ mb: "3.75rem", ml: "5rem" }}>
                <Typography
                  sx={{
                    color: "#323232",
                    mb: 3,
                    fontSize: {
                      xs: "1.2rem",
                      md: "1.688rem",
                      lineHeight: "2rem",
                      fontWeight: 700,
                    },
                  }}
                >
                  {category.category_name}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 3,
                    overflowX: "auto",
                    pb: 2,
                    "&::-webkit-scrollbar": {
                      display: "none",
                    },
                    scrollbarWidth: "none",
                  }}
                >
                  {isLoading ? (
                    // Loading state
                    Array.from({ length: 3 }).map((_, index) => (
                      <Box
                        key={`loading-${category.id}-${index}`}
                        sx={{
                          minWidth: "25rem",
                          borderRadius: 2,
                          overflow: "hidden",
                          bgcolor: "#EAF0F35C",
                          p: "0.75rem",
                        }}
                      >
                        <Box
                          sx={{
                            width: "100%",
                            bgcolor: "grey.200",
                            borderRadius: "0.75rem",
                            height: 225,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography sx={{ color: "text.secondary" }}>
                            Loading...
                          </Typography>
                        </Box>
                      </Box>
                    ))
                  ) : categorySubcategories.length > 0 ? (
                    // Display subcategories from API
                    categorySubcategories.map((subcategory) => (
                      <Box
                        key={subcategory.id}
                        sx={{
                          minWidth: "25rem",
                          borderRadius: 2,
                          overflow: "hidden",
                          bgcolor: "#EAF0F35C",
                          p: "0.75rem",
                        }}
                      >
                        <Box
                          sx={{
                            width: "376px",
                            height: "225px",
                            bgcolor: "grey.200",
                            borderRadius: "14px",
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
                                width: "376px",
                                height: "225px",
                                objectFit: "cover",
                                borderRadius: "14px",
                              }}
                            />
                          ) : (
                            <Box
                              sx={{
                                width: "376px",
                                height: "225px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: "grey.300",
                                borderRadius: "14px",
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
                            alignItems: "center",
                            bgcolor: "white",
                            px: "1.25rem",
                            py: "0.969rem",
                            borderRadius: "0.75rem",
                            mt: "0.5rem",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "primary.normal",
                              fontSize: "1.125rem",
                              lineHeight: "2rem",
                            }}
                          >
                            {subcategory.subcategory_name}
                          </Typography>
                          <Button
                            variant="contained"
                            size="small"
                            sx={{
                              bgcolor: "primary.normal",
                              color: "white",
                              textTransform: "none",
                              borderRadius: 2,
                              fontSize: "0.85rem",
                              py: 0.75,
                              textWrap: "nowrap",
                            }}
                            endIcon={
                              <ArrowOutwardIcon sx={{ fontSize: "1rem" }} />
                            }
                          >
                            Create Request
                          </Button>
                        </Box>
                      </Box>
                    ))
                  ) : (
                    // Empty state
                    <Box
                      sx={{
                        minWidth: "25rem",
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
          })}
        </Box>

        <Box sx={{ bgcolor: "white", px: "5rem" }}>
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: "2rem",
              }}
            >
              <Typography
                sx={{
                  color: "text.primary",
                  fontSize: { xs: "1.2rem", md: "1.688rem", fontWeight: 700 },
                }}
              >
                Favorite Professionals
              </Typography>
              <Button
                variant="outlined"
                sx={{
                  m: 0,
                  textTransform: "none",
                  color: "#2F6B8E",
                  px: "1.25rem",
                  py: "0.5rem",
                  display: { xs: "none", md: "block" },
                }}
              >
                View All
              </Button>
            </Box>

            {/* Professionals Carousel */}
            <Box
              ref={carouselRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              sx={{
                display: "flex",
                gap: 3,
                overflowX: "auto",
                overflowY: "hidden",
                scrollSnapType: "x mandatory",
                scrollBehavior: "smooth",
                WebkitOverflowScrolling: "touch",
                pb: 2,
                cursor: isDragging ? "grabbing" : "grab",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {[
                { name: "Wade Warren", rating: 4.2, reviews: 1490 },
                { name: "Jenny Wilson", rating: 4.5, reviews: 1234 },
                { name: "Robert Fox", rating: 4.8, reviews: 2100 },
                { name: "Cameron Williamson", rating: 4.3, reviews: 980 },
                { name: "Leslie Alexander", rating: 4.6, reviews: 1650 },
                { name: "Leslie Alexander", rating: 4.6, reviews: 1650 },
              ].map((professional, index) => (
                <Box
                  key={index}
                  sx={{
                    minWidth: { xs: "85%", md: 200 },
                    flexShrink: 0,
                    scrollSnapAlign: "start",
                    borderRadius: "1.125rem",
                    p: "0.875rem",
                    textAlign: "center",
                    position: "relative",
                    border: "0.0625rem solid #DFE8ED",
                    cursor: isDragging ? "grabbing" : "pointer",
                    userSelect: "none",
                    pointerEvents: isDragging ? "none" : "auto",
                  }}
                >
                  {/* Heart Icon */}
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      color: "error.main",
                      p: 0.5,
                    }}
                  >
                    <FavoriteIcon sx={{ fontSize: 20 }} />
                  </IconButton>

                  {/* Profile Picture */}
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      bgcolor: "grey.300",
                      margin: "0 auto 0.75rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    <AccountCircleIcon
                      sx={{ fontSize: 80, color: "grey.500" }}
                    />
                  </Box>

                  {/* Name */}
                  <Typography
                    sx={{
                      mb: 1,
                      textAlign: "left",
                      color: "#323232",
                      fontSize: "1.125rem",
                      fontWeight: 500,
                    }}
                  >
                    {professional.name}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {/* Rating */}
                    <Box
                      sx={{
                        display: "flex",
                        gap: 0.5,
                        mb: "0.375rem",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          textAlign: "left",
                          color: "secondary.naturalGray",
                          fontSize: "1.063rem",
                        }}
                      >
                        {professional.rating}
                      </Typography>
                      <StarIcon sx={{ fontSize: 16, color: "#F59E0B" }} />
                    </Box>

                    {/* Reviews */}
                    <Typography
                      variant="caption"
                      color="#999999"
                      sx={{
                        fontSize: "0.688rem",
                        lineHeight: "1rem",
                      }}
                    >
                      ({professional.reviews} Reviews)
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
