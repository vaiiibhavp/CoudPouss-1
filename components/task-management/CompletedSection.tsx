"use client";

import React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  Avatar,
  Rating,
  Divider,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckIcon from "@mui/icons-material/Check";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import TaskImageCard from "@/components/TaskImageCard";

interface CompletedData {
  id: number;
  title: string;
  image: string;
  date: string;
  time: string;
  location: string;
  clientName: string;
  clientAvatar: string;
  clientPhone: string;
  finalizedQuoteAmount: string;
  securityCode: string[];
  description: string;
  jobPhotos: string[];
  paymentBreakdown: {
    finalizedQuoteAmount: string;
    platformFee: string;
    taxes: string;
    total: string;
  };
  serviceTimeline: {
    status: string;
    date: string;
    completed: boolean;
  }[];
  review: {
    clientName: string;
    clientAvatar: string;
    rating: number;
    comment: string;
  };
}

interface CompletedSectionProps {
  data?: CompletedData;
}

export default function CompletedSection({ data }: CompletedSectionProps) {
  const router = useRouter();

  // Mock data if not provided
  const completedData: CompletedData = data || {
    id: 1,
    title: "Furniture Assembly",
    image: "/image/main.png",
    date: "16 Aug, 2025",
    time: "10:00 am",
    location: "Paris 75001",
    clientName: "Wade Warren",
    clientAvatar: "/image/main.png",
    clientPhone: "+91 7222201100",
    finalizedQuoteAmount: "€499",
    securityCode: ["3", "2", "5", "5", "5", "8"],
    description:
      "Transform your space with our expert furniture assembly services. Our skilled team will handle everything from unpacking to setup, ensuring your new pieces are perfectly assembled and ready for use. We specialize in a wide range of furniture types, including flat-pack items, complete modular systems, and custom installations. Enjoy a hassle-free experience with professional assembly that saves you time and effort in your newly furnished area. Schedule your assembly today and let us help you create the perfect environment!",
    jobPhotos: ["/image/main.png", "/image/main.png"],
    paymentBreakdown: {
      finalizedQuoteAmount: "€499",
      platformFee: "€74.85",
      taxes: "€12.0",
      total: "€340.00",
    },
    serviceTimeline: [
      {
        status: "Quote Sent",
        date: "Wed, 16 Jan' 2025 - 7:07pm",
        completed: true,
      },
      {
        status: "Quote Accepted",
        date: "Wed, 16 Jan' 2025 - 7:07pm",
        completed: true,
      },
      {
        status: "Out for Service",
        date: "Wed, 18 Jan' 2025 - 7:07pm",
        completed: true,
      },
      {
        status: "Started Service",
        date: "Wed, 18 Jan' 2025 - 7:07pm",
        completed: true,
      },
      {
        status: "Renegotiated the amount",
        date: "Wed, 18 Jan' 2025 - 7:07pm",
        completed: true,
      },
      {
        status: "Service Completed",
        date: "Wed, 18 Jan' 2025 - 7:07pm",
        completed: true,
      },
      {
        status: "Payment Received",
        date: "Wed, 18 Jan' 2025 - 7:07pm",
        completed: true,
      },
    ],
    review: {
      clientName: "Wade Warren",
      clientAvatar: "/image/main.png",
      rating: 4,
      comment:
        "I was thoroughly impressed with the furniture assembly service provided by this team. Their punctuality, professionalism, and incredible efficiency. They handled my new furniture with care and ensured everything was set up perfectly. I couldn't be happier with the results. I highly recommend their services to anyone in need of expert furniture assembly.",
    },
  };

  return (
    <Box>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon sx={{ color: "#424242" }} />}
        onClick={() => router.push(ROUTES.PROFESSIONAL_EXPLORE_REQUESTS)}
        sx={{
          color: "#214C65",
          fontWeight: 500,
          fontSize: "1rem",
          lineHeight: "140%",
          letterSpacing: 0,
          textTransform: "none",
          mb: "1.25rem",
          px: 0,
          minWidth: 0,
          "& .MuiButton-startIcon": { mr: "0.5rem" },
          "&:hover": {
            bgcolor: "transparent",
            color: "#2C6587",
          },
        }}
      >
        Back to All requests
      </Button>

      {/* Main Grid Layout */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: { xs: "1.5rem", md: "2.5rem" },
        }}
      >
        {/* Left Column */}
        <Box>
          {/* Task Image Card */}
          <TaskImageCard
            image={completedData.image}
            title={completedData.title}
            date={completedData.date}
            time={completedData.time}
            serviceProvider="DIY Services"
            location={completedData.location}
          />

          {/* Service Description */}
          <Box
            sx={{
              mb: "1.5rem",
              bgcolor: "#FFFFFF",
              border: "0.0625rem solid #E6E6E6",
              borderRadius: "0.75rem",
              px: "1rem",
              py: "0.8125rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <Typography
              sx={{
                color: "#323232",
                fontSize: "1.125rem",
                lineHeight: "1.25rem",
                letterSpacing: 0,
                fontWeight: 600,
              }}
            >
              Service description
            </Typography>
            <Typography
              sx={{
                color: "#555555",
                fontWeight: 400,
                fontSize: "1.125rem",
                lineHeight: "1.575rem",
                letterSpacing: 0,
                textAlign: "justify",
              }}
            >
              {completedData.description}
            </Typography>
          </Box>

          {/* Job Photos */}
          <Box
            sx={{
              mb: "1.5rem",
              bgcolor: "#FFFFFF",
              border: "0.0625rem solid #E6E6E6",
              borderRadius: "0.75rem",
              px: "1rem",
              py: "0.8125rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <Typography
              fontWeight={600}
              sx={{
                color: "#323232",
                fontSize: "1.125rem",
                lineHeight: "1.25rem",
                letterSpacing: 0,
                mb: "1rem",
              }}
            >
              Job photos
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                },
                gap: "1rem",
              }}
            >
              {completedData.jobPhotos.map((photo, index) => (
                <Box
                  key={index}
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: "9rem",
                    borderRadius: "0.5rem",
                    overflow: "hidden",
                    border: "0.0625rem solid #E5E7EB",
                  }}
                >
                  <Image
                    src={photo}
                    alt={`Job photo ${index + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </Box>
              ))}
            </Box>
          </Box>

          {/* Payment Breakdown */}
          <Box
            sx={{
              mb: "1.5rem",
              bgcolor: "#FFFFFF",
              border: "0.0625rem solid #E6E6E6",
              borderRadius: "0.75rem",
              px: "1rem",
              py: "0.8125rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <Typography
              fontWeight={600}
              sx={{
                color: "#323232",
                fontSize: "1.125rem",
                lineHeight: "1.25rem",
                letterSpacing: 0,
              }}
            >
              Payment Breakdown
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" sx={{ color: "#6B7280" }}>
                  Finalized Quote Amount
                </Typography>
                <Typography
                  fontWeight={600}
                  sx={{
                    color: "#595959",
                    fontSize: "0.875rem",
                    lineHeight: "1rem",
                    letterSpacing: 0,
                  }}
                >
                  {completedData.paymentBreakdown.finalizedQuoteAmount}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" sx={{ color: "#6B7280" }}>
                  Platform Fee (15%)
                </Typography>
                <Typography
                  fontWeight={600}
                  sx={{
                    color: "#595959",
                    fontSize: "0.875rem",
                    lineHeight: "1rem",
                    letterSpacing: 0,
                  }}
                >
                  {completedData.paymentBreakdown.platformFee}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" sx={{ color: "#6B7280" }}>
                  Taxes
                </Typography>
                <Typography
                  fontWeight={600}
                  sx={{
                    color: "#595959",
                    fontSize: "0.875rem",
                    lineHeight: "1rem",
                    letterSpacing: 0,
                  }}
                >
                  {completedData.paymentBreakdown.taxes}
                </Typography>
              </Box>
              <Divider
                sx={{
                  mb: "0.25rem",
                  mt: "-0.25rem",
                  borderColor: "#2C6587",
                  borderStyle: "dashed",
                  borderWidth: "0.0625rem",
                  borderRadius: "0.0625rem",
                }}
              />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  fontWeight={600}
                  sx={{
                    color: "#0F232F",
                    fontSize: "1.25rem",
                    lineHeight: "1.5rem",
                    letterSpacing: 0,
                  }}
                >
                  Total
                </Typography>
                <Typography
                  fontWeight={600}
                  sx={{
                    color: "#2C6587",
                    fontSize: "1.25rem",
                    lineHeight: "1",
                    letterSpacing: 0,
                  }}
                >
                  {completedData.paymentBreakdown.total}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Client Review */}
          <Card
            sx={{
              p: 3,
              borderRadius: 3,
              border: "0.0625rem solid #E5E7EB",
              boxShadow: "none",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Avatar
                src={completedData.review.clientAvatar}
                alt={completedData.review.clientName}
                sx={{ width: 48, height: 48 }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" fontWeight="600">
                  {completedData.review.clientName}
                </Typography>
                <Rating
                  value={completedData.review.rating}
                  readOnly
                  size="small"
                  sx={{ color: "#FCD34D" }}
                />
              </Box>
            </Box>
            <Typography
              variant="body2"
              sx={{ color: "#6B7280", lineHeight: 1.8, textAlign: "justify" }}
            >
              {completedData.review.comment}
            </Typography>
          </Card>
        </Box>

        {/* Right Column */}
        <Box>
          {/* Finalized Quote Amount */}
          <Card
            sx={{
              borderRadius: "0.75rem",
              border: "0.0625rem solid #E6E6E6",
              bgcolor: "#FFFFFF",
              padding: "0.8125rem 1rem 0.8125rem 1rem",
              mb: "1rem",
              boxShadow: "none",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              "&:hover": {
                border: "0.0625rem solid #E6E6E6",
              },
            }}
          >
            <Typography
              fontWeight="500"
              sx={{
                color: "#323232",
                fontSize: "1.125rem",
                lineHeight: "1.25rem",
                letterSpacing: 0,
              }}
            >
              Finalized Quote Amount
            </Typography>
            <Typography
              fontWeight="700"
              sx={{
                color: "#0F232F",
                fontSize: "1.6875rem",
                lineHeight: "2rem",
                letterSpacing: "3%",
                textAlign: "left",
              }}
            >
              {completedData.finalizedQuoteAmount}
            </Typography>
          </Card>

          {/* Security Code */}
          <Card
            sx={{
              borderRadius: "0.75rem",
              border: "0.0625rem solid #E6E6E6",
              bgcolor: "#FFFFFF",
              padding: "0.8125rem 1rem 0.8125rem 1rem",
              mb: "1rem",
              boxShadow: "none",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              "&:hover": {
                border: "0.0625rem solid #E6E6E6",
              },
            }}
          >
            <Typography
              fontWeight={600}
              sx={{
                color: "#323232",
                fontSize: "1.125rem",
                lineHeight: "1.25rem",
                letterSpacing: 0,
              }}
            >
              Security Code
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: "0.625rem",
                justifyContent: "space-between",
              }}
            >
              {completedData.securityCode.map((digit, index) => (
                <Box
                  key={index}
                  sx={{
                    py: "1.438rem",
                    px: "2.089rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "1.25rem",
                    bgcolor: "#EAF0F34D",
                  }}
                >
                  <Typography
                    fontWeight={400}
                    sx={{
                      color: "#0F232F",
                      fontSize: "1.25rem",
                      lineHeight: "100%",
                      letterSpacing: 0,
                      verticalAlign: "middle",
                    }}
                  >
                    {digit}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Typography
              fontWeight={400}
              sx={{
                color: "#424242",
                fontSize: "0.6875rem",
                lineHeight: "1rem",
                letterSpacing: 0,
              }}
            >
              Note: Final 3 digits will be given to you on service date
            </Typography>
          </Card>

          {/* About Client Card */}
          <Box
            sx={{
              px: "1.375rem",
              py: "1rem",
              borderRadius: "0.75rem",
              mb: 3,
              border: "0.0625rem solid #E5E7EB",
              boxShadow: "none",
            }}
          >
            <Typography
              fontWeight={600}
              sx={{
                color: "#323232",
                fontSize: "1.125rem",
                lineHeight: "1.25rem",
                letterSpacing: 0,
                mb: "1rem",
              }}
            >
              About client
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1.5rem",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  src={completedData.clientAvatar}
                  alt={completedData.clientName}
                  sx={{ width: 48, height: 48 }}
                />
                <Box>
                  <Typography
                    fontWeight={600}
                    sx={{
                      color: "#0F232F",
                      fontSize: "1.25rem",
                      lineHeight: "1.5rem",
                      letterSpacing: 0,
                    }}
                  >
                    {completedData.clientName}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"
                        fill="#6B7280"
                      />
                    </svg>
                    <Typography variant="body2" sx={{ color: "#6B7280" }}>
                      {completedData.clientPhone}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Chat Button */}
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#214C65",
                  color: "#FFFFFF",
                  textTransform: "none",
                  px: "1.75rem",
                  py: "0.625rem",
                  width: "fit-content",
                  borderRadius: "0.5rem",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  lineHeight: "1.125rem",
                  letterSpacing: 0,
                  "&:hover": {
                    bgcolor: "#1b3f55",
                  },
                }}
              >
                Chat
              </Button>
            </Box>
          </Box>

          {/* Address Card */}
          <Box
            sx={{
              px: "1rem",
              py: "0.8125rem",
              borderRadius: "0.75rem",
              mb: "1.5rem",
              border: "0.0625rem solid #E6E6E6",
              boxShadow: "none",
              bgcolor: "#FFFFFF",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{
                color: "#323232",
                fontSize: "1.125rem",
                lineHeight: "1.25rem",
                letterSpacing: 0,
              }}
            >
              Address
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <LocationOnIcon
                sx={{
                  fontSize: "1.5rem",
                  width: "1.5rem",
                  height: "1.5rem",
                  color: "#6B7280",
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: "#595959",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  lineHeight: "1rem",
                  letterSpacing: 0,
                }}
              >
                4517 Washington Ave. Manchester, Kentucky 39495
              </Typography>
            </Box>
          </Box>

          {/* Service Status Card */}
          <Box
            sx={{
              p: "1.5rem",
              borderRadius: "0.75rem",
              border: "0.0625rem solid #E6E6E6",
              boxShadow: "none",
              bgcolor: "#FFFFFF",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              fontWeight={600}
              sx={{
                color: "#323232",
                fontSize: "1.125rem",
                lineHeight: "1.25rem",
                letterSpacing: 0,
                mb: "1.25rem",
              }}
            >
              Service Status
            </Typography>

            {completedData.serviceTimeline.map((item, index) => (
              <Box
                key={index}
                sx={{
                  mb:
                    index === completedData.serviceTimeline.length - 1 ? 0 : 3,
                  position: "relative",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                  <Box
                    sx={{
                      width: "1.5rem",
                      height: "1.5rem",
                      borderRadius: "50%",
                      bgcolor: item.completed ? "#2E7D32" : "#424242",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {item.completed ? (
                      <CheckIcon sx={{ fontSize: "0.6rem", color: "white" }} />
                    ) : (
                      <Typography
                        fontWeight="600"
                        sx={{ color: "white", fontSize: "0.875rem" }}
                      >
                        {index + 1}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body1"
                      fontWeight={400}
                      sx={{
                        color: "#2B2B2B",
                        fontSize: "1rem",
                        lineHeight: "1.4rem",
                        letterSpacing: 0,
                        mb: "0.188rem",
                      }}
                    >
                      {item.status}
                    </Typography>
                    <Typography
                      fontWeight={400}
                      sx={{
                        color: "#737373",
                        fontSize: "0.75rem",
                        lineHeight: "1.125rem",
                        letterSpacing: 0,
                        textAlign: "left",
                      }}
                    >
                      {item.date}
                    </Typography>
                  </Box>
                </Box>
                {index < completedData.serviceTimeline.length - 1 && (
                  <Box
                    sx={{
                      position: "absolute",
                      left: "0.75rem",
                      top: "1.5rem",
                      width: "0.125rem",
                      bottom: "-1.5rem",
                      bgcolor: "#E5E7EB",
                    }}
                  />
                )}
              </Box>
            ))}
          </Box>

          {/* Information Message */}
          <Box
            sx={{
              mt: 4,
              p: 2.5,
              borderRadius: 2,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "11px",
                  mb: "0.688rem",
                }}
              >
                <Image
                  src={"/icons/warning.png"}
                  alt="warning"
                  width={20}
                  height={20}
                />
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: "1rem",
                    lineHeight: "1.125rem",
                    color: "primary.normal",
                  }}
                >
                  Information message:
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: "0.75rem",
                  lineHeight: "150%",
                  color: "#323232",
                }}
              >
                CoudPouss does not guarantee the quality of services exchanged
                from this point onward. Our role is to connect you with
                professionals and secure your transactions through escrow. All
                providers on our platform issue their own invoices directly to
                clients. Once you provide the validation code to your provider,
                you must request an invoice or receipt from them for your
                payment.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
