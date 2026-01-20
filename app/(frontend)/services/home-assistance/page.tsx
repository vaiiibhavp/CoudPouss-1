"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
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
import Link from "next/link";
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

interface FavoriteProfessional {
  id: string;
  first_name: string;
  last_name: string;
  profile_photo_url: string | null;
  total_reviews: number;
  average_rating: number;
}

interface HomeApiResponse {
  message: string;
  data: {
    services: any[];
    user_data: any;
    professional_connected_count: number;
    recent_requests: any;
    favorite_professionals: {
      page: number;
      limit: number;
      total_items: number;
      total_pages: number;
      records: FavoriteProfessional[];
    };
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
  const favoriteProfessionalsCarouselRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [subcategories, setSubcategories] = useState<
    Record<string, Subcategory[]>
  >({});
  const [subcategoriesLoading, setSubcategoriesLoading] = useState<
    Record<string, boolean>
  >({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>("");
  const [favoriteProfessionals, setFavoriteProfessionals] = useState<
    FavoriteProfessional[]
  >([]);
  const [favoriteProfessionalsLoading, setFavoriteProfessionalsLoading] =
    useState(false);

  // Memoized function to handle modal close
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedCategoryId("");
    setSelectedSubcategoryId("");
  }, []);
  // Check if user is authenticated on mount
  useEffect(() => {
    const storedInitial = localStorage.getItem('userInitial');
    const storedEmail = localStorage.getItem('userEmail');

    // If user details are not present, redirect to login
    if (!storedInitial || !storedEmail) {
      router.push(ROUTES.LOGIN);
    }
  }, [router]);

  // Service cards data
  
  
 

  

  

  // Check if user is authenticated on mount
  useEffect(() => {
    const storedInitial = localStorage.getItem("userInitial");
    const storedEmail = localStorage.getItem("userEmail");

    // If user details are not present, redirect to login
    if (!storedInitial || !storedEmail) {
      router.push(ROUTES.LOGIN);
    }

    apiCallToAllCategoriesList()
  }, [router]);


  const apiCallToAllCategoriesList = async() => {
    let serviceName = "home assistance"
    try{
      const response = await apiGet(API_ENDPOINTS.HOME.SERVICENAME(serviceName))

      if(response){
        console.log("API call successful")
      }
      console.log(response)
    }catch(err){  
      console.log(err)
    } 
  }

  // Service categories
  const serviceCategories = [
    { name: "DIY", icon: "/icons/diy.png", borderTopLeftRadius: "2.5rem", },
    { name: "Gardening", icon: "/icons/gardening.png" },
    { name: "Housekeeping", icon: "/icons/housekeeping.png", borderTopRightRadius: "2.5rem" },
    { name: "Childcare", icon: "/icons/childcare.png", borderBottomLeftRadius: "2.5rem" },
    { name: "Pets", icon: "/icons/pets.png" },
    { name: "Homecare", icon: "/icons/homecare.png", borderBottomRightRadius: "2.5rem" },
  ];

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

  // Touch handlers for favorite professionals carousel
  const handleFavoriteProfessionalsTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(
      e.touches[0].pageX -
        (favoriteProfessionalsCarouselRef.current?.offsetLeft || 0)
    );
    setScrollLeft(favoriteProfessionalsCarouselRef.current?.scrollLeft || 0);
  };

  const handleFavoriteProfessionalsTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !favoriteProfessionalsCarouselRef.current) return;
    e.preventDefault();
    const x =
      e.touches[0].pageX -
      (favoriteProfessionalsCarouselRef.current.offsetLeft || 0);
    const walk = (x - startX) * 2;
    favoriteProfessionalsCarouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleFavoriteProfessionalsTouchEnd = () => {
    setIsDragging(false);
  };

  // Mouse handlers for favorite professionals carousel
  const handleFavoriteProfessionalsMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(
      e.pageX - (favoriteProfessionalsCarouselRef.current?.offsetLeft || 0)
    );
    setScrollLeft(favoriteProfessionalsCarouselRef.current?.scrollLeft || 0);
  };

  const handleFavoriteProfessionalsMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !favoriteProfessionalsCarouselRef.current) return;
    e.preventDefault();
    const x =
      e.pageX - (favoriteProfessionalsCarouselRef.current.offsetLeft || 0);
    const walk = (x - startX) * 2;
    favoriteProfessionalsCarouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleFavoriteProfessionalsMouseUp = () => {
    setIsDragging(false);
  };

  const handleFavoriteProfessionalsMouseLeave = () => {
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
    // Fetch favorite professionals
    fetchFavoriteProfessionals();
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

  const fetchFavoriteProfessionals = async () => {
    // Don't call API if user is not authenticated
    const storedInitial = localStorage.getItem("userInitial");
    const storedEmail = localStorage.getItem("userEmail");
    if (!storedInitial || !storedEmail) {
      return;
    }

    setFavoriteProfessionalsLoading(true);
    try {
      const response = await apiGet<HomeApiResponse>(API_ENDPOINTS.HOME.HOME);
      if (response.success && response.data) {
        const apiData = response.data;

        // Handle favorite professionals
        if (apiData?.data?.favorite_professionals?.records) {
          setFavoriteProfessionals(apiData.data.favorite_professionals.records);
        } else {
          setFavoriteProfessionals([]);
        }
      }
    } catch (error) {
      console.error("Error fetching favorite professionals:", error);
    } finally {
      setFavoriteProfessionalsLoading(false);
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
                            onClick={() => {
                              setSelectedCategoryId(category.id);
                              setSelectedSubcategoryId(subcategory.id);
                              setIsModalOpen(true);
                            }}
                            sx={{
                              bgcolor: "primary.normal",
                              color: "white",
                              textTransform: "none",
                              borderRadius: 1,
                              fontSize: "0.85rem",
                              py: 0.75,
                              textWrap: "nowrap",
                              lineHeight:"1.125rem",
                              px:"12px"
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

        {/* Favorite Professionals Section */}
        {(favoriteProfessionalsLoading || favoriteProfessionals.length > 0) && (
          <Box sx={{ bgcolor: "white", px: "5rem" }}>
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "center" },
                  mb: "2rem",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 1.5, sm: 0 },
                }}
              >
                <Typography
                  sx={{
                    color: "text.primary",
                    fontSize: { xs: "1.2rem", md: "1.688rem" },
                    fontWeight: 700,
                  }}
                >
                  Favorite Professionals
                </Typography>
                {favoriteProfessionals.length > 4 && (
                  <Button
                    component={Link}
                    href={ROUTES.Favorite}
                    variant="outlined"
                    sx={{
                      m: 0,
                      textTransform: "none",
                      color: "#2F6B8E",
                      px: "1.25rem",
                      py: "0.5rem",
                      display: { xs: "none", md: "block" },
                      fontSize: { xs: "0.875rem", md: "1rem" },
                      borderColor: "#2F6B8E",
                      "&:hover": {
                        borderColor: "#2F6B8E",
                        bgcolor: "rgba(47, 107, 142, 0.05)",
                      },
                    }}
                  >
                    View All
                  </Button>
                )}
              </Box>

              {/* Professionals Carousel */}
              <Box
                ref={favoriteProfessionalsCarouselRef}
                onTouchStart={handleFavoriteProfessionalsTouchStart}
                onTouchMove={handleFavoriteProfessionalsTouchMove}
                onTouchEnd={handleFavoriteProfessionalsTouchEnd}
                onMouseDown={handleFavoriteProfessionalsMouseDown}
                onMouseMove={handleFavoriteProfessionalsMouseMove}
                onMouseUp={handleFavoriteProfessionalsMouseUp}
                onMouseLeave={handleFavoriteProfessionalsMouseLeave}
                sx={{
                  display: { xs: "flex", sm: "grid" },
                  gridTemplateColumns: {
                    xs: "none",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(4, 1fr)",
                  },
                  flexDirection: { xs: "row", sm: "unset" },
                  gap: { xs: 1.5, sm: 2, md: 3 },
                  overflowX: { xs: "auto", sm: "hidden" },
                  overflowY: "hidden",
                  scrollSnapType: { xs: "x mandatory", sm: "none" },
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
                {favoriteProfessionalsLoading ? (
                  <Box
                    sx={{ gridColumn: "1 / -1", textAlign: "center", py: 4 }}
                  >
                    <Typography sx={{ color: "text.secondary" }}>
                      Loading professionals...
                    </Typography>
                  </Box>
                ) : favoriteProfessionals.length === 0 ? (
                  <Box
                    sx={{ gridColumn: "1 / -1", textAlign: "center", py: 4 }}
                  >
                    <Typography sx={{ color: "text.secondary" }}>
                      No favorite professionals yet
                    </Typography>
                  </Box>
                ) : (
                  favoriteProfessionals.map((professional) => {
                    const fullName =
                      `${professional.first_name || ""} ${
                        professional.last_name || ""
                      }`.trim() || "Unknown";
                    const rating = professional.average_rating || 0;
                    const reviews = professional.total_reviews || 0;

                    return (
                      <Box
                        key={professional.id}
                        sx={{
                          minWidth: {
                            xs: "calc(85vw - 2rem)",
                            sm: "calc(50% - 1rem)",
                            md: 200,
                          },
                          maxWidth: {
                            xs: "calc(85vw - 2rem)",
                            sm: "none",
                            md: "none",
                          },
                          flexShrink: 0,
                          scrollSnapAlign: "start",
                          borderRadius: { xs: "0.75rem", md: "1.125rem" },
                          p: { xs: "0.75rem", md: "0.875rem" },
                          textAlign: "center",
                          position: "relative",
                          border: "1px solid #DFE8ED",
                          cursor: isDragging ? "grabbing" : "pointer",
                          userSelect: "none",
                          pointerEvents: isDragging ? "none" : "auto",
                        }}
                      >
                        {/* Heart Icon */}
                        <IconButton
                          sx={{
                            position: "absolute",
                            top: { xs: 4, md: 8 },
                            right: { xs: 4, md: 8 },
                            color: "#2C6587",
                            p: 0.5,
                          }}
                        >
                          <FavoriteIcon sx={{ fontSize: { xs: 18, md: 20 } }} />
                        </IconButton>

                        {/* Profile Picture */}
                        <Box
                          sx={{
                            width: { xs: 60, sm: 70, md: 80 },
                            height: { xs: 60, sm: 70, md: 80 },
                            borderRadius: "50%",
                            bgcolor: "grey.300",
                            margin: "0 auto 12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                          }}
                        >
                          {professional.profile_photo_url ? (
                            <Image
                              src={professional.profile_photo_url}
                              alt={fullName}
                              width={80}
                              height={80}
                              style={{
                                objectFit: "cover",
                                borderRadius: "50%",
                                width: "100%",
                                height: "100%",
                              }}
                            />
                          ) : (
                            <AccountCircleIcon
                              sx={{
                                fontSize: { xs: 60, sm: 70, md: 80 },
                                color: "grey.500",
                              }}
                            />
                          )}
                        </Box>

                        {/* Name */}
                        <Typography
                          sx={{
                            mb: { xs: 0.75, md: 1 },
                            textAlign: "left",
                            color: "#323232",
                            fontSize: {
                              xs: "0.9375rem",
                              sm: "1rem",
                              md: "1.125rem",
                            },
                            fontWeight: 500,
                          }}
                        >
                          {fullName}
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
                                fontSize: {
                                  xs: "0.9375rem",
                                  sm: "1rem",
                                  md: "1.063rem",
                                },
                              }}
                            >
                              {rating > 0 ? rating.toFixed(1) : "0.0"}
                            </Typography>
                            <StarIcon
                              sx={{
                                fontSize: { xs: 14, md: 16 },
                                color: "#F59E0B",
                              }}
                            />
                          </Box>

                          {/* Reviews */}
                          <Typography
                            variant="caption"
                            color="#999999"
                            sx={{
                              fontSize: { xs: "0.625rem", md: "0.688rem" },
                              lineHeight: "1rem",
                            }}
                          >
                            ({reviews} {reviews === 1 ? "Review" : "Reviews"})
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })
                )}
              </Box>
            </Box>
          </Box>
        )}
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
