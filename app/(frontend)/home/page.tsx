"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  Stack,
  IconButton,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/Star";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { apiGet } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";

interface Service {
  id: string;
  services_type_photos: string | null;
  name: string;
  services_type_photos_url: string | null;
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
    services: Service[];
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

interface BannerCategory {
  id: string;
  category_name: string;
  banner_url: string;
}

interface BannersApiResponse {
  message: string;
  data: {
    categories: BannerCategory[];
  };
  success: boolean;
  status_code: number;
}

interface ServiceCard {
  id: string;
  title: string;
  description: string;
  bgColor: string;
  buttonColor: string;
  buttonHover: string;
  image: string;
  alt: string;
}

// Helper function to map service names to routes and icons
const getServiceRouteAndIcon = (serviceName: string): { route: string; icon: string } => {
  const nameLower = serviceName.toLowerCase().trim();
  
  const serviceMap: Record<string, { route: string; icon: string }> = {
    "home assistance": { route: ROUTES.HOME_ASSISTANCE, icon: "/icons/home_assistance_icon_home.svg" },
    "transport": { route: ROUTES.TRANSPORT, icon: "/icons/transport.svg" },
    "personal care": { route: ROUTES.PERSONAL_CARE, icon: "/icons/makeup.svg" },
    "tech support": { route: ROUTES.TECH_SUPPORT, icon: "/icons/laptop.svg" },
  };
  
  return serviceMap[nameLower] || { 
    route: `/services/${nameLower.replace(/\s+/g, "-").toLowerCase()}`, 
    icon: "/icons/home_assistance_icon_home.svg" 
  };
};

// Helper function to get colors for service cards based on category name
const getCategoryColors = (categoryName: string, index: number): { bgColor: string; buttonColor: string; buttonHover: string } => {
  const nameLower = categoryName.toLowerCase().trim();
  
  // Predefined color mappings for known categories
  const colorMap: Record<string, { bgColor: string; buttonColor: string; buttonHover: string }> = {
    "pets": { bgColor: "#4A4A4A", buttonColor: "#3A3A3A", buttonHover: "#2A2A2A" },
    "homecare": { bgColor: "#7A4A2E", buttonColor: "#5C3823", buttonHover: "#4A2E1A" },
    "housekeeping": { bgColor: "#A38B7D", buttonColor: "#8C756A", buttonHover: "#75655A" },
    "childcare": { bgColor: "#6B8E8E", buttonColor: "#5A7A7A", buttonHover: "#4A6A6A" },
    "diy": { bgColor: "#8B6F47", buttonColor: "#7A5F3A", buttonHover: "#6A4F2A" },
    "transport": { bgColor: "#5A7A9E", buttonColor: "#4A6A8E", buttonHover: "#3A5A7E" },
    "personal care": { bgColor: "#9E7A9E", buttonColor: "#8E6A8E", buttonHover: "#7E5A7E" },
    "tech support": { bgColor: "#6B8E6B", buttonColor: "#5A7A5A", buttonHover: "#4A6A4A" },
    "gardening": { bgColor: "#7A9E5A", buttonColor: "#6A8E4A", buttonHover: "#5A7E3A" },
  };
  
  // Return mapped color or use a rotating palette
  if (colorMap[nameLower]) {
    return colorMap[nameLower];
  }
  
  // Fallback rotating color palette
  const colors = [
    { bgColor: "#7A4A2E", buttonColor: "#5C3823", buttonHover: "#4A2E1A" },
    { bgColor: "#4A4A4A", buttonColor: "#3A3A3A", buttonHover: "#2A2A2A" },
    { bgColor: "#A38B7D", buttonColor: "#8C756A", buttonHover: "#75655A" },
    { bgColor: "#6B8E8E", buttonColor: "#5A7A7A", buttonHover: "#4A6A6A" },
    { bgColor: "#8B6F47", buttonColor: "#7A5F3A", buttonHover: "#6A4F2A" },
  ];
  
  return colors[index % colors.length];
};

// Helper function to generate title from category name
const getCategoryTitle = (categoryName: string): string => {
  const nameLower = categoryName.toLowerCase().trim();
  
  const titleMap: Record<string, string> = {
    "pets": "Pet care with experts",
    "homecare": "Want a help in Homecare ?",
    "housekeeping": "Clean your kitchen by experts",
    "childcare": "Childcare with professionals",
    "diy": "DIY projects made easy",
    "transport": "Transport services at your doorstep",
    "personal care": "Personal care with experts",
    "tech support": "Tech support when you need it",
    "gardening": "Gardening services by experts",
  };
  
  return titleMap[nameLower] || `Expert ${categoryName} services`;
};

export default function AuthenticatedHomePage() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [favoriteProfessionals, setFavoriteProfessionals] = useState<FavoriteProfessional[]>([]);
  const [favoriteProfessionalsLoading, setFavoriteProfessionalsLoading] = useState(false);
  const [serviceCards, setServiceCards] = useState<ServiceCard[]>([]);
  const [serviceCardsLoading, setServiceCardsLoading] = useState(false);

