"use client";

import React, { useState } from "react";
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
import { formatDateString } from "@/utils/utils";
import FavoriteIcon from "@mui/icons-material/Favorite";
import RejectServiceRequestModal from "../RejectServiceRequestModal";

type ApiStatus = "pending" | "open" | "accepted" | "completed" | "cancelled";
interface ProviderInfo {
  email: string;
  first_name: string;
  full_name: string;
  id: string;
  is_favorate: boolean;
  is_verified: boolean;
  last_name: string;
  profile_photo_url: string | null;
}
interface Request {
  id: string;
  serviceName: string;
  date: string;
  time: string;
  status: ApiStatus;
  image: string;
  category: string;
  location: string;
  quote: number;
  professional?: {
    email: string;
    first_name: string;
    full_name: string;
    id: string;
    profile_image_url: string | null;
    is_verified: boolean;
    is_favorate: boolean;
    last_name: string;
  };
  message: string;
  videos: string[];
  quoteId?: string;
}
interface LifecycleItem {
  id: number;
  name: string;
  time: string | null;
  completed: boolean;
}
interface ServiceDetailData {
  service_id: string;
  task_status: string;
  service_description: string;
  chosen_datetime: string;
  category_name: string;
  category_logo: string;
  sub_category_name: string;
  provider: ProviderInfo;
  sub_category_logo: string;
  elder_address: string;
  lifecycle: LifecycleItem[];
  total_renegotiated: number;
  media: ServiceMedia;
}
interface ServiceMedia {
  photos: string[];
  videos: string[];
}
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
    name: string;
  }[];
  review: {
    clientName: string;
    clientAvatar: string;
    rating: number;
    comment: string;
  };
}

interface CompletedSectionProps {
  // data?: CompletedData;
  serviceDetail: ServiceDetailData;
  selectedRequestData: Request;
  handleFavorite: (professionalId?: string, isFavorite?: boolean) => void;
  onCancelSuccess: () => void;
}

export default function ConfirmByElderSection({
  selectedRequestData,
  serviceDetail,
  handleFavorite,
  onCancelSuccess,
}: CompletedSectionProps) {
  const router = useRouter();
  console.log("selectedRequestData vivek", selectedRequestData, serviceDetail);
  const [openReject, setOpenReject] = useState(false);

  // Mock data if not provided
  const completedData = {
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
      <Box>
        {/* Left Column */}
        <Box sx={{ display: "none" }}>
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
        <Box
          sx={{
            flex: 1,
            bgcolor: "white",
            borderRadius: { xs: 2, sm: 2.5, md: 3 },
            pt: 0,
            position: "relative",
            minHeight: { xs: 400, sm: 500, md: 600 },
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* About Professional */}
          {serviceDetail.task_status !== "pending" &&
            serviceDetail.task_status !== "open" && (
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
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleFavorite(
                          selectedRequestData.professional?.id,
                          selectedRequestData.professional?.is_favorate,
                        )
                      }
                    >
                      {selectedRequestData.professional?.is_favorate ? (
                        <FavoriteIcon
                          fontSize="small"
                          sx={{ color: "#E0245E" }}
                        />
                      ) : (
                        <FavoriteBorderIcon
                          fontSize="small"
                          sx={{ color: "#6B7280" }}
                        />
                      )}
                    </IconButton>
                  </IconButton>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "1rem" }}
                  >
                    <Avatar
                      src={
                        selectedRequestData?.professional?.profile_image_url ||
                        selectedRequestData?.professional?.profile_photo_url ||
                        ""
                      }
                      alt={selectedRequestData?.professional?.full_name}
                      sx={{ width: "2.5rem", height: "2.5rem" }}
                    />
                    <Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <Typography
                          fontWeight={600}
                          sx={{
                            color: "#0F232F",
                            fontSize: "1rem",
                            lineHeight: "1.125rem",
                            letterSpacing: "0%",
                          }}
                        >
                          {selectedRequestData.professional?.full_name ?? ""}
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
            )}

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
            {(serviceDetail.lifecycle?.length === 0 ||
              !serviceDetail.lifecycle) && (
              <Typography
                fontSize={{ xs: 12, sm: 14 }}
                fontWeight={400}
                textAlign={"center"}
              >
                No Status Available
              </Typography>
            )}
            {serviceDetail.lifecycle?.length !== 0 &&
              serviceDetail.lifecycle?.map((item, index) => {
                const stepNumber = item.completed ? null : index + 1;

                return (
                  <Box key={item.id} sx={{ mb: 3, position: "relative" }}>
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
                            fontWeight="600"
                            sx={{ color: "white", fontSize: "0.875rem" }}
                          >
                            {stepNumber}
                          </Typography>
                        )}
                      </Box>

                      <Box sx={{ flex: 1 }}>
                        <Typography
                          fontWeight={600}
                          sx={{ color: "#1F2937", mb: 0.5 }}
                        >
                          {item.name}
                        </Typography>

                        {item.time && (
                          <Typography
                            fontWeight={400}
                            sx={{
                              color: "#737373",
                              fontSize: "0.75rem",
                              lineHeight: "1.125rem",
                            }}
                          >
                            {formatDateString(
                              item.time,
                              "ddd, DD MMM YYYY  -  h:mma",
                            )}
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    {index < serviceDetail.lifecycle.length - 1 && (
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
            {serviceDetail.task_status === "completed" && (
              <Button
                // onClick={handleNavigate}
                variant="contained"
                sx={{
                  textTransform: "none",
                  borderRadius: {
                    xs: "0.375rem",
                    sm: "0.5rem",
                  },
                  pt: { xs: "0.5rem", sm: "0.625rem" },
                  pr: { xs: "1rem", sm: "2rem", md: "3.75rem" },
                  pb: { xs: "0.5rem", sm: "0.625rem" },
                  pl: { xs: "1rem", sm: "2rem", md: "3.75rem" },
                  gap: "0.625rem",
                  bgcolor: "#214C65",
                  fontSize: {
                    xs: "0.875rem",
                    sm: "0.9375rem",
                    md: "1rem",
                  },
                  width: { xs: "100%", sm: "auto" },
                  minWidth: {
                    xs: "auto",
                    sm: "120px",
                    md: "200px",
                  },
                  "&:hover": {
                    bgcolor: "#214C65",
                  },
                }}
              >
                Write A Review
              </Button>
            )}
          </Card>

          {/* Information Message */}
          {serviceDetail.task_status === "accepted" && (
            <>
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
                  exchanged from this point forward? Our role is to connect you
                  with professionals and ensure your transaction through secure
                  API providers. We are a platform that helps you find
                  professionals for your needs. Could you please write to the
                  professional to solve your problems. We are not responsible
                  for any damage to your property or any other issue.
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
                  onClick={() => setOpenReject(true)}
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
            </>
          )}
        </Box>
      </Box>
      <RejectServiceRequestModal
        serviceId={serviceDetail?.service_id || ""}
        open={openReject}
        onClose={() => setOpenReject(false)}
        onReject={(reason) => {
          console.log("Rejected with reason:", reason);
        }}
        onCancelSuccess={() => onCancelSuccess()}
      />
    </Box>
  );
}
