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
import { apiGet } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";

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
        minWidth: { xs: "100%", sm: 150 },
        width: { xs: "100%", sm: "auto" },
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
        <Image src="/icons/chevron-down.png" alt="Open" width={20} height={20} />
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

  // serviceRequests is populated from API `/quote_request/open-services`

  const [serviceRequests, setServiceRequests] = useState<any[] | null>(null);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [requestsError, setRequestsError] = useState<string | null>(null);

  // Map various API response shapes to card props
  const mapApiToCard = (item: any) => {
    const id = item.service_id || item.id || item.request_id || Math.random();

    const subName = item?.subcategory_info?.sub_category_name?.name || item?.subcategory_name || item?.service_name;
    const catName = item?.category_info?.category_name?.name || item?.category || item?.type;

    const title = subName || item.title || catName || "Service Request";

    // Prefer subcategory image, then category logo, then fallback
    const image =
      item?.subcategory_info?.sub_category_name?.img_url ||
      item?.subcategory_info?.sub_category_name?.img ||
      item?.category_info?.category_name?.logo_url ||
      item?.image ||
      "/image/main.png";

    const date = item.date || item.request_date || item.created_at || "";
    const time = item.time || item.request_time || "";

    const serviceProvider = item.service_provider || item.provider_name || item.provider || "";

    const location = item.location || item.address || "";

    const estimated = item.estimated_cost ?? item.estimatedPrice ?? item.budget ?? item.price ?? item.amount ?? 0;
    const estimatedCost = typeof estimated === "number" ? `€${estimated}` : estimated;

    // Build a readable timeAgo/date label: prefer date+time, else created_at
    const timeAgo = date ? (time ? `${date} ${time}` : date) : (item.created_at ? new Date(item.created_at).toLocaleString() : "");

    const category = catName || "";

    return {
      id,
      title,
      image,
      date,
      time,
      serviceProvider,
      location,
      estimatedCost,
      timeAgo,
      category,
      categoryLogo: item?.category_info?.category_name?.logo_url || item?.category_logo || "",
    };
  };

  useEffect(() => {
    let mounted = true;
    const fetchOpenServices = async () => {
      setLoadingRequests(true);
      setRequestsError(null);
      try {
        const res = await apiGet<any>(API_ENDPOINTS.SERVICE_REQUEST.OPEN_SERVICES);
        if (!mounted) return;
        if (res.success && res.data) {
          // support common shapes: res.data.data, res.data.open_services, res.data.requests, res.data
          const payload = (res.data.data || res.data) as any;
          const list = payload?.open_services || payload?.requests || payload?.services || payload?.data || payload?.results || payload?.items || payload?.quote_requests || payload?.open || payload?.rows || payload?.openServices || payload?.OpenRequests || payload?.Transactions || payload;
          const arr = Array.isArray(list) ? list : (Array.isArray(payload) ? payload : []);
          if (arr.length > 0) {
            setServiceRequests(arr.map(mapApiToCard));
          } else {
            setServiceRequests([]);
          }
        } else {
          setRequestsError(res.error?.message || "Failed to load requests");
          setServiceRequests([]);
        }
      } catch (err) {
        console.error(err);
        setRequestsError("Failed to load requests");
        setServiceRequests([]);
      } finally {
        setLoadingRequests(false);
      }
    };

    fetchOpenServices();
    return () => { mounted = false; };
  }, []);

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Main Content */}
      <Box
        sx={{
          px: { xs: 2, sm: 4, md: "5rem" },
          mt: { xs: 3, md: "2.5rem" },
        }}
      >
        {/* Page Title */}
        <Typography
          sx={{
            color: "#2C6587",
            fontWeight: 700,
            fontSize: { xs: "1.25rem", md: "1.5rem" },
            lineHeight: { xs: "1.5rem", md: "1.75rem" },
            letterSpacing: "0rem",
            mb: { xs: 3, md: 4 },
          }}
        >
          Explore Requests
        </Typography>

        {/* Search and Filters */}
        <Box
          sx={{
            display: "flex",
            gap: { xs: 2, md: 2 },
            mb: { xs: 3, md: 4 },
            justifyContent: "space-between",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "stretch", md: "center" },
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
          <Box
            sx={{
              display: "flex",
              gap: { xs: 2, md: "1.25rem" },
              width: { xs: "100%", md: "auto" },
              flexWrap: { xs: "wrap", md: "nowrap" },
            }}
          >
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
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: { xs: "16px", md: "28px" },
            mb: { xs: 3, md: 4 },
            alignItems: "start",
          }}
        >
          {loadingRequests ? (
            <Box sx={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'center', py: 4 }}>
              <Typography>Loading requests...</Typography>
            </Box>
          ) : requestsError ? (
            <Box sx={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'center', py: 4 }}>
              <Typography color="error">{requestsError}</Typography>
            </Box>
          ) : serviceRequests && serviceRequests.length === 0 ? (
            <Box sx={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'center', py: 4 }}>
              <Typography color="text.secondary">No open requests found</Typography>
            </Box>
          ) : (
            serviceRequests?.map((request) => (
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
                category={request.category}
                categoryLogo={request.categoryLogo}
              />
            ))
          )}
        </Box>

        {/* Load More Button */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: { xs: 2, md: "1.75rem" }, mb:{ xs:3, md:"2.688rem" } }}>
          <Button
            variant="outlined"
            sx={{
              borderColor: "#214C65",
              color: "#214C65",
              textTransform: "none",
              px: { xs: 3, md: 4 },
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
