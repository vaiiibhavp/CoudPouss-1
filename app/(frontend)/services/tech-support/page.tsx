"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import {
  Box,

  Typography,
  Button,

} from "@mui/material";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { apiGet } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";

export default function TechSupportPage() {
  const router = useRouter();

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
    let serviceName = "transport"
    const response = await apiGet(API_ENDPOINTS.HOME.SERVICENAME(serviceName))
    console.log(response)
  }
  
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




  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>


      {/* Hero Section - Transport Banner */}
      <Box sx={{ pt: "5rem", px: "5rem" }}>
        <Box
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            mb: 6,
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              // minHeight: { xs: 300, md: 400 },
            }}
          >
            {/* Left Side - Brown Background with Text */}
            <Box
              sx={{
                bgcolor: "#2F3C44",
                color: "white",
                p: { xs: 4, md: "3.75rem" },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "2rem", md: "2.5rem", lineHeight: "140%" },
                  color: "white",
                }}
              >
                Seeking expert Tech
              </Typography>
              <Typography

                sx={{
                  mb: "0.375rem",
                  fontWeight: 600,
                  color: "white",
                  fontSize: { xs: "2rem", md: "2.5rem", lineHeight: "140%" },
                }}
              >
                assistance?
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: "1rem",
                  color: "rgba(255,255,255,0.9)",
                  fontSize: { xs: "0.9rem", md: "0.75rem" },
                }}
              >
                Lorem Ipsum
              </Typography>
              <Typography
                sx={{
                  lineHeight: "1.75rem",
                  fontSize: "1.188rem",
                  cursor: "pointer"
                }}
              >
                Book Now
              </Typography>
            </Box>

            {/* Right Side - Image */}
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: "100%",
                // minHeight: { xs: 300, md: 400 },
              }}
            >
              <Image
                src="/image/tech-support-hero-section.png"
                alt="Transport Service"
                fill
                style={{ objectFit: "cover" }}
                priority
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
              mb: 4,
              lineHeight: "2rem",
              fontSize: { xs: "1.75rem", md: "2.5rem" },
            }}
          >
            All Services
          </Typography>

          {/* Service Cards Grid - 2 rows, 3 columns */}


          <Box sx={{ mt: 8 }}>
            {[
              "DIY Services",
              "Gardening",

            ].map((serviceName) => (
              <Box key={serviceName} sx={{ mb: "3.75rem" }}>
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
                  {transportServices.map((card) => (
                    <Box
                      key={`${serviceName}-${card.id}`}
                      sx={{
                        minWidth: "25rem",
                        borderRadius: 2,
                        overflow: "hidden",
                        bgcolor: "#EAF0F35C",
                        p: "0.75rem"
                      }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          bgcolor: "grey.200",
                          borderRadius: "0.75rem",
                          overflow: "hidden"
                        }}
                      >
                        <Image
                          src={card.image}
                          alt={card.title}
                          width={376}
                          height={225}
                          style={{ objectFit: "cover" }}
                        />
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
                          mt: "0.5rem"
                        }}
                      >
                        <Typography sx={{ color: "primary.normal", fontSize: "1.125rem", lineHeight: "2rem" }}>
                          {card.title}
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
                          }}
                        >
                          Create Request
                        </Button>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>


    </Box>
  );
}

