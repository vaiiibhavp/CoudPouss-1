"use client";

import React, { useState } from "react";
import { Box, Typography, Button, Avatar } from "@mui/material";
import Image from "next/image";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import MyEarnings from "@/components/MyEarnings";
import ManageServices from "@/components/ManageServices";
import ManageSubscription from "@/components/ManageSubscription";
import RatingsAndReviews from "@/components/RatingsAndReviews";
import ProfessionalEditProfile from "./components/ProfessionalEditProfile";
import DeleteProfileModal from "@/components/DeleteProfileModal";

export default function ProfessionalProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("My Profile");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const tabs = [
    "My Profile",
    "My Earnings",
    "Manage Services",
    "Manage Subscription",
    "Ratings & Reviews",
  ];

  const handleDeleteProfile = () => {
    setOpenDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    localStorage.removeItem("userInitial");
    localStorage.removeItem("userEmail");
    router.push(ROUTES.HOME);
  };

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          px: { xs: "1rem", sm: "2rem", md: "3rem", lg: "5rem" },
          py: { xs: "1.5rem", sm: "2rem", md: "2.5rem", lg: "3.188rem" },
          display: "flex",
          flexDirection: "column",
          gap: { xs: "1rem", md: "2rem" },
        }}
      >
        <Typography
          variant="h4"
          fontWeight={600}
          sx={{
            color: "text.primary",
            fontSize: { xs: "1.5rem", md: "2rem" },
          }}
        >
          Account Setting
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: "2rem",
            flexDirection: { xs: "column", md: "row" },
            flex: 1,
          }}
        >
          {/* Sidebar */}
          <Box
            sx={{
              width: { xs: "100%", md: "17.5rem" },
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              gap: "0.875rem",
            }}
          >
            {tabs.map((tab) => (
              <Button
                key={tab}
                onClick={() => setActiveTab(tab)}
                sx={{
                  justifyContent: "flex-start",
                  textTransform: "none",
                  px: activeTab === tab ? "1.25rem" : "1.25rem",
                  py: activeTab === tab ? "0.625rem" : "0.625rem",
                  borderRadius: activeTab === tab ? "6.25rem" : "6.25rem",
                  fontSize: "1rem",
                  fontFamily: "Lato, sans-serif",
                  fontWeight: activeTab === tab ? 400 : 400,
                  lineHeight: "140%",
                  letterSpacing: "0%",
                  border: activeTab === tab ? "none" : "0.0625rem solid #EAF0F3",
                  color: activeTab === tab ? "#FFFFFF" : "#6D6D6D",
                  bgcolor: activeTab === tab ? "#2C6587" : "transparent",
                  "&:hover": {
                    bgcolor: activeTab === tab ? "#2C6587" : "grey.50",
                  },
                }}
              >
                {tab}
              </Button>
            ))}



            <Button
              sx={{
                justifyContent: "flex-start",
                textTransform: "none",
                px: "1rem",
                py: "0.75rem",
                minWidth: "auto",
                fontSize: "1rem",
                fontFamily: "Lato, sans-serif",
                fontWeight: 400,
                lineHeight: "140%",
                letterSpacing: "0%",
                border: "none",
                color: "primary.main",
                bgcolor: "transparent",
                "&:hover": {
                  bgcolor: "transparent",
                },
              }}
            >
              Sign Out
            </Button>


            <Button
              onClick={handleDeleteProfile}
              sx={{
                justifyContent: "flex-start",
                textTransform: "none",
                px: "1rem",
                py: 0,
                minWidth: "auto",
                fontSize: "1rem",
                fontFamily: "Lato, sans-serif",
                fontWeight: 400,
                lineHeight: "140%",
                letterSpacing: "0%",
                border: "none",
                color: "#D32F2F",
                bgcolor: "transparent",
                "&:hover": {
                  bgcolor: "transparent",
                },
              }}
            >
              Delete Profile
            </Button>
          </Box>

          {/* Main Content */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {activeTab === "My Earnings" ? (
              <MyEarnings />
            ) : activeTab === "Manage Services" ? (
              <ManageServices />
            ) : activeTab === "Manage Subscription" ? (
              <ManageSubscription />
            ) : activeTab === "Ratings & Reviews" ? (
              <RatingsAndReviews />
            ) : isEditingProfile ? (
              <ProfessionalEditProfile onCancel={() => setIsEditingProfile(false)} />
            ) : (
              <>
                {/* Profile Header */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 3,
                    mb: "1.5rem",
                    p: "1.5rem",
                    borderRadius: "0.75rem",
                    border: "0.0625rem solid #EAF5F4",
                    bgcolor: "#FFFFFF",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "center", sm: "center" },
                  }}
                >
                  <Avatar
                    sx={{
                      width: { xs: "6rem", sm: "7rem", md: "8.125rem" },
                      height: { xs: "6rem", sm: "7rem", md: "8.125rem" },
                      bgcolor: "#E5E7EB",
                    }}
                  >
                    <Image
                      src="/icons/testimonilas-1.png"
                      alt="Bessie Carter"
                      width={130}
                      height={130}
                      style={{ objectFit: "cover" }}
                    />
                  </Avatar>
                  <Box sx={{ flex: 1, width: "100%" }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                        flexDirection: { xs: "column", sm: "row" },
                        gap: { xs: 2, sm: 0 },
                      }}
                    >
                      <Box>
                        <Typography
                          variant="h4"
                          fontWeight={500}
                          sx={{
                            color: "text.primary",
                            mb: 0.5,
                            fontSize: { xs: "1.5rem", md: "2rem" },
                          }}
                        >
                          Bessie Carter
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: "text.secondary",
                            fontSize: { xs: "0.9rem", md: "1rem" },
                            fontWeight: 400,
                          }}
                        >
                          Manchester, Kentucky 39495
                        </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        onClick={() => setIsEditingProfile(true)}
                        endIcon={<EditIcon sx={{ color: "#6D6D6D", fontSize: "1rem" }} />}
                        sx={{
                          textTransform: "none",
                          border: "0.03125rem solid #DFE8ED",
                          borderColor: "#DFE8ED",
                          color: "#6D6D6D",
                          px: "0.75rem",
                          py: "0.625rem",
                          borderRadius: "6.25rem",
                          gap: "0.375rem",
                          fontSize: "1rem",
                          fontWeight: 400,
                          lineHeight: "1.125rem",
                          letterSpacing: "0%",
                          "&:hover": {
                            borderColor: "#DFE8ED",
                            bgcolor: "transparent",
                          },
                        }}
                      >
                        Edit Profile
                      </Button>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Professional User
                    </Typography>
                  </Box>
                </Box>

                {/* Personal Information */}
                <Box
                  sx={{
                    mb: { xs: "1rem", md: "1.5rem" },
                    p: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
                    borderRadius: "0.75rem",
                    border: "0.0625rem solid #EAF5F4",
                    bgcolor: "#FFFFFF",
                  }}
                >
                  <Typography
                    variant="h5"
                    fontWeight={400}
                    sx={{
                      color: "primary.normal",
                      mb: { xs: "1rem", md: "1.5rem" },
                      fontSize: { xs: "1.25rem", md: "1.5rem" },
                    }}
                  >
                    Personal Information
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                      gap: 3,
                    }}
                  >
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#939393",
                            mb: 0.5,
                            fontSize: "1.0625rem",
                            lineHeight: "1rem",
                            fontWeight: 600,
                            letterSpacing: "0%",
                          }}
                        >
                          Full Name
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: "#424242",
                            fontWeight: 500,
                            fontSize: "1.125rem",
                            lineHeight: "1",
                            letterSpacing: "0%",
                          }}
                        >
                          Bessie Cooper
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#939393",
                            mb: 0.5,
                            fontSize: "1.0625rem",
                            lineHeight: "1rem",
                            fontWeight: 600,
                            letterSpacing: "0%",
                          }}
                        >
                          Mobile Number
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: "#424242",
                            fontWeight: 500,
                            fontSize: "1.125rem",
                            lineHeight: "1",
                            letterSpacing: "0%",
                          }}
                        >
                          +11 (480) 555-0103
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#939393",
                            mb: 0.5,
                            fontSize: "1.0625rem",
                            lineHeight: "1rem",
                            fontWeight: 600,
                            letterSpacing: "0%",
                          }}
                        >
                          Year of Experience
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: "#424242",
                            fontWeight: 500,
                            fontSize: "1.125rem",
                            lineHeight: "1",
                            letterSpacing: "0%",
                          }}
                        >
                          4
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#939393",
                            mb: 0.5,
                            fontSize: "1.0625rem",
                            lineHeight: "1rem",
                            fontWeight: 600,
                            letterSpacing: "0%",
                          }}
                        >
                          E-mail id
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: "#424242",
                            fontWeight: 500,
                            fontSize: "1.125rem",
                            lineHeight: "1",
                            letterSpacing: "0%",
                          }}
                        >
                          michael.mitc@example.com
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#939393",
                            mb: 0.5,
                            fontSize: "1.0625rem",
                            lineHeight: "1rem",
                            fontWeight: 600,
                            letterSpacing: "0%",
                          }}
                        >
                          Address
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: "#424242",
                            fontWeight: 500,
                            fontSize: "1.125rem",
                            lineHeight: "1",
                            letterSpacing: "0%",
                          }}
                        >
                          4517 Washington Ave. Manchester, Kentucky 39495
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                {/* Public Profile Details */}
                <Box
                  sx={{
                    mb: { xs: "1rem", md: "1.5rem" },
                    p: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
                    borderRadius: "0.75rem",
                    border: "0.0625rem solid #EAF5F4",
                    bgcolor: "#FFFFFF",
                  }}
                >
                  <Typography
                    fontWeight={500}
                    sx={{
                      color: "#2C6587",
                      mb: { xs: 2, md: 3 },
                      fontSize: { xs: "1rem", md: "1.125rem" },
                      lineHeight: "1.5rem",
                      letterSpacing: "0%",
                    }}
                  >
                    Public profile Details
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                      gap: 3,
                    }}
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#939393",
                          mb: 0.5,
                          fontSize: "1.0625rem",
                          lineHeight: "1rem",
                          fontWeight: 600,
                          letterSpacing: "0%",
                        }}
                      >
                        Bio
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: "text.primary", lineHeight: 1.6 }}
                      >
                        Hi, I'm Bessie — with over 6 years of experience in expert TV
                        mounting and reliable plumbing solutions. I specialize in
                        mounting TVs, shelves, mirrors with precision and care
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#939393",
                          mb: 0.5,
                          fontSize: "1.0625rem",
                          lineHeight: "1rem",
                          fontWeight: 600,
                          letterSpacing: "0%",
                        }}
                      >
                        Experience & Specialties
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: "text.primary", lineHeight: 1.6 }}
                      >
                        Hi, I'm Bessie — with over 6 years of experience in expert
                        TV mounting and reliable plumbing solutions. I specialize in
                        mounting TVs, shelves, mirrors with precision and care
                      </Typography>
                    </Box>

                    <Box sx={{ gridColumn: { xs: "auto", md: "1 / -1" } }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#939393",
                          mb: 0.5,
                          fontSize: "1.0625rem",
                          lineHeight: "1rem",
                          fontWeight: 600,
                          letterSpacing: "0%",
                        }}
                      >
                        Achievements
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: "text.primary", lineHeight: 1.6 }}
                      >
                        Bessie Cooper has successfully completed over 150 projects,
                        showcasing her expertise in TV mounting and plumbing. Her
                        dedication to quality and customer satisfaction has earned her
                        numerous accolades, including the "Best Service Provider" award
                        in 2022. Clients consistently praise her attention to detail and
                        professionalism, making her a top choice for home improvement
                        services.
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Images of Past Works */}
                <Box
                  sx={{
                    p: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
                    borderRadius: "0.75rem",
                    border: "0.0625rem solid #EAF5F4",
                    bgcolor: "#FFFFFF",
                  }}
                >
                  <Typography
                    fontWeight={500}
                    sx={{
                      color: "#2C6587",
                      mb: { xs: 2, md: 3 },
                      fontSize: { xs: "1rem", md: "1.125rem" },
                      lineHeight: "1.5rem",
                      letterSpacing: "0%",
                    }}
                  >
                    Images of Past Works
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        md: "repeat(auto-fill, minmax(15.625rem, 1fr))",
                      },
                      gap: { xs: 1.5, md: 2 },
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        paddingTop: "75%",
                        borderRadius: 2,
                        overflow: "hidden",
                        bgcolor: "#F3F4F6",
                      }}
                    >
                      <Image
                        src="/image/explore-service-section-1.png"
                        alt="Past work 1"
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </Box>
                    <Box
                      sx={{
                        position: "relative",
                        paddingTop: "75%",
                        borderRadius: 2,
                        overflow: "hidden",
                        bgcolor: "#F3F4F6",
                      }}
                    >
                      <Image
                        src="/image/explore-service-section-2.png"
                        alt="Past work 2"
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </Box>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Box>

      <DeleteProfileModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
}
