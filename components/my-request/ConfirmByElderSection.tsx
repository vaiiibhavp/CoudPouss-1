"use client";

import React from "react";
import { Box, Typography, Button, Card, Avatar } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckIcon from "@mui/icons-material/Check";
import InfoIcon from "@mui/icons-material/Info";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import IconButton from "@mui/material/IconButton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

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

export default function ConfirmByElderSection({ data }: CompletedSectionProps) {
  const router = useRouter();

  // Mock data if not provided
  const completedData: CompletedData = data || {
    id: 1,
    title: "Gardening Service",
    image: "/image/main.png",
    date: "16 Aug, 2025",
    time: "10:00 am",
    location: "Paris, 75003",
    clientName: "Bessie Cooper",
    clientAvatar: "/image/main.png",
    clientPhone: "+91 7222201100",
    finalizedQuoteAmount: "€499",
    securityCode: ["3", "2", "5", "5", "8"],
    description:
      "Our skilled team will expertly assemble your furniture, ensuring every piece is put together with precision. We pay meticulous attention to detail, so you can trust that your home will be ready for use in no time. Whether it's a complex wardrobe or a simple table, we handle it all with care and professionalism. Enjoy a hassle-free experience as we transform your space with our assembly services.",
    jobPhotos: ["/image/main.png", "/image/main.png"],
    paymentBreakdown: {
      finalizedQuoteAmount: "€499",
      platformFee: "€74.85",
      taxes: "€12.0",
      total: "€340.00",
    },
    serviceTimeline: [
      {
        status: "Service request placed",
        date: "Fri, 20 Jan 2025 - 8:15pm",
        completed: true,
      },
      {
        status: "Quote Received",
        date: "Fri, 20 Jan 2025 - 8:15pm",
        completed: true,
      },
      {
        status: "Quote Approved",
        date: "Fri, 20 Jan 2025 - 8:15pm",
        completed: true,
      },
      {
        status: "Payment Processed",
        date: "Fri, 20 Jan 2025 - 8:15pm",
        completed: true,
      },
      {
        status: "Service Confirmed with expert",
        date: "Wed, 10 Jan 2025 - 9:00pm",
        completed: true,
      },
      {
        status: "Expert out for service",
        date: "Scheduled on Fri, 20 Jan 2025 - 8:15pm",
        completed: false,
      },
      {
        status: "Service Started",
        date: "Scheduled on Fri, 20 Jan 2025 - 8:15pm",
        completed: false,
      },
      {
        status: "Service Completed",
        date: "Scheduled on Fri, 20 Jan 2025 - 8:15pm",
        completed: false,
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
      {/* Main Grid Layout */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 4,
        }}
      >
        {/* Left Column */}
        <Box>
          {/* Service Header with Profile Picture */}
          <Card
            sx={{
              p: 3,
              borderRadius: 3,
              mb: 3,
              border: "0.0625rem solid #E5E7EB",
              boxShadow: "none",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                src={completedData.image}
                alt={completedData.title}
                sx={{
                  width: "7.6875rem",
                  height: "6.375rem",
                  borderRadius: "0.75rem",
                }}
              />
              <Box>
                <Typography
                  fontWeight="600"
                  sx={{
                    color: "#424242",
                    mb: 0.5,
                    fontSize: "1.25rem",
                    lineHeight: "1.5rem",
                    letterSpacing: "0%",
                  }}
                >
                  {completedData.title}
                </Typography>
                <Typography
                  sx={{
                    color: "#6D6D6D",
                    fontWeight: 400,
                    fontSize: "1rem",
                    lineHeight: "1.125rem",
                    letterSpacing: "0%",
                  }}
                >
                  Exterior Cleaning
                </Typography>
              </Box>
            </Box>
          </Card>

          {/* Key Details */}
          <Box
            sx={{
              borderRadius: "1rem",
              border: "0.0625rem solid #E2E8F0",
              bgcolor: "#FBFBFB",
              p: "1rem",
              display: "flex",
              flexDirection: "column",
              textAlign: "left",
              gap: "0.5rem",
              mb: "1rem",
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                rowGap: "0.5rem",
                columnGap: "0.5rem",
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Image
                  src="/icons/Calendar.png"
                  alt="Date"
                  width={24}
                  height={24}
                />
                <Typography
                  fontWeight={400}
                  sx={{
                    fontSize: "0.875rem",
                    lineHeight: "1.125rem",
                    letterSpacing: "0%",
                    color: "#424242",
                  }}
                >
                  {completedData.date}
                </Typography>
              </Box>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Image
                  src="/icons/Clock.png"
                  alt="Time"
                  width={24}
                  height={24}
                />
                <Typography
                  fontWeight={400}
                  sx={{
                    fontSize: "0.875rem",
                    lineHeight: "1.125rem",
                    letterSpacing: "0%",
                    color: "#424242",
                  }}
                >
                  {completedData.time}
                </Typography>
              </Box>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Image
                  src="/icons/MapPin.png"
                  alt="Location"
                  width={24}
                  height={24}
                />
                <Typography
                  fontWeight={400}
                  sx={{
                    fontSize: "0.875rem",
                    lineHeight: "1.125rem",
                    letterSpacing: "0%",
                    color: "#424242",
                  }}
                >
                  {completedData.location}
                </Typography>
              </Box>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Image
                  src="/icons/fi_6374086.png"
                  alt="Service type"
                  width={24}
                  height={24}
                />
                <Typography
                  fontWeight={400}
                  sx={{
                    fontSize: "0.875rem",
                    lineHeight: "1.125rem",
                    letterSpacing: "0%",
                    color: "#424242",
                  }}
                >
                  DIY Services
                </Typography>
              </Box>
            </Box>
          </Box>

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
                letterSpacing: "0%",
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
              fontWeight="500"
              sx={{
                color: "#323232",
                fontSize: "1.125rem",
                lineHeight: "1.25rem",
                letterSpacing: "0%",
              }}
            >
              Security Code
            </Typography>
            <Box sx={{ display: "flex", gap: "1.25rem" }}>
              {completedData.securityCode.map((digit, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 48,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "0.0125rem solid transparent",
                    borderRadius: "1.25rem",
                    bgcolor: "rgba(234, 240, 243, 0.3)",
                    padding: "0.625rem 0.75rem",
                    "&:hover": {
                      border: "0.0125rem solid #DFF0EE",
                    },
                  }}
                >
                  <Typography
                    fontWeight={400}
                    sx={{
                      color: "#0F232F",
                      fontSize: "1.25rem",
                      lineHeight: "100%",
                      letterSpacing: "0%",
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
                letterSpacing: "0%",
              }}
            >
              Note: Final 3 digits will be given to you on service date.
            </Typography>
          </Card>

          {/* Personalized Short Message */}
          <Box sx={{ mb: "1rem" }}>
            <Typography
              fontWeight={400}
              sx={{
                color: "#323232",
                fontSize: "1rem",
                lineHeight: "1.125rem",
                letterSpacing: "0%",
                mb: 2,
              }}
            >
              Personalized short message
            </Typography>
            <Card
              sx={{
                borderRadius: "0.75rem",
                border: "0.0625rem solid #D5D5D5",
                padding: "0.875rem 1rem",
                boxShadow: "none",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography
                fontWeight={400}
                sx={{
                  color: "#818285",
                  fontSize: "1rem",
                  lineHeight: "1.125rem",
                  letterSpacing: "0%",
                  textAlign: "justify",
                }}
              >
                {completedData.description}
              </Typography>
            </Card>
          </Box>

          {/* Short Videos Section */}
          <Box sx={{ mb: "1rem" }}>
            <Typography
              fontWeight={400}
              sx={{
                color: "#323232",
                fontSize: "1rem",
                lineHeight: "1.125rem",
                letterSpacing: "0%",
                mb: 2,
              }}
            >
              Short videos
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              {[1, 2].map((item) => (
                <Box
                  key={item}
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: "11.25rem",
                    borderRadius: 2,
                    overflow: "hidden",
                    bgcolor: "#F3F4F6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="body2" sx={{ color: "#6B7280" }}>
                    Video {item}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Supporting Documents */}
          <Box sx={{ mb: "1rem" }}>
            <Typography
              fontWeight={400}
              sx={{
                color: "#323232",
                fontSize: "1rem",
                lineHeight: "1.125rem",
                letterSpacing: "0%",
                mb: 2,
              }}
            >
              Supporting documents
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              {[1, 2].map((item) => (
                <Box
                  key={item}
                  sx={{
                    width: "100%",
                    height: "8.875rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                    border: "0.0625rem dashed #E5E7EB",
                    borderRadius: 1,
                    p: 2,
                    boxSizing: "border-box",
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 1,
                      bgcolor: "#E5E7EB",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: "#6B7280", fontWeight: 600 }}
                    >
                      PDF
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#6B7280",
                      fontSize: "0.875rem",
                    }}
                  >
                    View Document
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Right Column */}
        <Box>
          {/* About Professional */}
          <Card
            sx={{
              borderRadius: "0.75rem",
              border: "0.0625rem solid #E6E6E6",
              bgcolor: "#FFFFFF",
              padding: "0.8125rem 1rem",
              mb: "1rem",
              boxShadow: "none",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                fontWeight={400}
                sx={{
                  color: "#323232",
                  fontSize: "1rem",
                  lineHeight: "1.125rem",
                  letterSpacing: "0%",
                }}
              >
                About professional
              </Typography>
              <IconButton
                sx={{
                  padding: 0,
                  width: "1.5rem",
                  height: "1.5rem",
                }}
              >
                <FavoriteBorderIcon
                  sx={{ fontSize: "1.2rem", color: "#323232" }}
                />
              </IconButton>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <Avatar
                  src={completedData.clientAvatar}
                  alt={completedData.clientName}
                  sx={{ width: "2.5rem", height: "2.5rem" }}
                />
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Typography
                      fontWeight={600}
                      sx={{
                        color: "#0F232F",
                        fontSize: "1rem",
                        lineHeight: "1.125rem",
                        letterSpacing: "0%",
                      }}
                    >
                      {completedData.clientName}
                    </Typography>
                    <Image
                      src="/icons/verify.png"
                      alt="Verified"
                      width={24}
                      height={24}
                      style={{ width: "1.5rem", height: "1.5rem" }}
                    />
                  </Box>
                </Box>
              </Box>
              <Button
                variant="outlined"
                sx={{
                  textTransform: "none",
                  borderRadius: "0.5rem",
                  border: "0.0625rem solid #214C65",
                  color: "#214C65",
                  padding: "0.625rem 3.75rem",
                  gap: "0.625rem",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  lineHeight: "1.125rem",
                  letterSpacing: "0%",
                  "&:hover": {
                    border: "0.0625rem solid #214C65",
                    bgcolor: "transparent",
                  },
                }}
              >
                Chat
              </Button>
            </Box>
          </Card>

          {/* Address */}
          <Card
            sx={{
              borderRadius: "0.75rem",
              border: "0.0625rem solid #E6E6E6",
              bgcolor: "#FFFFFF",
              padding: "0.8125rem 1rem",
              mb: "1rem",
              boxShadow: "none",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              "&:hover": {
                border: "0.0625rem solid #E6E6E6",
              },
            }}
          >
            <Typography
              fontWeight={500}
              sx={{
                color: "#323232",
                fontSize: "1.125rem",
                lineHeight: "1.25rem",
                letterSpacing: "0%",
              }}
            >
              Address
            </Typography>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
              <LocationOnIcon
                sx={{ fontSize: "1.2rem", color: "#6B7280", mt: 0.2 }}
              />
              <Typography
                fontWeight={600}
                sx={{
                  color: "#595959",
                  fontSize: "0.875rem",
                  lineHeight: "1rem",
                  letterSpacing: "0%",
                }}
              >
                4517 Washington Ave. Manchester, Kentucky 39495
              </Typography>
            </Box>
          </Card>

          {/* Service Status Card */}
          <Card
            sx={{
              borderRadius: "0.75rem",
              border: "0.0625rem solid #E6E6E6",
              bgcolor: "#FFFFFF",
              padding: "1.5rem",
              boxShadow: "none",
              display: "flex",
              flexDirection: "column",
              "&:hover": {
                border: "0.0625rem solid #E6E6E6",
              },
            }}
          >
            <Typography
              fontWeight={500}
              sx={{
                color: "#323232",
                fontSize: "1.125rem",
                lineHeight: "1.25rem",
                mb: "1.25rem",
                letterSpacing: "0%",
              }}
            >
              Service Status
            </Typography>

            {/* Timeline */}
            {completedData.serviceTimeline.map((item, index) => {
              const stepNumber = index >= 5 ? index - 4 : null;
              return (
                <Box key={index} sx={{ mb: 3, position: "relative" }}>
                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}
                  >
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
                        <CheckIcon
                          sx={{ fontSize: "1.1rem", color: "white" }}
                        />
                      ) : (
                        <Typography
                          variant="body2"
                          fontWeight="600"
                          sx={{ color: "white", fontSize: "0.875rem" }}
                        >
                          {stepNumber}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="body1"
                        fontWeight="600"
                        sx={{
                          color: "#1F2937",
                          mb: 0.5,
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
                          letterSpacing: "0%",
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
              );
            })}
          </Card>

          {/* Information Message */}
          <Box sx={{ mb: "1rem", mt: "1rem" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                mb: "0.5rem",
              }}
            >
              <Image
                src="/icons/warning.png"
                alt="Warning"
                width={20}
                height={20}
              />
              <Typography variant="body1" fontWeight={500}>
                Information message
              </Typography>
            </Box>
            <Typography
              fontWeight={400}
              sx={{
                color: "#323232",
                fontSize: "0.75rem",
                lineHeight: "150%",
                letterSpacing: "0%",
                verticalAlign: "middle",
              }}
            >
              Could you please help us guarantee the quality of services
              exchanged from this point forward? Our role is to connect you with
              professionals and ensure your transaction through secure API
              providers. We are a platform that helps you find professionals for
              your needs. Could you please write to the professional to solve
              your problems. We are not responsible for any damage to your
              property or any other issue.
            </Typography>
          </Box>

          {/* Cancel Request Button */}

          <Box
          
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
          >
            <Button
              variant="outlined"
              sx={{
                textTransform: "none",
                borderRadius: "0.5rem",
                border: "0.0625rem solid #214C65",
                color: "#214C65",
                padding: "0.625rem 3.75rem",
                gap: "0.625rem",
                fontWeight: 600,
                fontSize: "0.875rem",
                lineHeight: "1.125rem",
                letterSpacing: "0%",
                "&:hover": {
                  border: "0.0625rem solid #214C65",
                  bgcolor: "transparent",
                },
              }}
            >
              Cancel request
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
