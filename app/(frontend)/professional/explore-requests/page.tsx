"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
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
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Page Title */}
        <Typography
          variant="h4"
          fontWeight="600"
          sx={{ mb: 4, color: "#1F2937" }}
        >
          Explore Requests
        </Typography>

        {/* Search and Filters */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 4,
            flexWrap: { xs: "wrap", md: "nowrap" },
          }}
        >
          {/* Search Bar */}
          <TextField
            fullWidth
            placeholder="What are you looking for?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              bgcolor: "white",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    sx={{
                      bgcolor: "#2F6B8E",
                      color: "white",
                      borderRadius: 1,
                      "&:hover": {
                        bgcolor: "#25608A",
                      },
                    }}
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Services Filter */}
          <FormControl
            sx={{
              minWidth: 150,
              bgcolor: "white",
              borderRadius: 2,
            }}
          >
            <Select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              displayEmpty
              sx={{
                borderRadius: 2,
              }}
            >
              <MenuItem value="all">Services</MenuItem>
              <MenuItem value="diy">DIY</MenuItem>
              <MenuItem value="gardening">Gardening</MenuItem>
              <MenuItem value="cleaning">Cleaning</MenuItem>
            </Select>
          </FormControl>

          {/* Price Filter */}
          <FormControl
            sx={{
              minWidth: 150,
              bgcolor: "white",
              borderRadius: 2,
            }}
          >
            <Select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              displayEmpty
              sx={{
                borderRadius: 2,
              }}
            >
              <MenuItem value="all">Price</MenuItem>
              <MenuItem value="low">€0 - €200</MenuItem>
              <MenuItem value="medium">€200 - €500</MenuItem>
              <MenuItem value="high">€500+</MenuItem>
            </Select>
          </FormControl>

          {/* Time Filter */}
          <FormControl
            sx={{
              minWidth: 150,
              bgcolor: "white",
              borderRadius: 2,
            }}
          >
            <Select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              displayEmpty
              sx={{
                borderRadius: 2,
              }}
            >
              <MenuItem value="all">Time</MenuItem>
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
            </Select>
          </FormControl>
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
            justifyContent: "center",
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
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Button
            variant="outlined"
            sx={{
              borderColor: "#2F6B8E",
              color: "#2F6B8E",
              textTransform: "none",
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              "&:hover": {
                borderColor: "#25608A",
                bgcolor: "rgba(47, 107, 142, 0.04)",
              },
            }}
          >
            Load More
          </Button>
        </Box>
      </Container>


    </Box>
  );
}
