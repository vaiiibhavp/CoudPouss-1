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
      bgColor: "#7C3B16",
      buttonColor: "#693111",
      buttonHover: "#4A2E1A",
      image: "/image/explore-service-section-1.png",
      alt: "Furniture Fixing",
    },
    {
      id: 2,
      title: "Pet care with experts",
      description: "Lorem Ipsum dit.",
      bgColor: "#4A4A4A",
      buttonColor: "#3B3C3A",
      buttonHover: "#2A2A2A",
      image: "/image/explore-service-section-2.png",
      alt: "Pet Care",
    },
    {
      id: 3,
      title: "Clean your kitchen by experts",
      description: "Lorem Ipsum dit.",
      bgColor: "#A38B7D",
      buttonColor: "#977665",
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
      bgColor: "#7C3B16",
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
      <Box sx={{ bgcolor: "#DFE8ED", height: "0.063rem" }} />
      {/* Hero Section */}
      <Box sx={{
        py: "5.563rem",
        px: "5rem"
      }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: "6.5rem",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              variant="h2"
              fontWeight="bold"
              gutterBottom
              sx={{
                fontSize: { xs: "2rem", md: "3.125rem" },
                lineHeight: "150%",
                fontWeight: 600,
                color: "primary.normal",
              }}
            >
              Your Trusted Partner For All Home Needs, At Your{" "}
              <Box component="span" sx={{
                fontSize: { xs: "2rem", md: "3.125rem" },
                lineHeight: "150%",
                fontWeight: 600,
                color: "secondary.main",
              }}>
                Doorstep.
              </Box>
            </Typography>
            <Typography
              variant="body1"
              color="secondary.naturalGray"
              sx={{
                mb: 4,
                fontSize: "1.25rem",
                mt: 2,
              }}
            >
              Making home care simple, safe, and accessible for seniors. Find
              trusted professionals for repairs, cleaning, and more — right at
              your doorstep.
            </Typography>
            {/* <Stack direction="row" spacing={2}>
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
            </Stack> */}
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
                          borderTopLeftRadius: "2.75rem",
                          overflow: "hidden",
                          borderBottomLeftRadius: "0.75rem"
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
                          borderTopRightRadius: "0.75rem",
                          overflow: "hidden",
                          borderBottomRightRadius: "2.75rem"
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

      {/* Statistics Section */}
      <Box sx={{ bgcolor: "#F3FBFF", p: 5 }}>
        <Box >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 3
            }}
          >
            {[
              { number: "150+", label: "Verified Professionals" },
              { number: "2,300+", label: "Services Completed" },
              { number: "24+", label: "Years of Valuable Experience" },
              { number: "100%", label: "Satisfaction Guarantee" },
            ].map((stat, index) => (
              <Box key={index} sx={{ textAlign: "center" }}>
                <Typography sx={{
                  fontSize: "3.125rem",
                  fontWeight: "600",
                  lineHeight: "150%"
                }} color="primary.normal">
                  {stat.number}
                </Typography>
                <Typography sx={{

                  fontSize: "1.25rem",
                  lineHeight: "100%",
                }} color="secondary.naturalGray">
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Why Choose Us Section */}
      <Box sx={{
        mt: "8.875rem",
      }}>
        <Box sx={{
          textAlign: "center",

        }}>
          <Typography sx={{
            lineHeight: "150%",
            fontSize: "3.125rem",
            color: "primary.normal",
            fontWeight: "600",
            mb: "1.25rem"
          }} >
            Why Choose Us
          </Typography>
          <Typography sx={{
            color: "secondary.naturalGray",
            fontSize: "1.25rem",
            lineHeight: "100%",
            mb: '5rem',
          }}>
            Experience the difference with our commitment to quality, safety, and customer satisfaction.
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            p: "5rem",
            gap: "5.281rem",
            flexDirection: { xs: "column", md: "row" }
          }}
        >
          {[
            {
              title: "Reliable & Fast",
              description:
                "Quick response times and punctual service. We value your time and ensure prompt assistance for all your home needs.",
              icon: "/icons/why-choose-section-1.png",
            },
            {
              title: "Trained Experts",
              description:
                "All professionals are thoroughly vetted and background-checked. Your safety and peace of mind are our top priorities.",
              icon: "/icons/why-choose-section-2.png",
            },
            {
              title: "Transparent Pricing",
              description:
                "No hidden fees or surprises. Get clear, upfront pricing before any work begins. Fair rates for quality service.",
              icon: "/icons/why-choose-section-3.png",
            },
          ].map((feature, index) => (

            <Box
              key={index}
              sx={{ height: "100%", textAlign: "center", borderRadius: "2.125rem", border: "1px solid #DFE8ED", p: "3.73rem", flex: 1 }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: "1.875rem"
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
              <Typography sx={{
                color: "primary.normal",
                fontWeight: "600",
                fontSize: "1.5rem",
                lineHeight: "1.75rem",
                mb: "1.25rem"
              }}>
                {feature.title}
              </Typography>
              <Typography sx={{
                fontSize: "1.25rem",
                color: "secondary.naturalGray",
              }}>
                {feature.description}
              </Typography>
            </Box>

          ))}
        </Box>
      </Box>

      {/* Explore Our Services Section */}
      <Box sx={{ bgcolor: "white", pt: "4.375rem" }}>
        <Box  >
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              sx={{
                color: "primary.normal",
                fontSize: "3.125rem",
                lineHeight: "150%",
                fontWeight: 600

              }}
            >
              Explore Our Services
            </Typography>
            <Typography
              sx={{
                mt: "1.25rem",
                mb: "5rem",
                fontSize: "1.25rem",
                color: "secondary.naturalGray",
              }}
            >
              From routine maintenance to emergency repairs, we've got you covered with comprehensive home services.
            </Typography>
          </Box>

          {/* First Row - Static Grid */}
          <Box
            sx={{
              px: "5rem",
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: "2.5rem",
              mb: 3,
            }}
          >
            {serviceCards.slice(0, 3).map((card) => (
              <Box
                key={card.id}
                sx={{
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  display: "flex",
                  flexDirection: "row",
                  borderRadius: "1.25rem"
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
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </Box>
              </Box>
            ))}
          </Box>

          {/* Second Row - Swipeable Carousel */}
          <Box
            sx={{
              position: "relative",
              width: "100%",
              overflow: "hidden",
              mb: "5rem"
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
                gap: "2.5rem",
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
        </Box>
      </Box>

      {/* How CoudPouss Works Section */}
      <Box sx={{ bgcolor: "grey.50", pt: "7.813rem", pb: "9.625rem" }}>
        <Box sx={{
          px: "5.375rem"
        }} >
          <Box sx={{ textAlign: "center", mb: "5.625rem" }}>
            <Typography
              sx={{
                color: "primary.normal",
                fontSize: "3.125rem",
                fontWeight: 600
              }}
            >
              How CoudPouss Works?
            </Typography>
            <Typography
              sx={{
                color: "secondary.naturalGray",
                fontSize: "1.25rem",
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
              gap: "2.5rem",
            }}
          >
            {/* Step 1: Book Your Service */}
            <Box
              sx={{
                bgcolor: "white",
                borderRadius: 2,
                pl: "1.875rem",
                display: "flex",
                flexDirection: "row",
                position: "relative",
                overflow: "visible",
                height: { xs: "auto", md: 280 },
                gap: 2,
              }}
            >
              {/* Blue Number Circle */}


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
                <Box
                  sx={{
                    px: "0.375rem",
                    py: "1.063rem",
                    height: "2.625rem",
                    width: "2.625rem",
                    borderRadius: "50%",
                    bgcolor: "primary.normal",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: "0.75rem"
                  }}
                >
                  <Typography
                    sx={{ color: "#FEFEFE", fontSize: "2rem" }}
                  >
                    1
                  </Typography>
                </Box>
                <Typography
                  sx={{ mb: "0.75rem", color: "#5A5A5A", fontSize: "2rem", fontWeight: 600, lineHeight: "1.75rem" }}
                >
                  Book Your Service
                </Typography>
                <Typography
                  sx={{ color: "#989898", lineHeight: '140%', fontSize: "1rem" }}
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
            </Box>

            {/* Step 2: Get a Free Estimate */}
            <Box
              sx={{
                bgcolor: "white",
                borderRadius: 2,
                pl: "1.875rem",
                display: "flex",
                flexDirection: "row",
                position: "relative",
                overflow: "visible",
                height: { xs: "auto", md: 280 },
                gap: 2,
              }}
            >
              {/* Blue Number Circle */}


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


                <Box
                  sx={{
                    px: "0.375rem",
                    py: "1.063rem",
                    height: "2.625rem",
                    width: "2.625rem",
                    borderRadius: "50%",
                    bgcolor: "primary.normal",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: "0.75rem"
                  }}
                >
                  <Typography
                    sx={{ color: "#FEFEFE", fontSize: "2rem" }}
                  >
                    2
                  </Typography>
                </Box>
                <Typography
                  sx={{ mb: "0.75rem", color: "#5A5A5A", fontSize: "2rem", fontWeight: 600, lineHeight: "1.75rem" }}
                >
                  Get a Free Estimate
                </Typography>
                <Typography
                  sx={{ color: "#989898", lineHeight: '140%', fontSize: "1rem" }}
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
            </Box>
            <Box
              sx={{
                bgcolor: "white",
                borderRadius: 2,
                pl: "1.875rem",
                display: "flex",
                flexDirection: "row",
                position: "relative",
                overflow: "visible",
                height: { xs: "auto", md: 280 },
                gap: 2,
              }}
            >
              {/* Blue Number Circle */}


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


                <Box
                  sx={{
                    px: "0.375rem",
                    py: "1.063rem",
                    height: "2.625rem",
                    width: "2.625rem",
                    borderRadius: "50%",
                    bgcolor: "primary.normal",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: "0.75rem"
                  }}
                >
                  <Typography
                    sx={{ color: "#FEFEFE", fontSize: "2rem" }}
                  >
                    3
                  </Typography>
                </Box>
                <Typography
                  sx={{ mb: "0.75rem", color: "#5A5A5A", fontSize: "2rem", fontWeight: 600, lineHeight: "1.75rem" }}
                >
                  Get Professional Help
                </Typography>
                <Typography
                  sx={{ color: "#989898", lineHeight: '140%', fontSize: "1rem" }}
                >
                  Our verified expert arrives on time and
                  completes the job with care and expertise.

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
                  alt="Get a Free Estimate"
                  fill
                  style={{ objectFit: "contain" }}
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
              </Box>
            </Box>
            <Box
              sx={{
                bgcolor: "white",
                borderRadius: 2,
                pl: "1.875rem",
                display: "flex",
                flexDirection: "row",
                position: "relative",
                height: { xs: "auto", md: 280 },
                gap: 2,
                overflow: "hidden",
              }}
            >
              {/* Blue Number Circle */}


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


                <Box
                  sx={{
                    px: "0.375rem",
                    py: "1.063rem",
                    height: "2.625rem",
                    width: "2.625rem",
                    borderRadius: "50%",
                    bgcolor: "primary.normal",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: "0.75rem"
                  }}
                >
                  <Typography
                    sx={{ color: "#FEFEFE", fontSize: "2rem" }}
                  >
                    4
                  </Typography>
                </Box>
                <Typography
                  sx={{ mb: "0.75rem", color: "#5A5A5A", fontSize: "2rem", fontWeight: 600, lineHeight: "1.75rem" }}
                >
                  Enjoy Hassle-Free Living
                </Typography>
                <Typography
                  sx={{ color: "#989898", lineHeight: '140%', fontSize: "1rem" }}
                >
                  Relax knowing your home is in good hands. We ensure quality and your complete satisfaction.
                </Typography>
              </Box>

              {/* Image */}
              <Box
                sx={{
                  flex: "0 0 45%",
                  position: "relative",
                  minHeight: { xs: 200, md: "100%" },
                  borderRadius: 2,


                }}
              >
                <Image
                  src="/image/how-work-img-4.png"
                  alt="Get a Free Estimate"
                  fill
                  style={{ objectFit: "contain" }}
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
              </Box>
            </Box>



          </Box>
        </Box>
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

      {/* Testimonials Section */}
      <Box sx={{ bgcolor: 'grey.50',py:"4.375rem", color: 'black', overflow: 'visible' }}>
        <Box  sx={{  overflow: 'visible' }}>
          <Box sx={{ textAlign: "center"}}>
            <Typography
              sx={{
                lineHeight:"130%",
                fontSize: { md: "4.063rem" },
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
        </Box>
      </Box>
    </Box>
  );
}

