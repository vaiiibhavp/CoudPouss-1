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
import { ROUTES } from "@/constants/routes";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { apiGet } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";

export default function AuthenticatedHomePage() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Check if user is authenticated on mount
  useEffect(() => {
    const storedInitial = localStorage.getItem('userInitial');
    const storedEmail = localStorage.getItem('userEmail');
    
    // If user details are not present, redirect to login
    if (!storedInitial || !storedEmail) {
      router.push(ROUTES.LOGIN);
    }

    apiCallToGetHomeScreenDetails()
  }, [router]);

  // Service cards data
  const serviceCards = [
    {
      id: 1,
      title: "Want a help in Furniture Fixing ?",
      description: "Lorem Ipsum dit.",
      bgColor: "#7A4A2E",
      buttonColor: "#5C3823",
      buttonHover: "#4A2E1A",
      image: "/image/explore-service-section-1.png",
      alt: "Furniture Fixing",
    },
    {
      id: 2,
      title: "Pet care with experts",
      description: "Lorem Ipsum dit.",
      bgColor: "#4A4A4A",
      buttonColor: "#3A3A3A",
      buttonHover: "#2A2A2A",
      image: "/image/explore-service-section-2.png",
      alt: "Pet Care",
    },
    {
      id: 3,
      title: "Clean your kitchen by experts",
      description: "Lorem Ipsum dit.",
      bgColor: "#A38B7D",
      buttonColor: "#8C756A",
      buttonHover: "#75655A",
      image: "/image/explore-service-section-3.png",
      alt: "Kitchen Cleaning",
    },
  ];

  const apiCallToGetHomeScreenDetails = async() => {
    const response = await apiGet(API_ENDPOINTS.HOME.HOME)
    console.log(response)
  }

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
      <Box sx={{ pt: "3.563rem", px: "5rem", pb: "5rem" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 4,
            alignItems: "center",
          }}
        >
          <Box
          >
            <Typography
              sx={{
                fontSize: { xs: "2rem", md: "2.5rem" },
                lineHeight: "150%",
                color: "#323232",
                fontWeight: 600,
                mb: 2,
              }}
            >
              Home Services At Your Doorstep
            </Typography>
            <Typography
              variant="body1"
              color="secondary.naturalGray"
              sx={{
                mb: 8,
                fontSize: "1.1rem",
                lineHeight: 1.6,
              }}
            >
              Making home care simple, safe, and accessible for seniors. Find trusted professionals for repairs, cleaning, and more — right at your doorstep.
            </Typography>

            {/* Blue Card - 10 Professionals Connected Today */}
            <Box sx={{ position: "relative", mb: 3, overflow: "visible", ml: "1.188rem" }}>
              <Box
                sx={{
                  bgcolor: "#2F6B8E",
                  color: "white",
                  minHeight: "12.5rem",
                  borderRadius: "1.242rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.977rem",
                  position: "relative",
                  overflow: "visible",
                }}
              >
                {/* Floating Image */}
                <Box
                  sx={{
                    mt: "-5.625rem",
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
                <Box >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <Typography
                      sx={{
                        fontSize: { xs: "2rem", sm: "3rem", md: "3.276rem" },
                        lineHeight: "2.184rem",
                        fontWeight: "600"
                      }}
                    >
                      10
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: "1rem", sm: "1.1rem", md: "1.365rem" },
                        lineHeight: "1.638rem",
                      }}
                    >
                      Professionals <br />Connected Today
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      opacity: 0.9,
                      fontSize: { xs: "0.675rem", sm: "0.775rem", md: "0.875rem" },
                      lineHeight: "1.125rem",
                    }}
                  >
                    Lorem ipsum a pharetra mattis dilt pulvinar tortor amet vulputate.
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Yellow Home Assistance Button */}
            <Box
              sx={{
                borderTopLeftRadius: "0.75rem",
                borderTopRightRadius: "2.5rem",
                borderBottomLeftRadius: "2.5rem",
                borderBottomRightRadius: "0.75rem",
                bgcolor: "#FDBE12",
                mb: "1.563rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                overflow: "hidden"
              }}
            >
              <Box sx={{
                px: "3.75rem",
                py: "2.75rem",
                ml: "1.188rem",
              }} >
                <Typography
                  sx={{
                    color: "#323232",
                    fontSize: "2rem",
                    fontWeight: 600,
                    lineHeight: "1.75rem"
                  }}
                >
                  Home Assistance
                </Typography>

              </Box>
              <div className="d-flex w-full justify-items-end mr-25">
                <Image
                  src={"/icons/home_assistance_icon_home.svg"}
                  alt={"home-assistance"}
                  width={98}
                  style={{marginRight: "0.5rem"}}
                  height={95}
                />
              </div>
            </Box>

            {/* Service Icons */}
            <Box
              sx={{
                display: "flex",
                gap: 3,
                flexWrap: "wrap",
              }}
            >
              {[
                { icon: "/icons/transport.svg", label: "Transport", color: "#EF4444", borderTopLeftRadius: "2.535rem", borderRadius: "12.17px" },
                { icon: "/icons/makeup.svg", label: "Personal Care", color: "#3B82F6", borderRadius: "12.17px" },
                { icon: "/icons/laptop.svg", label: "Tech Support", color: "#10B981", borderRadius: "12.17px", borderTopRightRadius: "2.535rem" },
              ].map((service, index) => (
                <Box
                  key={index}
                  sx={{
                    flex: 1,
                    minWidth: { xs: "100%", sm: 120 },
                    p: 3,
                    cursor: "pointer",
                    borderRadius: service.borderRadius,
                    borderTopLeftRadius: service.borderTopLeftRadius,
                    borderTopRightRadius: service.borderTopRightRadius,
                    textAlign: "center",
                    bgcolor: "grey.100",
                    border: "none",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      mb: 1.5,
                      height: 64,
                    }}
                  >
                    <Image
                      src={service.icon}
                      alt={service.label}
                      width={64}
                      height={64}
                      style={{ objectFit: "contain" }}
                    />
                  </Box>
                  <Typography
                    variant="body1"
                    fontWeight="500"
                    sx={{ color: "text.primary" }}
                  >
                    {service.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
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
                  src="/image/service-image-2.png"
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
                  src="/image/service-image-3.png"
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
      <Box sx={{ bgcolor: "white", py: 8 }}>
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 6, px: "5rem" }}>
            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{
                color: "#2F6B8E",
                fontSize: { xs: "2rem", md: "2.5rem" },
              }}
            >
              Explore All Services
            </Typography>
            <Button
              variant="outlined"
              sx={{
                textTransform: "none",
                borderColor: "#2F6B8E",
                color: "#2F6B8E",
                display: { xs: "none", md: "block" },
                "&:hover": {
                  borderColor: "#25608A",
                  bgcolor: "rgba(47, 107, 142, 0.1)",
                },
              }}
            >
              View All
            </Button>
          </Box>

          {/* Service Cards Grid */},
          <Box
            sx={{
              px: "5rem",
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 3,
            }}
          >
            {serviceCards.map((card) => (
              <Box
                key={card.id}
                sx={{
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  display: "flex",
                  flexDirection: "row",
                  borderRadius: "1.25rem",
                  flexShrink: 0,
                  scrollSnapAlign: "start",
                  userSelect: "none",
                  pointerEvents: isDragging ? "none" : "auto",
                }}
              >
                <Box
                  sx={{
                    bgcolor: card.bgColor,
                    py: "2.188rem",
                    px: "1.438rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    flex: "0 0 50%",
                    color: "white",
                  }}
                >
                  <Box>
                    <Typography
                      sx={{ fontSize: "2rem", color: "white", fontWeight: 500, lineHeight: "1.75rem" }}
                    >
                      {card.title}
                    </Typography>
                    <Typography
                      sx={{ fontSize: "0.75rem", lineHeight: "150%", mb: "1.25rem", mt: "0.375rem", }}
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
                      fontSize: "0.875rem",
                      borderRadius: "6.25rem ",
                      py: "0.375rem",
                      px: "0.813rem",
                    }}
                  >
                    Book Now
                  </Button>
                </Box>
                <Box
                  sx={{
                    position: "relative",
                    flex: "0 0 50%",
                    minHeight: { xs: 200, md: "100%" },
                  }}
                >
                  <Image
                    src={card.image}
                    alt={card.alt}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 85vw, 33vw"
                    draggable={false}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* App Download Section */}
      <Box sx={{ bgcolor: '#F8F8F8', py: 8 }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 6,
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

              }}
            >
              {/* Left Phone */}
              <Box
                sx={{
                  position: 'relative',
                  width: { xs: 150, md: "29.75rem" },
                  height: { xs: 300, md: "44.5rem" },
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
            <Box>
              <Typography
                sx={{
                  color: '#222222',
                  fontWeight: 600,
                  lineHeight: "100%",
                  mb: "1.75rem",
                  fontSize: { xs: '2rem', md: '3.125rem' }
                }}
              >
                Download the new CoudPouss app
              </Typography>

              {/* Download For Free Button */}
              <Typography
                variant="body1"
                color="secondary.naturalGray"
                sx={{
                  mb: 4,
                  fontSize: "1.1rem",
                  lineHeight: 1.6,
                }}
              >
                Lorem ipsum dolor sit amet consectetur. Egestas ac velit donec quisque. Vel suscipit donec non varius placerat. Eu at vitae sit varius bibendum semper eget.
              </Typography>

              {/* App Store Badges */}
              <Box>
                {/* Apple App Store Badge */}




                <Box sx={{
                  alignItems: "center",
                  display: "flex",
                  gap: "0.75rem"
                }}  >


                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: 'secondary.main',
                      color: 'white',
                      textTransform: 'none',
                      borderRadius: 2,
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      lineHeight: "1.125rem",

                      '&:hover': {
                        bgcolor: '#D97706',
                      },
                    }}
                  >
                    Download For Free
                  </Button>
                  <Box
                  >
                    <Image
                      alt="download"
                      width={118}
                      height={36}
                      src={"/icons/downloadAppStoreButton.png"}
                    />
                  </Box>


                  <Box
                  >
                    <Image
                      alt="download"
                      width={118}
                      height={36}
                      src={"/icons/googlePlayDownloadButton.png"}
                    />
                  </Box>
                </Box>

              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Favorite Professionals Section */}
      <Box sx={{ bgcolor: "white", p: "5rem" }}>
        <Box >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: "2rem" }}>
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
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)", // 4 columns
              gap: 2,
              overflowX: "hidden",   // no horizontal scroll
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
                      top: 8,
                      right: 8,
                      color: "#2C6587",
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
                      margin: "0 auto 12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    <AccountCircleIcon sx={{ fontSize: 80, color: "grey.500" }} />
                  </Box>

                  {/* Name */}
                  <Typography sx={{ mb: 1, textAlign: 'left', color: "#323232", fontSize: "1.125rem", fontWeight: 500 }}>
                    {professional.name}
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
                        fontSize: "1.063rem"
                      }}>
                        {professional.rating}
                      </Typography>
                      <StarIcon sx={{ fontSize: 16, color: "#F59E0B" }} />
                    </Box>

                    {/* Reviews */}
                    <Typography variant="caption" color="#999999" sx={{
                      fontSize: "0.688rem",
                      lineHeight: "1rem"
                    }} >
                      ({professional.reviews} Reviews)
                    </Typography>

                  </Box>
                </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