  // Check if user is authenticated on mount
  useEffect(() => {
    const storedInitial = localStorage.getItem('userInitial');
    const storedEmail = localStorage.getItem('userEmail');
    
    // If user details are not present, redirect to login
    if (!storedInitial || !storedEmail) {
      router.push(ROUTES.LOGIN);
    }

    apiCallToGetHomeScreenDetails();
    fetchBanners();
  }, [router]);

  // Fetch banners for Explore All Services section
  const fetchBanners = async () => {
    setServiceCardsLoading(true);
    try {
      const response = await apiGet<BannersApiResponse>(API_ENDPOINTS.HOME.ALL_BANNERS);
      if (response.success && response.data) {
        const categories = response.data.data?.categories || [];
        
        // Limit to first 3 categories
        const limitedCategories = categories.slice(0, 3);
        
        // Map categories to service cards format
        const mappedCards: ServiceCard[] = limitedCategories.map((category, index) => {
          const colors = getCategoryColors(category.category_name, index);
          return {
            id: category.id,
            title: getCategoryTitle(category.category_name),
            description: "Lorem Ipsum dit.",
            bgColor: colors.bgColor,
            buttonColor: colors.buttonColor,
            buttonHover: colors.buttonHover,
            image: category.banner_url || "/image/explore-service-section-1.png",
            alt: category.category_name,
          };
        });
        
        setServiceCards(mappedCards);
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
      // Keep empty array on error
      setServiceCards([]);
    } finally {
      setServiceCardsLoading(false);
    }
  };

  const apiCallToGetHomeScreenDetails = async () => {
    // Don't call API if user is not authenticated
    const storedInitial = localStorage.getItem('userInitial');
    const storedEmail = localStorage.getItem('userEmail');
    if (!storedInitial || !storedEmail) {
      return;
    }
    
    setServicesLoading(true);
    setFavoriteProfessionalsLoading(true);
    try {
      const response = await apiGet<HomeApiResponse>(API_ENDPOINTS.HOME.HOME);
      if (response.success && response.data) {
        const apiData = response.data;
        
        // Handle services
        if (apiData.data?.services && Array.isArray(apiData.data.services)) {
          // Sort services to ensure "Home Assistance" comes first
          const sortedServices = [...apiData.data.services].sort((a, b) => {
            const aName = a.name.toLowerCase();
            const bName = b.name.toLowerCase();
            
            // Home Assistance should always be first
            if (aName === "home assistance") return -1;
            if (bName === "home assistance") return 1;
            
            // Maintain original order for other services
            return 0;
          });
          
          setServices(sortedServices);
        }
        console.log({apiData})
        
        // Handle favorite professionals
        if (apiData?.data?.favorite_professionals?.records ) {
          setFavoriteProfessionals(apiData.data.favorite_professionals.records);
        } else {
          setFavoriteProfessionals([]);
        }
      }
    } catch (error) {
      console.error("Error fetching home screen details:", error);
    } finally {
      setServicesLoading(false);
      setFavoriteProfessionalsLoading(false);
    }
  };

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


  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>

      <Box sx={{ bgcolor: "#DFE8ED", height: "0.063rem" }} />
      {/* Hero Section */}
      <Box sx={{ pt: { xs: "2rem", sm: "2.5rem", md: "3.563rem" }, px: { xs: "1rem", sm: "2rem", md: "3rem", lg: "5rem" }, pb: { xs: "2rem", sm: "3rem", md: "5rem" } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: { xs: 2, sm: 3, md: 4 },
            alignItems: "center",
          }}
        >
          <Box
          >
            <Typography
              sx={{
                fontSize: { xs: "1.5rem", sm: "1.875rem", md: "2rem", lg: "2.5rem" },
                lineHeight: "150%",
                color: "#323232",
                fontWeight: 600,
                mb: { xs: 1.5, md: 2 },
              }}
            >
              Home Services At Your Doorstep
            </Typography>
            <Typography
              variant="body1"
              color="secondary.naturalGray"
              sx={{
                mb: { xs: 3, sm: 4, md: 8 },
                fontSize: { xs: "0.875rem", sm: "1rem", md: "1.1rem" },
                lineHeight: 1.6,
              }}
            >
              Making home care simple, safe, and accessible for seniors. Find trusted professionals for repairs, cleaning, and more — right at your doorstep.
            </Typography>

            {/* Blue Card - 10 Professionals Connected Today */}
            <Box sx={{ position: "relative", mb: { xs: 2, md: 3 }, overflow: "visible", ml: { xs: 0, md: "1.188rem" } }}>
              <Box
                sx={{
                  bgcolor: "#2F6B8E",
                  color: "white",
                  minHeight: { xs: "10rem", sm: "11rem", md: "12.5rem" },
                  borderRadius: { xs: "0.75rem", md: "1.242rem" },
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: "0.5rem", sm: "0.75rem", md: "0.977rem" },
                  position: "relative",
                  overflow: "visible",
                  px: { xs: "1rem", sm: "1.5rem", md: "1.977rem" },
                  pt: { xs: "1rem", sm: "1.5rem", md: "2rem" },
                }}
              >
                {/* Floating Image */}
                <Box
                  sx={{
                    mt: { xs: "-3rem", sm: "-4rem", md: "-5.625rem" },
                    display: { xs: "none", sm: "block" },
                  }}
                >
                  <Image
                    src="/image/how-work-img-3.png"
                    alt="Professional"
                    style={{
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                    width={204}
                    height={137}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1 }, mb: 1, flexWrap: "wrap" }}>
                    <Typography
                      sx={{
                        fontSize: { xs: "1.5rem", sm: "2.5rem", md: "3rem", lg: "3.276rem" },
                        lineHeight: { xs: "1.5rem", sm: "2rem", md: "2.184rem" },
                        fontWeight: "600"
                      }}
                    >
                      10
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: "0.875rem", sm: "1rem", md: "1.365rem" },
                        lineHeight: { xs: "1.2rem", sm: "1.4rem", md: "1.638rem" },
                      }}
                    >
                      Professionals <br />Connected Today
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      opacity: 0.9,
                      fontSize: { xs: "0.625rem", sm: "0.75rem", md: "0.875rem" },
                      lineHeight: { xs: "0.875rem", sm: "1rem", md: "1.125rem" },
                    }}
                  >
                    Lorem ipsum a pharetra mattis dilt pulvinar tortor amet vulputate.
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Yellow Home Assistance Button */}
            {services.length > 0 && (() => {
              const firstService = services[0];
              const { route, icon } = getServiceRouteAndIcon(firstService.name);
              return (
                <Box
                  component={Link}
                  href={route}
                  sx={{
                    borderTopLeftRadius: { xs: "0.5rem", md: "0.75rem" },
                    borderTopRightRadius: { xs: "1.5rem", md: "2.5rem" },
                    borderBottomLeftRadius: { xs: "1.5rem", md: "2.5rem" },
                    borderBottomRightRadius: { xs: "0.5rem", md: "0.75rem" },
                    bgcolor: "#FDBE12",
                    mb: { xs: "1rem", md: "1.563rem" },
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    overflow: "hidden",
                    textDecoration: "none",
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: "#E6A910",
                    },
                  }}
                >
                  <Box sx={{
                    px: { xs: "1.5rem", sm: "2.5rem", md: "3.75rem" },
                    py: { xs: "1.5rem", sm: "2rem", md: "2.75rem" },
                    ml: { xs: 0, md: "1.188rem" },
                    flex: 1,
                  }} >
                    <Typography
                      sx={{
                        color: "#323232",
                        fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem", lg: "2rem" },
                        fontWeight: 600,
                        lineHeight: { xs: "1.5rem", md: "1.75rem" }
                      }}
                    >
                      {firstService.name}
                    </Typography>

                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mr: { xs: "0.25rem", md: "0.5rem" }, flexShrink: 0 }}>
                    {firstService.services_type_photos_url ? (
                      <Image
                        src={firstService.services_type_photos_url}
                        alt={firstService.name}
                        width={98}
                        height={95}
                        style={{ objectFit: "contain", width: "auto", height: "auto", maxWidth: "60px", maxHeight: "60px" }}
                        sizes="(max-width: 768px) 60px, 98px"
                      />
                    ) : (
                      <Image
                        src={icon}
                        alt={firstService.name}
                        width={98}
                        height={95}
                        style={{ objectFit: "contain", width: "auto", height: "auto", maxWidth: "60px", maxHeight: "60px" }}
                        sizes="(max-width: 768px) 60px, 98px"
                      />
                    )}
                  </Box>
                </Box>
              );
            })()}
            {servicesLoading && (
              <Box
                sx={{
                  borderTopLeftRadius: { xs: "0.5rem", md: "0.75rem" },
                  borderTopRightRadius: { xs: "1.5rem", md: "2.5rem" },
                  borderBottomLeftRadius: { xs: "1.5rem", md: "2.5rem" },
                  borderBottomRightRadius: { xs: "0.5rem", md: "0.75rem" },
                  bgcolor: "#FDBE12",
                  mb: { xs: "1rem", md: "1.563rem" },
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  overflow: "hidden",
                  px: { xs: "1.5rem", sm: "2.5rem", md: "3.75rem" },
                  py: { xs: "1.5rem", sm: "2rem", md: "2.75rem" },
                  ml: { xs: 0, md: "1.188rem" },
                }}
              >
                <Typography
                  sx={{
                    color: "#323232",
                    fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem", lg: "2rem" },
                    fontWeight: 600,
                    lineHeight: { xs: "1.5rem", md: "1.75rem" }
                  }}
                >
                  Loading...
                </Typography>
              </Box>
            )}

            {/* Service Icons */}
            {services.length > 1 && (
              <Box
                sx={{
                  display: "flex",
                  gap: { xs: 1.5, sm: 2, md: 3 },
                  flexWrap: "wrap",
                }}
              >
                {services.slice(1).map((service, index) => {
                  const { route, icon } = getServiceRouteAndIcon(service.name);
                  const isFirst = index === 0;
                  const isLast = index === services.slice(1).length - 1;
                  
                  return (
                    <Box
                      key={service.id}
                      component={Link}
                      href={route}
                      sx={{
                        flex: { xs: "1 1 calc(50% - 0.75rem)", sm: "1 1 calc(33.333% - 1.33rem)", md: 1 },
                        minWidth: { xs: "calc(50% - 0.75rem)", sm: 120, md: "auto" },
                        p: { xs: 1.5, sm: 2, md: 3 },
                        cursor: "pointer",
                        borderRadius: { xs: "0.5rem", md: "12.17px" },
                        borderTopLeftRadius: isFirst ? { xs: "1rem", md: "2.535rem" } : { xs: "0.5rem", md: "12.17px" },
                        borderTopRightRadius: isLast ? { xs: "1rem", md: "2.535rem" } : { xs: "0.5rem", md: "12.17px" },
                        textAlign: "center",
                        bgcolor: "grey.100",
                        border: "none",
                        textDecoration: "none",
                        "&:hover": {
                          bgcolor: "grey.200",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          mb: { xs: 1, md: 1.5 },
                          height: { xs: 48, sm: 56, md: 64 },
                        }}
                      >
                        {service.services_type_photos_url ? (
                          <Image
                            src={service.services_type_photos_url}
                            alt={service.name}
                            width={64}
                            height={64}
                            style={{ objectFit: "contain", width: "auto", height: "auto", maxWidth: "100%", maxHeight: "100%" }}
                            sizes="(max-width: 600px) 48px, (max-width: 960px) 56px, 64px"
                          />
                        ) : (
                          <Image
                            src={icon}
                            alt={service.name}
                            width={64}
                            height={64}
                            style={{ objectFit: "contain", width: "auto", height: "auto", maxWidth: "100%", maxHeight: "100%" }}
                            sizes="(max-width: 600px) 48px, (max-width: 960px) 56px, 64px"
                          />
                        )}
                      </Box>
                      <Typography
                        variant="body1"
                        fontWeight="500"
                        sx={{ 
                          color: "text.primary",
                          fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" }
                        }}
                      >
                        {service.name}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            )}
            {servicesLoading && services.length === 0 && (
              <Box
                sx={{
                  display: "flex",
                  gap: { xs: 1.5, sm: 2, md: 3 },
                  flexWrap: "wrap",
                }}
              >
                {[1, 2, 3].map((index) => (
                  <Box
                    key={index}
                    sx={{
                      flex: { xs: "1 1 calc(50% - 0.75rem)", sm: "1 1 calc(33.333% - 1.33rem)", md: 1 },
                      minWidth: { xs: "calc(50% - 0.75rem)", sm: 120, md: "auto" },
                      p: { xs: 1.5, sm: 2, md: 3 },
                      borderRadius: { xs: "0.5rem", md: "12.17px" },
                      textAlign: "center",
                      bgcolor: "grey.100",
                      border: "none",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", fontSize: { xs: "0.875rem", md: "1rem" } }}
                    >
                      Loading...
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
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
                borderBottomLeftRadius: "8.5rem"
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "50%"
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
                  height: "50%"
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
                borderBottomRightRadius: "0.75rem"
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "30%"
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
                  height: "70%"
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
      </Box>

      {/* Explore All Services Section */}
      <Box sx={{ bgcolor: "white", py: { xs: 4, sm: 6, md: 8 } }}>
        <Box>
          <Box sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: { xs: "flex-start", sm: "center" }, 
            mb: { xs: 3, sm: 4, md: 6 }, 
            px: { xs: "1rem", sm: "2rem", md: "3rem", lg: "5rem" },
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 2, sm: 0 }
          }}>
            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{
                color: "#2F6B8E",
                fontSize: { xs: "1.5rem", sm: "1.875rem", md: "2rem", lg: "2.5rem" },
              }}
            >
              Explore All Services
            </Typography>
            <Button
              component={Link}
              href="/services/home-assistance"
              variant="outlined"
              sx={{
                textTransform: "none",
                borderColor: "#2F6B8E",
                color: "#2F6B8E",
                display: { xs: "block", md: "block" },
                fontSize: { xs: "0.875rem", md: "1rem" },
                px: { xs: 2, md: 3 },
                py: { xs: 0.75, md: 1 },
                "&:hover": {
                  borderColor: "#25608A",
                  bgcolor: "rgba(47, 107, 142, 0.1)",
                },
              }}
            >
              View All
            </Button>
          </Box>

          {/* Service Cards Grid */}
          <Box
            sx={{
              px: { xs: "1rem", sm: "2rem", md: "3rem", lg: "5rem" },
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
              gap: { xs: 2, sm: 2.5, md: 3 },
              gridAutoRows: "auto",
            }}
          >
            {serviceCardsLoading ? (
              // Loading skeleton
              [1, 2, 3].map((index) => (
                <Box
                  key={index}
                  sx={{
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    borderRadius: { xs: "0.75rem", md: "1.25rem" },
                    minHeight: { xs: 250, sm: 200, md: 200 },
                    bgcolor: "grey.100",
                  }}
                >
                  <Box
                    sx={{
                      flex: { xs: "1 1 auto", sm: "0 0 50%" },
                      bgcolor: "grey.200",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: { xs: 150, sm: 200 },
                    }}
                  >
                    <Typography sx={{ color: "grey.400", fontSize: { xs: "0.875rem", md: "1rem" } }}>Loading...</Typography>
                  </Box>
                  <Box
                    sx={{
                      flex: { xs: "1 1 auto", sm: "0 0 50%" },
                      bgcolor: "grey.200",
                      minHeight: { xs: 100, sm: 200 },
                    }}
                  />
                </Box>
              ))
            ) : serviceCards.length === 0 ? (
              <Box sx={{ gridColumn: "1 / -1", textAlign: "center", py: 4 }}>
                <Typography sx={{ color: "text.secondary" }}>No services available</Typography>
              </Box>
            ) : (
              serviceCards.slice(0, 3).map((card) => (
              <Box
                key={card.id}
                sx={{
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  borderRadius: { xs: "0.75rem", md: "1.25rem" },
                  flexShrink: 0,
                  scrollSnapAlign: "start",
                  userSelect: "none",
                  pointerEvents: isDragging ? "none" : "auto",
                }}
              >
                <Box
                  sx={{
                    bgcolor: card.bgColor,
                    py: { xs: "1.5rem", sm: "1.75rem", md: "2.188rem" },
                    px: { xs: "1rem", sm: "1.25rem", md: "1.438rem" },
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    flex: { xs: "1 1 auto", sm: "0 0 50%" },
                    color: "white",
                    minHeight: { xs: "auto", sm: "200px" },
                  }}
                >
                  <Box>
                    <Typography
                      sx={{ 
                        fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem", lg: "2rem" }, 
                        color: "white", 
                        fontWeight: 500, 
                        lineHeight: { xs: "1.5rem", md: "1.75rem" } 
                      }}
                    >
                      {card.title}
                    </Typography>
                    <Typography
                      sx={{ 
                        fontSize: { xs: "0.625rem", sm: "0.6875rem", md: "0.75rem" }, 
                        lineHeight: "150%", 
                        mb: { xs: "1rem", md: "1.25rem" }, 
                        mt: { xs: "0.25rem", md: "0.375rem" },
                      }}
                    >
                      {card.description}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: card.buttonColor,
                      color: "white",
                      marginRight: "auto",
                      lineHeight: "150%",
                      fontSize: { xs: "0.75rem", md: "0.875rem" },
                      borderRadius: "6.25rem ",
                      py: { xs: "0.25rem", md: "0.375rem" },
                      px: { xs: "0.625rem", md: "0.813rem" },
                      mt: { xs: 1, md: 0 },
                    }}
                  >
                    Book Now
                  </Button>
                </Box>
                <Box
                  sx={{
                    position: "relative",
                    flex: { xs: "1 1 auto", sm: "0 0 50%" },
                    minHeight: { xs: 200, sm: 200, md: "100%" },
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  <Image
                    src={card.image}
                    alt={card.alt}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
                    draggable={false}
                  />
                </Box>
              </Box>
              ))
            )}
          </Box>
        </Box>
      </Box>

      {/* App Download Section */}
      <Box sx={{ bgcolor: '#F8F8F8', py: { xs: 4, sm: 6, md: 8 } }}>
        <Container maxWidth="lg" sx={{ px: { xs: "1rem", sm: "2rem", md: "3rem" } }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: { xs: 3, sm: 4, md: 6 },
              alignItems: 'center',
            }}
          >
            {/* Left Side - Phone Mockups */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                order: { xs: 2, md: 1 },
              }}
            >
              {/* Left Phone */}
              <Box
                sx={{
                  position: 'relative',
                  width: { xs: 150, sm: 200, md: "29.75rem" },
                  height: { xs: 300, sm: 400, md: "44.5rem" },
                  zIndex: 2,
                }}
              >
                <Image
                  src="/icons/dualMobile.png"
                  alt="CoudPouss App - Home Screen"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </Box>
            </Box>

            {/* Right Side - Text and Download Links */}
            <Box sx={{ order: { xs: 1, md: 2 } }}>
              <Typography
                sx={{
                  color: '#222222',
                  fontWeight: 600,
                  lineHeight: "100%",
                  mb: { xs: "1rem", md: "1.75rem" },
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem', lg: '3.125rem' }
                }}
              >
                Download the new CoudPouss app
              </Typography>

              {/* Download For Free Button */}
              <Typography
                variant="body1"
                color="secondary.naturalGray"
                sx={{
                  mb: { xs: 2, sm: 3, md: 4 },
                  fontSize: { xs: "0.875rem", sm: "1rem", md: "1.1rem" },
                  lineHeight: 1.6,
                }}
              >
                Lorem ipsum dolor sit amet consectetur. Egestas ac velit donec quisque. Vel suscipit donec non varius placerat. Eu at vitae sit varius bibendum semper eget.
              </Typography>

              {/* App Store Badges */}
              <Box>
                {/* Apple App Store Badge */}




                <Box sx={{
                  alignItems: { xs: "flex-start", sm: "center" },
                  display: "flex",
                  gap: { xs: "0.5rem", sm: "0.75rem" },
                  flexDirection: { xs: "column", sm: "row" },
                  flexWrap: "wrap",
                }}  >

                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: 'secondary.main',
                      color: 'white',
                      textTransform: 'none',
                      borderRadius: 2,
                      px: { xs: 3, md: 4 },
                      py: { xs: 1, md: 1.5 },
                      fontSize: { xs: '0.875rem', md: '1rem' },
                      fontWeight: 'bold',
                      lineHeight: "1.125rem",
                      width: { xs: "100%", sm: "auto" },
                      '&:hover': {
                        bgcolor: '#D97706',
                      },
                    }}
                  >
                    Download For Free
                  </Button>
                  <Box
                    sx={{
                      display: "flex",
                      gap: { xs: "0.5rem", sm: "0.75rem" },
                      width: { xs: "100%", sm: "auto" },
                    }}
                  >
                    <Image
                      alt="download"
                      width={118}
                      height={36}
                      src={"/icons/downloadAppStoreButton.png"}
                      style={{ width: "auto", height: "auto", maxWidth: "100px", maxHeight: "30px" }}
                    />

                    <Image
                      alt="download"
                      width={118}
                      height={36}
                      src={"/icons/googlePlayDownloadButton.png"}
                      style={{ width: "auto", height: "auto", maxWidth: "100px", maxHeight: "30px" }}
                    />
                  </Box>
                </Box>

              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Favorite Professionals Section */}
      {(favoriteProfessionalsLoading || favoriteProfessionals.length > 0) && (
        <Box sx={{ bgcolor: "white", p: { xs: "1.5rem", sm: "2.5rem", md: "3rem", lg: "5rem" } }}>
          <Box >
            <Box sx={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: { xs: "flex-start", sm: "center" }, 
              mb: { xs: "1.5rem", md: "2rem" },
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 1.5, sm: 0 }
            }}>
              <Typography
                sx={{
                  color: "text.primary",
                  fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.688rem" },
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
                    px: { xs: "1rem", md: "1.25rem" },
                    py: { xs: "0.375rem", md: "0.5rem" },
                    display: { xs: "block", md: "block" },
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
              ref={carouselRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              sx={{
                display: { xs: "flex", sm: "grid" },
                gridTemplateColumns: { xs: "none", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
                flexDirection: { xs: "row", sm: "unset" },
                gap: { xs: 1.5, sm: 2 },
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
                <Box sx={{ gridColumn: "1 / -1", textAlign: "center", py: 4 }}>
                  <Typography sx={{ color: "text.secondary" }}>Loading professionals...</Typography>
                </Box>
              ) : favoriteProfessionals.length === 0 ? (
                <Box sx={{ gridColumn: "1 / -1", textAlign: "center", py: 4 }}>
                  <Typography sx={{ color: "text.secondary" }}>No favorite professionals yet</Typography>
                </Box>
              ) : (
                favoriteProfessionals.map((professional) => {
                  const fullName = `${professional.first_name || ""} ${professional.last_name || ""}`.trim() || "Unknown";
                  const rating = professional.average_rating || 0;
                  const reviews = professional.total_reviews || 0;
                  
                  return (
                    <Box
                      key={professional.id}
                      sx={{
                        minWidth: { xs: "calc(85vw - 2rem)", sm: "calc(50% - 1rem)", md: 200 },
                        maxWidth: { xs: "calc(85vw - 2rem)", sm: "none", md: "none" },
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
                          <AccountCircleIcon sx={{ fontSize: { xs: 60, sm: 70, md: 80 }, color: "grey.500" }} />
                        )}
                      </Box>

                      {/* Name */}
                      <Typography sx={{ 
                        mb: { xs: 0.75, md: 1 }, 
                        textAlign: 'left', 
                        color: "#323232", 
                        fontSize: { xs: "0.9375rem", sm: "1rem", md: "1.125rem" }, 
                        fontWeight: 500 
                      }}>
                        {fullName}
                      </Typography>
                      <Box sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }} >
                        {/* Rating */}
                        <Box sx={{ display: "flex", gap: 0.5, mb: "0.375rem", alignItems: "center" }}>
                          <Typography sx={{
                            textAlign: 'left',
                            color: "secondary.naturalGray",
                            fontSize: { xs: "0.9375rem", sm: "1rem", md: "1.063rem" }
                          }}>
                            {rating > 0 ? rating.toFixed(1) : "0.0"}
                          </Typography>
                          <StarIcon sx={{ fontSize: { xs: 14, md: 16 }, color: "#F59E0B" }} />
                        </Box>

                        {/* Reviews */}
                        <Typography variant="caption" color="#999999" sx={{
                          fontSize: { xs: "0.625rem", md: "0.688rem" },
                          lineHeight: "1rem"
                        }} >
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
  );
}

