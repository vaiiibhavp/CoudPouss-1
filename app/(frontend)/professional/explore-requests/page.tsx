"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceRequestCard from "@/components/ServiceRequestCard";

export default function ExploreRequestsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");

  const CustomSelect = ({
    value,
    onChange,
    options,
  }: {
    value: string;
    onChange: (val: string) => void;
    options: { label: string; value: string }[];
  }) => (
    <Box
      sx={{
        minWidth: 150,
        bgcolor: "white",
        borderRadius: "0.625rem",
        border: "0.7px solid #BECFDA",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      <select
        value={value}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
        style={{
          appearance: "none",
          WebkitAppearance: "none",
          MozAppearance: "none",
          border: "none",
          outline: "none",
          width: "100%",
          padding: "12px 16px",
          background: "transparent",
          color: "#555555",
          fontSize: "14px",
          lineHeight: "140%",
          fontWeight: 400,
          cursor: "pointer",
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <Box
        sx={{
          position: "absolute",
          right: 12,
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Image src="/icons/chevron-down.png" alt="Open" width={24} height={24} />
      </Box>
    </Box>
  );

  const DropdownIcon = (props: any) => (
    <Box
      component="span"
      {...props}
      sx={{ display: "flex", alignItems: "center", pr: "0.25rem" }}
    >
      <Image src="/icons/chevron-down.png" alt="Open" width={24} height={24} />
    </Box>
  );

  // Check if user is authenticated on mount
  useEffect(() => {
    const storedInitial = localStorage.getItem("userInitial");
    const storedEmail = localStorage.getItem("userEmail");

    // If user details are not present, redirect to login
    if (!storedInitial || !storedEmail) {
      router.push(ROUTES.LOGIN);
    }
  }, [router]);

  // Service request data - expanded to 6 items
  const allServiceRequests = [
    {
      id: 1,
      title: "Furniture Assembly",
      image: "/image/main.png",
      date: "16 Aug, 2025",
      time: "10:00 am",
      serviceProvider: "DIY Services",
      location: "Paris 75001",
      estimatedCost: "€499",
      timeAgo: "2 hours ago",
      category: "DIY",
    },
    {
      id: 2,
      title: "Furniture Assembly",
      image: "/image/main.png",
      date: "16 Aug, 2025",
      time: "10:00 am",
      serviceProvider: "Gardening Services",
      location: "Paris 75001",
      estimatedCost: "€499",
      timeAgo: "2 hours ago",
      category: "Gardening",
    },
    {
      id: 3,
      title: "Furniture Assembly",
      image: "/image/main.png",
      date: "16 Aug, 2025",
      time: "10:00 am",
      serviceProvider: "DIY Services",
      location: "Paris 75001",
      estimatedCost: "€499",
      timeAgo: "2 hours ago",
      category: "DIY",
    },
    {
      id: 4,
      title: "Furniture Assembly",
      image: "/image/main.png",
      date: "16 Aug, 2025",
      time: "10:00 am",
      serviceProvider: "DIY Services",
      location: "Paris 75001",
      estimatedCost: "€499",
      timeAgo: "2 hours ago",
      category: "DIY",
    },
    {
      id: 5,
      title: "Furniture Assembly",
      image: "/image/main.png",
      date: "16 Aug, 2025",
      time: "10:00 am",
      serviceProvider: "DIY Services",
      location: "Paris 75001",
      estimatedCost: "€499",
      timeAgo: "2 hours ago",
      category: "DIY",
    },
    {
      id: 6,
      title: "Furniture Assembly",
      image: "/image/main.png",
      date: "16 Aug, 2025",
      time: "10:00 am",
      serviceProvider: "DIY Services",
      location: "Paris 75001",
      estimatedCost: "€499",
      timeAgo: "2 hours ago",
      category: "DIY",
    },
  ];

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Main Content */}
      <Box
        sx={{
          px: "5rem",
          mt: "2.5rem",
        }}
      >
        {/* Page Title */}
        <Typography
          sx={{
            color: "#2C6587",
            fontWeight: 700,
            fontSize: "1.5rem", // 24px
            lineHeight: "1.75rem", // 28px
            letterSpacing: "0rem",
            mb: 4,
          }}
        >
          Explore Requests
        </Typography>

        {/* Search and Filters */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 4,
            justifyContent: "space-between",
            flexWrap: { xs: "wrap", md: "nowrap" },
          }}
        >
          {/* Search Bar */}
          <TextField
            placeholder="What are you looking for?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              width: { xs: "100%", md: "525px" },
              bgcolor: "white",
              borderRadius: "0.625rem", // 10px
              "& fieldset": {
                borderColor: "#BECFDA",
                borderWidth: "0.7px",
              },
              "& .MuiOutlinedInput-root": {
                borderRadius: "0.625rem",
                "&:hover fieldset": {
                  borderColor: "#BECFDA",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#BECFDA",
                },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    sx={{
                      bgcolor: "#2C6587",
                      color: "white",
                      borderRadius: "50%",
                      "&:hover": {
                        bgcolor: "primary.dark",
                      },
                    }}
                  >
                    <Image
                      src="/icons/searhIcon.png"
                      alt="Search Icon"
                      width={16}
                      height={16}
                    />
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                "& .MuiInputBase-input::placeholder": {
                  color: "#555555",
                  fontSize: "0.875rem", // 14px
                  lineHeight: "140%",
                  fontWeight: 400,
                },
              },
            }}
          />
          <Box sx={{ display: "flex", gap: "1.25rem" }}>
            <CustomSelect
              value={serviceFilter}
              onChange={setServiceFilter}
              options={[
                { label: "Services", value: "all" },
                { label: "DIY", value: "diy" },
                { label: "Gardening", value: "gardening" },
                { label: "Cleaning", value: "cleaning" },
              ]}
            />
            <CustomSelect
              value={priceFilter}
              onChange={setPriceFilter}
              options={[
                { label: "Price", value: "all" },
                { label: "€0 - €200", value: "low" },
                { label: "€200 - €500", value: "medium" },
                { label: "€500+", value: "high" },
              ]}
            />
            <CustomSelect
              value={timeFilter}
              onChange={setTimeFilter}
              options={[
                { label: "Time", value: "all" },
                { label: "Today", value: "today" },
                { label: "This Week", value: "week" },
                { label: "This Month", value: "month" },
              ]}
            />
          </Box>
        </Box>

        {/* Service Request Cards Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(auto-fill, minmax(18.75rem, 20rem))",
            },
            gap: 3,
            mb: 4,
            justifyContent: "space-between",
          }}
        >
          {allServiceRequests.map((request) => (
            <ServiceRequestCard
              key={request.id}
              id={request.id}
              title={request.title}
              image={request.image}
              date={request.date}
              time={request.time}
              serviceProvider={request.serviceProvider}
              location={request.location}
              estimatedCost={request.estimatedCost}
              timeAgo={request.timeAgo}
            />
          ))}
        </Box>

        {/* Load More Button */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: "1.75rem", mb:"2.688rem" }}>
          <Button
            variant="outlined"
            sx={{
              borderColor: "#214C65",
              color: "#214C65",
              textTransform: "none",
              px: 4,
              py: 1.5,
              borderRadius: "0.75rem",
              fontWeight: 600,
              fontSize: "1rem",
              lineHeight: "150%",
              letterSpacing: "0",
              "&:hover": {
                borderColor: "#25608A",
                bgcolor: "rgba(47, 107, 142, 0.04)",
              },
            }}
          >
            Load More
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
