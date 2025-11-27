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
} from "@mui/material";
import { ROUTES } from "@/constants/routes";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function HomePage() {
  // Swipeable carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Testimonials carousel state
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const testimonialCarouselRef = useRef<HTMLDivElement>(null);

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
    {
      id: 4,
      title: "Pet care with experts",
      description: "Lorem Ipsum dit.",
      bgColor: "#4A4A4A",
      buttonColor: "#3A3A3A",
      buttonHover: "#2A2A2A",
      image: "/image/explore-service-section-2.png",
      alt: "Pet Care",
    },
    {
      id: 5,
      title: "Want a help in Furniture Fixing ?",
      description: "Lorem Ipsum dit.",
      bgColor: "#7A4A2E",
      buttonColor: "#5C3823",
      buttonHover: "#4A2E1A",
      image: "/image/explore-service-section-1.png",
      alt: "Furniture Fixing",
    },
    {
      id: 6,
      title: "Clean your kitchen by experts",
      description: "Lorem Ipsum dit.",
      bgColor: "#A38B7D",
      buttonColor: "#8C756A",
      buttonHover: "#75655A",
      image: "/image/explore-service-section-3.png",
      alt: "Kitchen Cleaning",
    },
  ];

  // Touch handlers
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
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.offsetWidth / 3;
      const gap = 24; // 3 * 8px gap
      const scrollPosition = carouselRef.current.scrollLeft;
      const newIndex = Math.round(scrollPosition / (cardWidth + gap));
      const maxIndex = serviceCards.length - 3;
      setCurrentIndex(Math.max(0, Math.min(newIndex, maxIndex)));
      
      // Snap to nearest card
      const snapPosition = newIndex * (cardWidth + gap);
      carouselRef.current.scrollTo({
        left: snapPosition,
        behavior: "smooth",
      });
    }
  };

  // Mouse handlers
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
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.offsetWidth / 3;
      const gap = 24; // 3 * 8px gap
      const scrollPosition = carouselRef.current.scrollLeft;
      const newIndex = Math.round(scrollPosition / (cardWidth + gap));
      const maxIndex = serviceCards.length - 3;
      setCurrentIndex(Math.max(0, Math.min(newIndex, maxIndex)));
      
      // Snap to nearest card
      const snapPosition = newIndex * (cardWidth + gap);
      carouselRef.current.scrollTo({
        left: snapPosition,
        behavior: "smooth",
      });
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Handle scroll event to update current index
  useEffect(() => {
    const handleScroll = () => {
      if (carouselRef.current) {
        const cardWidth = carouselRef.current.offsetWidth / 3;
        const gap = 24;
        const scrollPosition = carouselRef.current.scrollLeft;
        const newIndex = Math.round(scrollPosition / (cardWidth + gap));
        const maxIndex = serviceCards.length - 3;
        setCurrentIndex(Math.max(0, Math.min(newIndex, maxIndex)));
      }
    };

    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener("scroll", handleScroll);
      return () => carousel.removeEventListener("scroll", handleScroll);
    }
  }, [serviceCards.length]);

  // Smooth scroll to index
  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.offsetWidth / 3;
      const gap = 24; // 3 * 8px gap
      carouselRef.current.scrollTo({
        left: index * (cardWidth + gap),
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      image: "/icons/testimonilas-1.png",
      text: "Yourself required no at thoughts delicate landlord it be. Branched dashwood do is whatever it. Farther be chapter at visited married in it pressed. By distrusts procuring be oh frankness existence believing instantly if. Doubtful on an juvenile as of servants insisted.",
    },
    {
      id: 2,
      image: "/icons/testimonilas-2.png",
      text: "Yourself required no at thoughts delicate landlord it be. Branched dashwood do is whatever it. Farther be chapter at visited married in it pressed. By distrusts procuring be oh frankness existence believing instantly if. Doubtful on an juvenile as of servants insisted.",
    },
    {
      id: 3,
      image: "/icons/testimonilas-1.png",
      text: "Yourself required no at thoughts delicate landlord it be. Branched dashwood do is whatever it. Farther be chapter at visited married in it pressed. By distrusts procuring be oh frankness existence believing instantly if. Doubtful on an juvenile as of servants insisted.",
    },
  ];

  // Auto-slide testimonials carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Scroll testimonials carousel
  useEffect(() => {
    if (testimonialCarouselRef.current) {
      const container = testimonialCarouselRef.current;
      const cards = container.children;
      if (cards.length > 0) {
        const cardWidth = (cards[0] as HTMLElement).offsetWidth;
        const gap = 32; // 4 * 8px gap
        const scrollPosition = testimonialIndex * (cardWidth + gap);
        container.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
      }
    }
  }, [testimonialIndex]);

  return (
    <Box sx={{ bgcolor: "background.default" }}>
      {/* Top Bar */}
      <Box sx={{ bgcolor: "grey.800", height: "2px" }} />



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
                color: "primary.main",
              }}
            >
              Your Trusted Partner For All Home Needs, At Your{" "}
              <Box component="span" sx={{ color: "secondary.main" }}>
                 Doorstep.
              </Box>
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                mb: 4,
                fontSize: "1.1rem",
                lineHeight: 1.6,
                mt: 2,
              }}
            >
              Making home care simple, safe, and accessible for seniors. Find
              trusted professionals for repairs, cleaning, and more — right at
              your doorstep.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                component={Link}
                href={ROUTES.LOGIN}
                variant="contained"
                color="primary"
                size="large"
                sx={{ textTransform: "none" }}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{ textTransform: "none" }}
              >
                Learn More
              </Button>
            </Stack>
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

      {/* Statistics Section */}
      <Box sx={{ bgcolor: "grey.50", py: 6 }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: 4,
            }}
          >
            {[
              { number: "150+", label: "Verified Professionals" },
              { number: "2,300+", label: "Services Completed" },
              { number: "24+", label: "Years of Valuable Experience" },
              { number: "100%", label: "Satisfaction Guarantee" },
            ].map((stat, index) => (
              <Box key={index} sx={{ textAlign: "center" }}>
                <Typography variant="h3" fontWeight="bold" color="primary.main">
                  {stat.number}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Why Choose Us Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Why Choose Us
          </Typography>
          <Typography variant="body1" color="text.secondary">
            We are committed to providing quality service and customer
            satisfaction
          </Typography>
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 4,
          }}
        >
          {[
            {
              title: "Reliable & Fast",
              description:
                "Quick response times and reliable service delivery when you need it most.",
              icon: "/icons/why-choose-section-1.png",
            },
            {
              title: "Trained Experts",
              description:
                "Our professionals are thoroughly vetted and trained to meet your needs.",
              icon: "/icons/why-choose-section-2.png",
            },
            {
              title: "Transparent Pricing",
              description:
                "No hidden fees. Clear, upfront pricing for all our services.",
              icon: "/icons/why-choose-section-3.png",
            },
          ].map((feature, index) => (
            <Box key={index}>
              <Card
                elevation={2}
                sx={{ height: "100%", textAlign: "center", p: 3 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={80}
                    height={80}
                    style={{ objectFit: "contain" }}
                  />
                </Box>
                <Typography variant="h5" fontWeight="600" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>

      {/* Explore Our Services Section */}
      <Box sx={{ bgcolor: "white", py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h3"
              fontWeight="bold"
              gutterBottom
              sx={{
                color: "#2F6B8E",
                fontSize: { xs: "2rem", md: "2.5rem" },
              }}
            >
              Explore Our Services
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#6C757D",
                fontSize: "1rem",
                maxWidth: "700px",
                mx: "auto",
              }}
            >
              From routine maintenance to emergency repairs, we&apos;ve got you
              covered with comprehensive home services.
            </Typography>
          </Box>

          {/* First Row - Static Grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 3,
              mb: 3,
            }}
          >
            {serviceCards.slice(0, 3).map((card) => (
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

          {/* Second Row - Swipeable Carousel */}
          <Box
            sx={{
              position: "relative",
              width: "100%",
              overflow: "hidden",
            }}
          >
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
                cursor: isDragging ? "grabbing" : "grab",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                pb: 2,
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
                    minWidth: { xs: "85%", md: "calc(33.333% - 16px)" },
                    flexShrink: 0,
                    scrollSnapAlign: "start",
                    userSelect: "none",
                    pointerEvents: isDragging ? "none" : "auto",
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
                      sizes="(max-width: 768px) 85vw, 33vw"
                      draggable={false}
                    />
                  </Box>
                </Card>
              ))}
            </Box>

            {/* Navigation Dots */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 1,
                mt: 3,
              }}
            >
              {Array.from({
                length: Math.max(1, serviceCards.length - 2),
              }).map((_, index) => (
                <Box
                  key={index}
                  onClick={() => scrollToIndex(index)}
                  sx={{
                    width: currentIndex === index ? 24 : 8,
                    height: 8,
                    borderRadius: 4,
                    bgcolor:
                      currentIndex === index
                        ? "primary.main"
                        : "grey.400",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* How CoudPouss Works Section */}
      <Box sx={{ bgcolor: "grey.50", py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h3"
              fontWeight="bold"
              gutterBottom
              sx={{
                color: "text.primary",
                fontSize: { xs: "2rem", md: "2.5rem" },
              }}
            >
              How CoudPouss Works?
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                fontSize: "1rem",
                maxWidth: "700px",
                mx: "auto",
              }}
            >
              Getting help for your home has never been easier. Just four simple
              steps to peace of mind.
            </Typography>
          </Box>

          {/* 2x2 Grid of Step Cards */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
              gap: 3,
            }}
          >
            {/* Step 1: Book Your Service */}
            <Card
              sx={{
                bgcolor: "white",
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                p: 3,
                display: "flex",
                flexDirection: "row",
                position: "relative",
                overflow: "visible",
                height: { xs: "auto", md: 280 },
                gap: 2,
              }}
            >
              {/* Blue Number Circle */}
              <Box
                sx={{
                  position: "absolute",
                  top: -15,
                  left: 0,
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: "#2F6B8E",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ color: "white", fontSize: "1.25rem" }}
                >
                  1
                </Typography>
              </Box>

              {/* Text Content */}
              <Box
                sx={{
                  flex: "0 0 55%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  pr: 2,
                  pt: 2,
                  pl: 3,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ mb: 1.5, color: "text.primary", fontSize: "1.1rem" }}
                >
                  Book Your Service
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", lineHeight: 1.6, fontSize: "0.9rem" }}
                >
                  Browse our services and select what you need. Easy online
                  booking or call us directly.
                </Typography>
              </Box>

              {/* Image */}
              <Box
                sx={{
                  flex: "0 0 45%",
                  position: "relative",
                  minHeight: { xs: 200, md: "100%" },
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <Image
                  src="/image/how-work-img-1.png"
                  alt="Book Your Service"
                  fill
                  style={{ objectFit: "contain" }}
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
              </Box>
            </Card>

            {/* Step 2: Get a Free Estimate */}
            <Card
              sx={{
                bgcolor: "white",
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                p: 3,
                display: "flex",
                flexDirection: "row",
                position: "relative",
                overflow: "visible",
                height: { xs: "auto", md: 280 },
                gap: 2,
              }}
            >
              {/* Blue Number Circle */}
              <Box
                sx={{
                  position: "absolute",
                  top: -15,
                  left: 0,
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: "#2F6B8E",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ color: "white", fontSize: "1.25rem" }}
                >
                  2
                </Typography>
              </Box>

              {/* Text Content */}
              <Box
                sx={{
                  flex: "0 0 55%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  pr: 2,
                  pt: 2,
                  pl: 3,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ mb: 1.5, color: "text.primary", fontSize: "1.1rem" }}
                >
                  Get a Free Estimate
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", lineHeight: 1.6, fontSize: "0.9rem" }}
                >
                  Receive a transparent quote with no hidden costs. Know exactly
                  what to expect.
                </Typography>
              </Box>

              {/* Image */}
              <Box
                sx={{
                  flex: "0 0 45%",
                  position: "relative",
                  minHeight: { xs: 200, md: "100%" },
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <Image
                  src="/image/how-work-img-2.png"
                  alt="Get a Free Estimate"
                  fill
                  style={{ objectFit: "contain" }}
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
              </Box>
            </Card>

            {/* Step 3: Get Professional Help */}
            <Card
              sx={{
                bgcolor: "white",
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                p: 3,
                display: "flex",
                flexDirection: "row",
                position: "relative",
                overflow: "visible",
                height: { xs: "auto", md: 280 },
                gap: 2,
              }}
            >
              {/* Blue Number Circle */}
              <Box
                sx={{
                  position: "absolute",
                  top: -15,
                  left: 0,
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: "#2F6B8E",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ color: "white", fontSize: "1.25rem" }}
                >
                  3
                </Typography>
              </Box>

              {/* Text Content */}
              <Box
                sx={{
                  flex: "0 0 55%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  pr: 2,
                  pt: 2,
                  pl: 3,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ mb: 1.5, color: "text.primary", fontSize: "1.1rem" }}
                >
                  Get Professional Help
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", lineHeight: 1.6, fontSize: "0.9rem" }}
                >
                  Our verified expert arrives on time and completes the job with
                  care and expertise.
                </Typography>
              </Box>

              {/* Image */}
              <Box
                sx={{
                  flex: "0 0 45%",
                  position: "relative",
                  minHeight: { xs: 200, md: "100%" },
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <Image
                  src="/image/how-work-img-3.png"
                  alt="Get Professional Help"
                  fill
                  style={{ objectFit: "contain" }}
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
              </Box>
            </Card>

            {/* Step 4: Enjoy Hassle-Free Living */}
            <Card
              sx={{
                bgcolor: "white",
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                p: 3,
                display: "flex",
                flexDirection: "row",
                position: "relative",
                overflow: "visible",
                height: { xs: "auto", md: 280 },
                gap: 2,
              }}
            >
              {/* Blue Number Circle */}
              <Box
                sx={{
                  position: "absolute",
                  top: -15,
                  left: 0,
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: "#2F6B8E",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ color: "white", fontSize: "1.25rem" }}
                >
                  4
                </Typography>
              </Box>

              {/* Text Content */}
              <Box
                sx={{
                  flex: "0 0 55%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  pr: 2,
                  pt: 2,
                  pl: 3,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ mb: 1.5, color: "text.primary", fontSize: "1.1rem" }}
                >
                  Enjoy Hassle-Free Living
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", lineHeight: 1.6, fontSize: "0.9rem" }}
                >
                  Relax knowing your home is in good hands. We ensure quality
                  and your complete satisfaction.
                </Typography>
              </Box>

              {/* Image */}
              <Box
                sx={{
                  flex: "0 0 45%",
                  position: "relative",
                  minHeight: { xs: 200, md: "100%" },
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <Image
                  src="/image/how-work-img-4.png"
                  alt="Enjoy Hassle-Free Living"
                  fill
                  style={{ objectFit: "contain" }}
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
              </Box>
            </Card>
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

      {/* Testimonials Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8, color: 'black', overflow: 'visible' }}>
        <Container maxWidth="lg" sx={{ py: 8, overflow: 'visible' }}>
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography 
              variant="h3" 
              fontWeight="bold" 
              gutterBottom
              sx={{
                color: "text.primary",
                fontSize: { xs: "2rem", md: "2.5rem" },
              }}
            >
              Testimonials
            </Typography>
          </Box>
          
          {/* Testimonials Carousel */}
          <Box
            sx={{
              position: "relative",
              width: "100%",
              overflow: "visible",
              px: { xs: 2, md: 8 },
              pt: 10,
              mb: 4,
            }}
          >
            <Box
              ref={testimonialCarouselRef}
              sx={{
                display: "flex",
                gap: 4,
                overflowX: "auto",
                overflowY: "visible",
                scrollSnapType: "x mandatory",
                scrollBehavior: "smooth",
                WebkitOverflowScrolling: "touch",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                pb: 2,
              }}
            >
              {testimonials.map((testimonial, index) => {
                const isActive = testimonialIndex === index;
                return (
                  <Box
                    key={testimonial.id}
                    sx={{
                      minWidth: { xs: "85%", md: "calc(33.333% - 32px)" },
                      flexShrink: 0,
                      scrollSnapAlign: "center",
                      display: "flex",
                      justifyContent: "center",
                      overflow: "visible",
                      pt: 6,
                    }}
                  >
                    <Card
                      elevation={2}
                      sx={{
                        bgcolor: "white",
                        borderRadius: 3,
                        p: 4,
                        pt: 8,
                        position: "relative",
                        maxWidth: 500,
                        width: "100%",
                        minHeight: 300,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        textAlign: "left",
                        overflow: "visible",
                        opacity: isActive ? 1 : 0.6,
                        transition: "opacity 0.3s ease",
                      }}
                    >
                      {/* Floating Profile Image - Top Left */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: -50,
                          left: 20,
                          width: 100,
                          height: 100,
                          borderRadius: "50%",
                          border: "4px solid white",
                          overflow: "hidden",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                          zIndex: 2,
                        }}
                      >
                        <Box
                          sx={{
                            position: "relative",
                            width: "100%",
                            height: "100%",
                          }}
                        >
                          <Image
                            src={testimonial.image}
                            alt={`Testimonial ${testimonial.id}`}
                            fill
                            style={{ objectFit: "cover" }}
                            sizes="100px"
                          />
                        </Box>
                      </Box>

                      {/* Testimonial Text */}
                      <Typography
                        variant="body1"
                        sx={{
                          color: "text.primary",
                          lineHeight: 1.8,
                          fontSize: { xs: "0.9rem", md: "1rem" },
                          mt: 2,
                        }}
                      >
                        {testimonial.text}
                      </Typography>
                    </Card>
                  </Box>
                );
              })}
            </Box>

            {/* Navigation Dots */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 1,
                mt: 4,
              }}
            >
              {testimonials.map((_, index) => (
                <Box
                  key={index}
                  onClick={() => setTestimonialIndex(index)}
                  sx={{
                    width: testimonialIndex === index ? 24 : 8,
                    height: 8,
                    borderRadius: 4,
                    bgcolor:
                      testimonialIndex === index
                        ? "primary.main"
                        : "grey.400",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

