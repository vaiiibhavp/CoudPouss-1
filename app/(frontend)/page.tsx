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
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  // Redirect authenticated users to /home
  useEffect(() => {
    const storedInitial = localStorage.getItem("userInitial");
    const storedEmail = localStorage.getItem("userEmail");
    
    // If user is authenticated (either via Redux or localStorage), redirect to /home
    if (isAuthenticated || (storedInitial && storedEmail)) {
      router.push(ROUTES.AUTH_HOME);
    }
  }, [isAuthenticated, router]);

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
      id: 3,
      title: "Pet care with experts",
      description: "Lorem Ipsum dit.",
      bgColor: "#4A4A4A",
      buttonColor: "#3B3C3A",
      buttonHover: "#2A2A2A",
      image: "/image/explore-service-section-2.png",
      alt: "Pet Care",
    },
    {
      id: 2,
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
      image: "/icons/testimonilas-3.png",
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
        py: { xs: "2rem", sm: "3rem", md: "4rem", lg: "5.563rem" },
        px: { xs: "1rem", sm: "2rem", md: "3rem", lg: "5rem" }
      }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: { xs: "2rem", sm: "3rem", md: "4rem", lg: "6.5rem" },
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              variant="h2"
              fontWeight="bold"
              gutterBottom
              sx={{
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem", lg: "3.125rem" },
                lineHeight: "150%",
                fontWeight: 600,
                color: "primary.normal",
              }}
            >
              Your Trusted Partner For All Home Needs, At Your{" "}
              <Box component="span" sx={{
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem", lg: "3.125rem" },
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
                mb: { xs: 2, sm: 3, md: 4 },
                fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem", lg: "1.25rem" },
                mt: { xs: 1, sm: 1.5, md: 2 },
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
      <Box sx={{ bgcolor: "#F3FBFF", p: { xs: 2, sm: 3, md: 4, lg: 5 } }}>
        <Box >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
              gap: { xs: 2, sm: 2.5, md: 3 },
              px: { xs: "1rem", sm: "2rem", md: 0 }
            }}
          >
            {[
              { number: "150+", label: "Verified Professionals" },
              { number: "2,300+", label: "Services Completed" },
              { number: "24+", label: "Years of Combined Experience" },
              { number: "100%", label: "Satisfaction Guarantee" },
            ].map((stat, index) => (
              <Box key={index} sx={{ textAlign: "center" }}>
                <Typography sx={{
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem", lg: "3.125rem" },
                  fontWeight: "600",
                  lineHeight: "150%"
                }} color="primary.normal">
                  {stat.number}
                </Typography>
                <Typography sx={{
                  fontSize: { xs: "0.75rem", sm: "1rem", md: "1.125rem", lg: "1.25rem" },
                  lineHeight: "100%",
                  mt: { xs: 0.5, md: 1 }
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
        mt: { xs: "3rem", sm: "4rem", md: "6rem", lg: "8.875rem" },
      }}>
        <Box sx={{
          textAlign: "center",
          px: { xs: "1rem", sm: "2rem", md: 0 }
        }}>
          <Typography sx={{
            lineHeight: "150%",
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem", lg: "3.125rem" },
            color: "primary.normal",
            fontWeight: "600",
            mb: { xs: "1rem", md: "1.25rem" }
          }} >
            Why Choose Us
          </Typography>
          <Typography sx={{
            color: "secondary.naturalGray",
            fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem", lg: "1.25rem" },
            lineHeight: "100%",
            mb: { xs: "2rem", sm: "3rem", md: "4rem", lg: '5rem' },
            px: { xs: "1rem", sm: "2rem", md: 0 }
          }}>
            Experience the difference with our commitment to quality, safety, and customer satisfaction.
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            p: { xs: "1.5rem", sm: "2.5rem", md: "3.5rem", lg: "5rem" },
            gap: { xs: "2rem", sm: "3rem", md: "4rem", lg: "5.281rem" },
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
              title: "Trusted Experts",
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
              sx={{ 
                height: "100%", 
                textAlign: "center", 
                borderRadius: { xs: "1rem", md: "2.125rem" }, 
                border: "0.0625rem solid #DFE8ED", 
                p: { xs: "1.5rem", sm: "2.5rem", md: "3rem", lg: "3.73rem" }, 
                flex: 1 
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: { xs: "1rem", md: "1.875rem" }
                }}
              >
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={80}
                  height={80}
                  style={{ objectFit: "contain", width: "auto", height: "auto", maxWidth: "100%", maxHeight: "60px" }}
                  sizes="(max-width: 600px) 50px, 80px"
                />
              </Box>
              <Typography sx={{
                color: "primary.normal",
                fontWeight: "600",
                fontSize: { xs: "1.125rem", sm: "1.25rem", md: "1.375rem", lg: "1.5rem" },
                lineHeight: "1.75rem",
                mb: { xs: "0.75rem", md: "1.25rem" }
              }}>
                {feature.title}
              </Typography>
              <Typography sx={{
                fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem", lg: "1.25rem" },
                color: "secondary.naturalGray",
              }}>
                {feature.description}
              </Typography>
            </Box>

          ))}
        </Box>
      </Box>

      {/* Explore Our Services Section */}
      <Box sx={{ bgcolor: "white", pt: { xs: "2rem", sm: "3rem", md: "4.375rem" } }}>
        <Box  >
          <Box sx={{ textAlign: "center", mb: { xs: 3, sm: 4, md: 6 }, px: { xs: "1rem", sm: "2rem", md: 0 } }}>
            <Typography
              sx={{
                color: "primary.normal",
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem", lg: "3.125rem" },
                lineHeight: "150%",
                fontWeight: 600

              }}
            >
              Explore Our Services
            </Typography>
            <Typography
              sx={{
                mt: { xs: "1rem", md: "1.25rem" },
                mb: { xs: "2rem", sm: "3rem", md: "5rem" },
                fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem", lg: "1.25rem" },
                color: "secondary.naturalGray",
                px: { xs: "1rem", sm: "2rem", md: 0 }
              }}
            >
              From routine maintenance to emergency repairs, we've got you covered with comprehensive home services.
            </Typography>
          </Box>

          {/* First Row - Static Grid */}
          <Box
            sx={{
              px: { xs: "1rem", sm: "2rem", md: "3rem", lg: "5rem" },
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
              gap: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
              mb: { xs: 2, md: 3 },
            }}
          >
            {serviceCards.slice(0, 3).map((card) => (
              <Box
                key={card.id}
                sx={{
                  overflow: "hidden",
                  boxShadow: "0 0.125rem 0.5rem rgba(0,0,0,0.1)",
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  borderRadius: { xs: "0.75rem", md: "1.25rem" }
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
              mb: { xs: "2rem", sm: "3rem", md: "5rem" },
              px: { xs: "1rem", sm: "2rem", md: 0 }
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
                gap: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
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
                    boxShadow: "0 0.125rem 0.5rem rgba(0,0,0,0.1)",
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    borderRadius: { xs: "0.75rem", md: "1.25rem" },
                    flexShrink: 0,
                    width: { xs: "85%", sm: "400px", md: "450px" },
                    minWidth: { xs: "85%", sm: "400px", md: "450px" },
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
                      sizes="(max-width: 600px) 85vw, (max-width: 960px) 400px, 450px"
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
      <Box sx={{ bgcolor: "grey.50", pt: { xs: "3rem", sm: "4rem", md: "5rem", lg: "7.813rem" }, pb: { xs: "3rem", sm: "4rem", md: "6rem", lg: "9.625rem" } }}>
        <Box sx={{
          px: { xs: "1rem", sm: "2rem", md: "3rem", lg: "5.375rem" }
        }} >
          <Box sx={{ textAlign: "center", mb: { xs: "2rem", sm: "3rem", md: "4rem", lg: "5.625rem" } }}>
            <Typography
              sx={{
                color: "primary.normal",
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem", lg: "3.125rem" },
                fontWeight: 600
              }}
            >
              How CoudPouss Works?
            </Typography>
            <Typography
              sx={{
                color: "secondary.naturalGray",
                fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem", lg: "1.25rem" },
                mt: { xs: "0.75rem", md: "1rem" },
                px: { xs: "1rem", sm: "2rem", md: 0 }
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
              gridTemplateColumns: { xs: "1fr", md: "repeat(12, 1fr)" },
              gap: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
            }}
          >
            <Box className="col-span-12 md:col-span-7">
              <Box
                sx={{
                  bgcolor: "white",
                  borderRadius: { xs: 1, md: 2 },
                  pl: { xs: "1rem", sm: "1.5rem", md: "1.875rem" },
                  marginRight: { xs: 0, md: "1.875rem" },
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  position: "relative",
                  overflow: "visible",
                  width: { xs: "100%", md: "100%" },
                  height: { xs: "auto", md: 280, lg: 320, xl: 360 },
                  gap: { xs: 1.5, md: 2 },
                  py: { xs: "1rem", md: 0 },
                }}
              >
                <Box
                  sx={{
                    flex: { xs: "1 1 auto", md: "0 0 55%" },
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    pr: { xs: "1rem", md: 2 },
                    pt: { xs: 0, md: 2 },
                    pl: { xs: "1rem", md: 3 },
                  }}
                >
                  <Box
                    sx={{
                      px: "0.375rem",
                      py: "1.063rem",
                      height: { xs: "2rem", md: "2.625rem" },
                      width: { xs: "2rem", md: "2.625rem" },
                      borderRadius: "50%",
                      bgcolor: "primary.normal",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: { xs: "0.5rem", md: "0.75rem" }
                    }}
                  >
                    <Typography sx={{ color: "#FEFEFE", fontSize: { xs: "1.5rem", md: "2rem" } }}>1</Typography>
                  </Box>

                  <Typography
                    sx={{ 
                      mb: { xs: "0.5rem", md: "0.75rem" }, 
                      color: "#5A5A5A", 
                      fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem", lg: "2rem" }, 
                      fontWeight: 600, 
                      lineHeight: { xs: "1.5rem", md: "1.75rem" } 
                    }}
                  >
                    Book Your Service
                  </Typography>

                  <Typography sx={{ 
                    color: "#989898", 
                    lineHeight: '140%', 
                    fontSize: { xs: "0.875rem", md: "1rem" } 
                  }}>
                    Browse our services and select what you need. Easy online booking or call us directly.
                  </Typography>
                </Box>

                <Box
                  sx={{
                    flex: { xs: "1 1 auto", md: "0 0 45%" },
                    position: "relative",
                    minHeight: { xs: 200, sm: 250, md: "100%" },
                    borderRadius: { xs: 1, md: 2 },
                    overflow: "hidden",
                    width: { xs: "100%", md: "auto" },
                  }}
                >
                  <Image
                    src="/image/how-work-img-1.png"
                    alt="Book Your Service"
                    fill
                    style={{ objectFit: "contain" }}
                    sizes="(max-width: 600px) 100vw, (max-width: 960px) 45vw, 45vw"
                  />
                </Box>
              </Box>
            </Box>

            <Box className="col-span-12 md:col-span-5">
              <Box
                sx={{
                  bgcolor: "white",
                  borderRadius: { xs: 1, md: 2 },
                  pl: { xs: "1rem", sm: "1.5rem", md: "1.875rem" },
                  display: "flex",
                  justifySelf: "right",
                  flexDirection: { xs: "column", md: "row" },
                  position: "relative",
                  overflow: "visible",
                  height: { xs: "auto", md: 280, lg: 320, xl: 360 },
                  width: { xs: "100%", md: "100%" },
                  gap: { xs: 1.5, md: 2 },
                  py: { xs: "1rem", md: 0 },
                }}
              >
                <Box
                  sx={{
                    flex: { xs: "1 1 auto", md: "0 0 55%" },
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    pr: { xs: "1rem", md: 2 },
                    pt: { xs: 0, md: 2 },
                    pl: { xs: "1rem", md: 3 },
                  }}
                >
                  <Box
                    sx={{
                      px: "0.375rem",
                      py: "1.063rem",
                      height: { xs: "2rem", md: "2.625rem" },
                      width: { xs: "2rem", md: "2.625rem" },
                      borderRadius: "50%",
                      bgcolor: "primary.normal",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: { xs: "0.5rem", md: "0.75rem" }
                    }}
                  >
                    <Typography sx={{ color: "#FEFEFE", fontSize: { xs: "1.5rem", md: "2rem" } }}>2</Typography>
                  </Box>

                  <Typography
                    sx={{ 
                      mb: { xs: "0.5rem", md: "0.75rem" }, 
                      color: "#5A5A5A", 
                      fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem", lg: "2rem" }, 
                      fontWeight: 600, 
                      lineHeight: { xs: "1.5rem", md: "1.75rem" } 
                    }}
                  >
                    Get a Free Estimate
                  </Typography>

                  <Typography sx={{ 
                    color: "#989898", 
                    lineHeight: '140%', 
                    fontSize: { xs: "0.875rem", md: "1rem" } 
                  }}>
                    Receive a transparent quote with no hidden costs. Know exactly what to expect.
                  </Typography>
                </Box>

                <Box
                  sx={{
                    flex: { xs: "1 1 auto", md: "0 0 45%" },
                    position: "relative",
                    minHeight: { xs: 200, sm: 250, md: "100%" },
                    borderRadius: { xs: 1, md: 2 },
                    overflow: "hidden",
                    width: { xs: "100%", md: "auto" },
                  }}
                >
                  <Image
                    src="/image/how-work-img-2.png"
                    alt="Get a Free Estimate"
                    fill
                    style={{ objectFit: "contain" }}
                    sizes="(max-width: 600px) 100vw, (max-width: 960px) 45vw, 45vw"
                  />
                </Box>
              </Box>
            </Box>

            <Box className="col-span-12 md:col-span-5">
              <Box
                sx={{
                  bgcolor: "white",
                  borderRadius: { xs: 1, md: 2 },
                  pl: { xs: "1rem", sm: "1.5rem", md: "1.875rem" },
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  position: "relative",
                  overflow: "visible",
                  height: { xs: "auto", md: 280, lg: 320, xl: 360 },
                  gap: { xs: 1.5, md: 2 },
                  py: { xs: "1rem", md: 0 },
                }}
              >
                <Box
                  sx={{
                    flex: { xs: "1 1 auto", md: "0 0 55%" },
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    pr: { xs: "1rem", md: 2 },
                    pt: { xs: 0, md: 2 },
                    pl: { xs: "1rem", md: 3 },
                  }}
                >
                  <Box
                    sx={{
                      px: "0.375rem",
                      py: "1.063rem",
                      height: { xs: "2rem", md: "2.625rem" },
                      width: { xs: "2rem", md: "2.625rem" },
                      borderRadius: "50%",
                      bgcolor: "primary.normal",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: { xs: "0.5rem", md: "0.75rem" }
                    }}
                  >
                    <Typography sx={{ color: "#FEFEFE", fontSize: { xs: "1.5rem", md: "2rem" } }}>3</Typography>
                  </Box>

                  <Typography
                    sx={{ 
                      mb: { xs: "0.5rem", md: "0.75rem" }, 
                      color: "#5A5A5A", 
                      fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem", lg: "2rem" }, 
                      fontWeight: 600, 
                      lineHeight: { xs: "1.5rem", md: "1.75rem" } 
                    }}
                  >
                    Get Professional Help
                  </Typography>

                  <Typography sx={{ 
                    color: "#989898", 
                    lineHeight: '140%', 
                    fontSize: { xs: "0.875rem", md: "1rem" } 
                  }}>
                    Our verified expert arrives on time and completes the job with care and expertise.
                  </Typography>
                </Box>

                <Box
                  sx={{
                    flex: { xs: "1 1 auto", md: "0 0 45%" },
                    position: "relative",
                    minHeight: { xs: 200, sm: 250, md: "100%" },
                    borderRadius: { xs: 1, md: 2 },
                    overflow: "hidden",
                    width: { xs: "100%", md: "auto" },
                  }}
                >
                  <Image
                    src="/image/how-work-img-3.png"
                    alt="Get Professional Help"
                    fill
                    style={{ objectFit: "contain" }}
                    sizes="(max-width: 600px) 100vw, (max-width: 960px) 45vw, 45vw"
                  />
                </Box>
              </Box>
            </Box>

            <Box className="col-span-12 md:col-span-7">
              <Box
                sx={{
                  bgcolor: "white",
                  borderRadius: { xs: 1, md: 2 },
                  pl: { xs: "1rem", sm: "1.5rem", md: "1.875rem" },
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  position: "relative",
                  height: { xs: "auto", md: 280, lg: 320, xl: 360 },
                  width: { xs: "100%", md: "100%" },
                  gap: { xs: 1.5, md: 2 },
                  overflow: "hidden",
                  py: { xs: "1rem", md: 0 },
                }}
              >
                <Box
                  sx={{
                    flex: { xs: "1 1 auto", md: "0 0 55%" },
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    pr: { xs: "1rem", md: 2 },
                    pt: { xs: 0, md: 2 },
                    pl: { xs: "1rem", md: 3 },
                  }}
                >
                  <Box
                    sx={{
                      px: "0.375rem",
                      py: "1.063rem",
                      height: { xs: "2rem", md: "2.625rem" },
                      width: { xs: "2rem", md: "2.625rem" },
                      borderRadius: "50%",
                      bgcolor: "primary.normal",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: { xs: "0.5rem", md: "0.75rem" }
                    }}
                  >
                    <Typography sx={{ color: "#FEFEFE", fontSize: { xs: "1.5rem", md: "2rem" } }}>4</Typography>
                  </Box>

                  <Typography
                    sx={{ 
                      mb: { xs: "0.5rem", md: "0.75rem" }, 
                      color: "#5A5A5A", 
                      fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem", lg: "2rem" }, 
                      fontWeight: 600, 
                      lineHeight: { xs: "1.5rem", md: "1.75rem" } 
                    }}
                  >
                    Enjoy Hassle-Free Living
                  </Typography>

                  <Typography sx={{ 
                    color: "#989898", 
                    lineHeight: '140%', 
                    fontSize: { xs: "0.875rem", md: "1rem" } 
                  }}>
                    Relax knowing your home is in good hands. We ensure quality and your complete satisfaction.
                  </Typography>
                </Box>

                <Box
                  sx={{
                    flex: { xs: "1 1 auto", md: "0 0 45%" },
                    position: "relative",
                    minHeight: { xs: 200, sm: 250, md: "100%" },
                    borderRadius: { xs: 1, md: 2 },
                    width: { xs: "100%", md: "auto" },
                  }}
                >
                  <Image
                    src="/image/how-work-img-4.png"
                    alt="Enjoy Hassle-Free Living"
                    fill
                    style={{ objectFit: "contain" }}
                    sizes="(max-width: 600px) 100vw, (max-width: 960px) 45vw, 45vw"
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* App Download Section */}
      <Box sx={{ bgcolor: 'white', py: { xs: 4, sm: 6, md: 8 } }}>
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

              {/* App Store Badges */}
              <Box>
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

      {/* Testimonials Section */}
      <Box sx={{ bgcolor: 'grey.50', py: { xs: "2rem", sm: "3rem", md: "4.375rem" }, color: 'black', overflow: 'visible' }}>
        <Box sx={{ overflow: 'visible', px: { xs: "1rem", sm: "2rem", md: 0 } }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography
              sx={{
                lineHeight: "130%",
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem", lg: "4.063rem" },
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
              pt: { xs: 6, sm: 8, md: 10 },
              mb: { xs: 2, md: 4 },
            }}
          >
            <Box
              ref={testimonialCarouselRef}
              sx={{
                display: "flex",
                gap: { xs: 2, sm: 3, md: 4 },
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
                px: { xs: "1rem", sm: "2rem", md: 0 },
              }}
            >
              {testimonials.map((testimonial, index) => {
                const isActive = testimonialIndex === index;
                return (
                  <Box
                    key={testimonial.id}
                    sx={{
                      flexShrink: 0,
                      minWidth: { xs: "85%", sm: "400px", md: 600 },
                      width: { xs: "85%", sm: "400px", md: 600 },
                      scrollSnapAlign: "center",
                      display: "flex",
                      justifyContent: "center",
                      overflow: "visible",
                      pt: { xs: 4, sm: 5, md: 6 },
                    }}
                  >
                    <Card
                      elevation={2}
                      sx={{
                        bgcolor: "white",
                        borderRadius: { xs: 2, md: 3 },
                        p: { xs: 2, sm: 3, md: 4 },
                        pt: { xs: 6, sm: 7, md: 8 },
                        position: "relative",
                        width: "100%",
                        minHeight: { xs: 250, md: 300 },
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
                          top: { xs: -40, md: -50 },
                          left: { xs: 15, md: 20 },
                          width: { xs: 80, md: 100 },
                          height: { xs: 96, md: 120 },
                          borderRadius: "50%",
                          border: "0.25rem solid white",
                          overflow: "hidden",
                          boxShadow: "0 0.25rem 0.5rem rgba(0,0,0,0.1)",
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
                            sizes="(max-width: 600px) 80px, 100px"
                          />
                        </Box>
                      </Box>

                      {/* Testimonial Text */}
                      <Typography
                        variant="body1"
                        sx={{
                          pl: { xs: 10, md: 13 },
                          color: "text.primary",
                          lineHeight: 1.8,
                          fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
                          mt: { xs: 1, md: 2 },
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

