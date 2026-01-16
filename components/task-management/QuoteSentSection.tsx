"use client";

import React from "react";
import { Box, Typography, Button, Card, Avatar } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckIcon from "@mui/icons-material/Check";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import TaskImageCard from "@/components/TaskImageCard";

interface QuoteSentData {
  id: number;
  title: string;
  image: string;
  date: string;
  time: string;
  location: string;
  clientName: string;
  clientAvatar: string;
  clientPhone: string;
  serviceStatus: string;
  statusDate: string;
  waitingStatus: string;
  description: string;
  jobPhotos: string[];
}

interface QuoteSentSectionProps {
  data: QuoteSentData;
  setSelectedQuots:any;
}

export default function QuoteSentSection({ data, setSelectedQuots }: QuoteSentSectionProps) {
  const router = useRouter();

  return (
    <Box>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon sx={{ color: "#424242" }} />}
        onClick={() => setSelectedQuots(null)}
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
          gap: 4,
        }}
      >
        {/* Left Column - Image and Description */}
        <Box>
          {/* Task Image Card */}
          <TaskImageCard
            image={data.image}
            title={data.title}
            date={data.date}
            time={data.time}
            serviceProvider="DIY Services"
            location={data.location}
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
              {data.description}
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
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
                gap: "1rem",
              }}
            >
              {data?.jobPhotos?.map((photo, index) => (
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
        </Box>

        {/* Right Column - Client Info and Status */}
        <Box>
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
                mb: 3,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  src={data.clientAvatar}
                  alt={data.clientName}
                  sx={{ width: 48, height: 48 }}
                />
                <Typography
                  fontWeight={600}
                  sx={{
                    color: "#0F232F",
                    fontSize: "1.25rem",
                    lineHeight: "1.5rem",
                    letterSpacing: 0,
                  }}
                >
                  {data.clientName}
                </Typography>
              </Box>
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

            {/* Chat Button */}
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

            {[
              {
                title: data.serviceStatus,
                subtitle: data.statusDate,
                completed: true,
              },
              {
                title: data.waitingStatus,
                subtitle: "Pending",
                completed: false,
              },
            ].map((item, index, arr) => {
              const stepNumber = index + 1;
              const isLast = index === arr.length - 1;
              return (
                <Box key={item.title} sx={{ mb: isLast ? 0 : 3, position: "relative" }}>
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

                        <Image src="/icons/check.png" alt="check" width={10} height={10} />
                      ) : (
                        <Typography
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
                        fontWeight={400}
                        sx={{
                          color: "#2B2B2B",
                          fontSize: "1rem",
                          lineHeight: "1.4rem",
                          letterSpacing: 0,
                          mb:"0.188rem"
                        }}
                      >
                        {item.title}
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
                        {item.subtitle}
                      </Typography>
                    </Box>
                  </Box>
                  {!isLast && (
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
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
