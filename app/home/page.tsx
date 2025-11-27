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
      

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 4,
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              variant="h2"
              fontWeight="bold"
              gutterBottom
              sx={{
                fontSize: { xs: "2rem", md: "3rem" },
                lineHeight: 1.2,
                color: "text.primary",
                mb: 2,
              }}
            >
              Home Services At Your Doorstep
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                mb: 8,
                fontSize: "1.1rem",
                lineHeight: 1.6,
              }}
            >
              Making home care simple, safe, and accessible for seniors. Find
              trusted professionals for repairs, cleaning, and more — right at
              your doorstep.
            </Typography>

            {/* Blue Card - 10 Professionals Connected Today */}
            <Box sx={{ position: "relative", mb: 3, overflow: "visible" }}>
              <Card
                sx={{
                  bgcolor: "#2F6B8E",
                  color: "white",
                  padding: "23px",
                  paddingLeft: "265px",
                  minHeight: "175px",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  position: "relative",
                  overflow: "visible",
                }}
              >
                {/* Floating Image */}
                <Box
                  component="div"
                  sx={{
                    position: "absolute",
                    left: "2px",
                    top: "-20px",
                    width: "186px",
                    height: "209px",
                    borderRadius: 2,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                    zIndex: 2,
                  }}
                >
                  <Image
                    src="/image/how-work-img-3.png"
                    alt="Professional"
                    fill
                    style={{
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                    sizes="(max-width: 600px) 140px, (max-width: 960px) 180px, 220px"
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <Typography 
                      variant="h2" 
                      fontWeight="bold" 
                      sx={{ 
                        fontSize: { xs: "3rem", sm: "4rem", md: "5rem" },
                        lineHeight: 1,
                      }}
                    >
                      10
                    </Typography>
                    <Typography 
                      variant="h6" 
                      fontWeight="bold" 
                      sx={{ 
                        fontSize: { xs: "1rem", sm: "1.2rem", md: "1.4rem" },
                        lineHeight: 1.2,
                      }}
                    >
                      Professionals<br />Connected Today
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      opacity: 0.9,
                      fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                      lineHeight: 1.6,
                    }}
                  >
                    Lorem ipsum a pharetra mattis dilt pulvinar tortor amet vulputate.
                  </Typography>
                </Box>
              </Card>
            </Box>

            {/* Yellow Home Assistance Button */}
            <Button
              variant="contained"
              size="large"
              fullWidth
              sx={{
                bgcolor: "#F59E0B",
                color: "text.primary",
                textTransform: "none",
                px: 4,
                py: 4,
                borderRadius: "8px 24px 8px 24px", // top-left and bottom-right: 8px (less), top-right and bottom-left: 24px (more)
                fontSize: "1.1rem",
                fontWeight: "bold",
                mb: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                "&:hover": {
                  bgcolor: "#D97706",
                },
              }}
              endIcon={
                <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                  <Image
                    src="/icons/home-assistance.png"
                    alt="Home Assistance"
                    width={52}
                    height={52}
                    style={{ objectFit: "contain" }}
                  />
                </Box>
              }
            >
              Home Assistance
            </Button>

            {/* Service Icons */}
            <Box
              sx={{
                display: "flex",
                gap: 3,
                flexWrap: "wrap",
              }}
            >
              {[
                { icon: "/icons/transport.png", label: "Transport", color: "#EF4444" },
                { icon: "/icons/personal-care.png", label: "Personal Care", color: "#3B82F6" },
                { icon: "/icons/support.png", label: "Tech Support", color: "#10B981" },
              ].map((service, index) => (
                <Card
                  key={index}
                  sx={{
                    flex: 1,
                    minWidth: { xs: "100%", sm: 120 },
                    p: 3,
                    cursor: "pointer",
                    borderRadius: 2,
                    textAlign: "center",
                    bgcolor: "grey.100",
                    border: "none",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    },
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
                </Card>
              ))}
            </Box>
          </Box>
          <Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 2,
                width: "100%",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  borderRadius: 3,
                  overflow: "hidden",
                  aspectRatio: "1 / 1",
                  bgcolor: "grey.200",
                  width: "100%",
                  height: "100%",
                  minHeight: { xs: 150, sm: 200, md: 250 },
                }}
              >
                <Image
                  src="/image/service-image-1.png"
                  alt="Service - TV Installation"
                  fill
                  priority
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </Box>
              <Box
                sx={{
                  position: "relative",
                  borderRadius: 3,
                  overflow: "hidden",
                  aspectRatio: "1 / 1",
                  bgcolor: "grey.200",
                  width: "100%",
                  height: "100%",
                  minHeight: { xs: 150, sm: 200, md: 250 },
                }}
              >
                <Image
                  src="/image/service-image-2.png"
                  alt="Service - Tools and Equipment"
                  fill
                  priority
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </Box>
              <Box
                sx={{
                  position: "relative",
                  borderRadius: 3,
                  overflow: "hidden",
                  aspectRatio: "1 / 1",
                  bgcolor: "grey.200",
                  width: "100%",
                  height: "100%",
                  minHeight: { xs: 150, sm: 200, md: 250 },
                }}
              >
                <Image
                  src="/image/service-image-3.png"
                  alt="Service - Beauty Treatment"
                  fill
                  priority
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </Box>
              <Box
                sx={{
                  position: "relative",
                  borderRadius: 3,
                  overflow: "hidden",
                  aspectRatio: "1 / 1",
                  bgcolor: "grey.200",
                  width: "100%",
                  height: "100%",
                  minHeight: { xs: 150, sm: 200, md: 250 },
                }}
              >
                <Image
                  src="/image/service-image-4.png"
                  alt="Service - Delivery and Assistance"
                  fill
                  priority
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Explore All Services Section */}
      <Box sx={{ bgcolor: "white", py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 6 }}>
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

          {/* Service Cards Grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 3,
            }}
          >
            {serviceCards.map((card) => (
              <Card
                key={card.id}
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  display: "flex",
                  flexDirection: "row",
                  height: { xs: "auto", md: 200 },
                }}
              >
                <Box
                  sx={{
                    bgcolor: card.bgColor,
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    flex: "0 0 50%",
                    color: "white",
                  }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{ mb: 1, fontSize: "1.1rem", color: "white" }}
                    >
                      {card.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255,255,255,0.9)", mb: 2 }}
                    >
                      {card.description}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: card.buttonColor,
                      color: "white",
                      textTransform: "none",
                      borderRadius: 2,
                      py: 1,
                      "&:hover": {
                        bgcolor: card.buttonHover,
                      },
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
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </Box>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* App Download Section */}
      <Box sx={{ bgcolor: 'white', py: 8 }}>
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
                gap: 2,
              }}
            >
              {/* Left Phone */}
              <Box
                sx={{
                  position: 'relative',
                  width: { xs: 150, md: 220 },
                  height: { xs: 300, md: 440 },
                  transform: 'rotate(-5deg)',
                  zIndex: 2,
                }}
              >
                <Image
                  src="/icons/iPhone-left.png"
                  alt="CoudPouss App - Home Screen"
                  fill
                  style={{ objectFit: 'contain' }}
                  sizes="(max-width: 768px) 150px, 220px"
                />
              </Box>

              {/* Right Phone */}
              <Box
                sx={{
                  position: 'relative',
                  width: { xs: 150, md: 220 },
                  height: { xs: 300, md: 440 },
                  transform: 'rotate(5deg)',
                  zIndex: 1,
                  mt: { xs: 4, md: 6 },
                }}
              >
                <Image
                  src="/icons/iPhone-right.png"
                  alt="CoudPouss App - Task Details Screen"
                  fill
                  style={{ objectFit: 'contain' }}
                  sizes="(max-width: 768px) 150px, 220px"
                />
              </Box>
            </Box>

            {/* Right Side - Text and Download Links */}
            <Box>
              <Typography
                variant="h3"
                fontWeight="bold"
                gutterBottom
                sx={{
                  color: '#374151',
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  mb: 3,
                }}
              >
                Download the new CoudPouss app
              </Typography>

              {/* Download For Free Button */}
              <Button
                variant="contained"
                sx={{
                  bgcolor: '#F59E0B',
                  color: 'white',
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  mb: 3,
                  '&:hover': {
                    bgcolor: '#D97706',
                  },
                }}
              >
                Download For Free
              </Button>

              {/* App Store Badges */}
              <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
                {/* Apple App Store Badge */}
                <Box
                  component="a"
                  href="#"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: '#000000',
                    borderRadius: 2,
                    px: 2,
                    py: 1.5,
                    textDecoration: 'none',
                    color: 'white',
                    '&:hover': {
                      bgcolor: '#1F2937',
                    },
                    minWidth: { xs: '100%', sm: 180 },
                  }}
                >
                  <Box sx={{ mr: 1 }}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ fontSize: '0.65rem', display: 'block' }}>
                      Download on the
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                      App Store
                    </Typography>
                  </Box>
                </Box>

                {/* Google Play Badge */}
                <Box
                  component="a"
                  href="#"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: '#000000',
                    borderRadius: 2,
                    px: 2,
                    py: 1.5,
                    textDecoration: 'none',
                    color: 'white',
                    '&:hover': {
                      bgcolor: '#1F2937',
                    },
                    minWidth: { xs: '100%', sm: 180 },
                  }}
                >
                  <Box sx={{ mr: 1 }}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.24-.84-.76-.84-1.35zm13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27zm-4.81-4.81L6.05 2.66l10.76 6.44-2.81 2.81zM20.16 12.45l-2.85-2.85-2.85 2.85 2.85 2.85 2.85-2.85z" />
                    </svg>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ fontSize: '0.65rem', display: 'block' }}>
                      GET IT ON
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                      Google Play
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Favorite Professionals Section */}
      <Box sx={{ bgcolor: "white", py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 6 }}>
            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{
                color: "text.primary",
                fontSize: { xs: "2rem", md: "2.5rem" },
              }}
            >
              Favorite Professionals
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
              <Card
                key={index}
                sx={{
                  minWidth: { xs: "85%", md: 200 },
                  flexShrink: 0,
                  scrollSnapAlign: "start",
                  borderRadius: 3,
                  p: 2,
                  textAlign: "center",
                  position: "relative",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  cursor: isDragging ? "grabbing" : "pointer",
                  "&:hover": {
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  },
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
                <Typography variant="h6" fontWeight="600" sx={{ mb: 1 }}>
                  {professional.name}
                </Typography>

                {/* Rating */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, mb: 0.5 }}>
                  <Typography variant="body2" fontWeight="600">
                    {professional.rating}
                  </Typography>
                  <StarIcon sx={{ fontSize: 16, color: "#F59E0B" }} />
                </Box>

                {/* Reviews */}
                <Typography variant="caption" color="text.secondary">
                  {professional.reviews} Reviews
                </Typography>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>


    </Box>
  );
}

