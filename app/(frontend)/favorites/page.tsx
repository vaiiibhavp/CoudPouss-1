"use client"
import { Box, Button, IconButton, Typography } from '@mui/material'
import React, { useEffect } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/Star";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

const page = () => {
    const router = useRouter();



    // Check if user is authenticated on mount
    useEffect(() => {
        const storedInitial = localStorage.getItem('userInitial');
        const storedEmail = localStorage.getItem('userEmail');

        // If user details are not present, redirect to login
        if (!storedInitial || !storedEmail) {
            router.push(ROUTES.LOGIN);
        }
    }, [router]);



    return (
        <Box sx={{ bgcolor: "white", px: "5rem", py: "4.625rem" }}>
            <Box >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: "2rem" }}>
                    <Typography
                        sx={{
                            color: "text.primary",
                            fontSize: { xs: "1.2rem", md: "1.688rem", fontWeight: 700 },
                        }}
                    >
                        Favorite Professionals
                    </Typography>
                    <Button
                        variant="outlined"
                        sx={{
                            m: 0,
                            textTransform: "none",
                            color: "#2F6B8E",
                            px: "1.25rem",
                            py: "0.5rem",
                            display: { xs: "none", md: "block" },

                        }}
                    >
                        View All
                    </Button>
                </Box>

                {/* Professionals Rows */}
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 3,
                    }}
                >
                    {[
                        { name: "Wade Warren", rating: 4.2, reviews: 1490 },
                        { name: "Jenny Wilson", rating: 4.5, reviews: 1234 },
                        { name: "Robert Fox", rating: 4.8, reviews: 2100 },
                        { name: "Cameron Williamson", rating: 4.3, reviews: 980 },
                        { name: "Leslie Alexander", rating: 4.6, reviews: 1650 },
                        { name: "Leslie Alexander", rating: 4.6, reviews: 1650 },
                    ].map((professional, index) => (
                        <Box
                            key={index}
                            sx={{
                                width: 200,
                                borderRadius: "1.125rem",
                                p: "0.875rem",
                                textAlign: "center",
                                position: "relative",
                                border: "0.0625rem solid #DFE8ED",
                            }}
                        >
                            {/* Heart Icon */}
                            <IconButton
                                sx={{
                                    position: "absolute",
                                    top: 8,
                                    right: 8,
                                    color: "error.main",
                                    p: 0.5,
                                }}
                            >
                                <FavoriteIcon sx={{ fontSize: 20 }} />
                            </IconButton>

                            {/* Profile Picture */}
                            <Box
                                sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: "50%",
                                    bgcolor: "grey.300",
                                    margin: "0 auto 0.75rem",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    overflow: "hidden",
                                }}
                            >
                                <AccountCircleIcon sx={{ fontSize: 80, color: "grey.500" }} />
                            </Box>

                            {/* Name */}
                            <Typography sx={{ mb: 1, textAlign: 'left', color: "#323232", fontSize: "1.125rem", fontWeight: 500 }}>
                                {professional.name}
                            </Typography>
                            <Box sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"

                            }} >
                                {/* Rating */}
                                <Box sx={{ display: "flex", gap: 0.5, mb: "0.375rem", alignItems: "center" }}>
                                    <Typography sx={{
                                        textAlign: 'left',
                                        color: "secondary.naturalGray",
                                        fontSize: "1.063rem"
                                    }}>
                                        {professional.rating}
                                    </Typography>
                                    <StarIcon sx={{ fontSize: 16, color: "#F59E0B" }} />
                                </Box>

                                {/* Reviews */}
                                <Typography variant="caption" color="#999999" sx={{
                                    fontSize: "0.688rem",
                                    lineHeight: "1rem"
                                }} >
                                    ({professional.reviews} Reviews)
                                </Typography>

                            </Box>


                        </Box>
                    ))}

                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 3,
                        mt:"2rem"
                    }}
                >
                    {[
                        { name: "Wade Warren", rating: 4.2, reviews: 1490 },
                        { name: "Jenny Wilson", rating: 4.5, reviews: 1234 },
                        { name: "Robert Fox", rating: 4.8, reviews: 2100 },
                        { name: "Cameron Williamson", rating: 4.3, reviews: 980 },
                        { name: "Leslie Alexander", rating: 4.6, reviews: 1650 },
                        { name: "Leslie Alexander", rating: 4.6, reviews: 1650 },
                    ].map((professional, index) => (
                        <Box
                            key={index}
                            sx={{
                                width: 200,
                                borderRadius: "1.125rem",
                                p: "0.875rem",
                                textAlign: "center",
                                position: "relative",
                                border: "0.0625rem solid #DFE8ED",
                            }}
                        >
                            {/* Heart Icon */}
                            <IconButton
                                sx={{
                                    position: "absolute",
                                    top: 8,
                                    right: 8,
                                    color: "error.main",
                                    p: 0.5,
                                }}
                            >
                                <FavoriteIcon sx={{ fontSize: 20 }} />
                            </IconButton>

                            {/* Profile Picture */}
                            <Box
                                sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: "50%",
                                    bgcolor: "grey.300",
                                    margin: "0 auto 0.75rem",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    overflow: "hidden",
                                }}
                            >
                                <AccountCircleIcon sx={{ fontSize: 80, color: "grey.500" }} />
                            </Box>

                            {/* Name */}
                            <Typography sx={{ mb: 1, textAlign: 'left', color: "#323232", fontSize: "1.125rem", fontWeight: 500 }}>
                                {professional.name}
                            </Typography>
                            <Box sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"

                            }} >
                                {/* Rating */}
                                <Box sx={{ display: "flex", gap: 0.5, mb: "0.375rem", alignItems: "center" }}>
                                    <Typography sx={{
                                        textAlign: 'left',
                                        color: "secondary.naturalGray",
                                        fontSize: "1.063rem"
                                    }}>
                                        {professional.rating}
                                    </Typography>
                                    <StarIcon sx={{ fontSize: 16, color: "#F59E0B" }} />
                                </Box>

                                {/* Reviews */}
                                <Typography variant="caption" color="#999999" sx={{
                                    fontSize: "0.688rem",
                                    lineHeight: "1rem"
                                }} >
                                    ({professional.reviews} Reviews)
                                </Typography>

                            </Box>


                        </Box>
                    ))}

                </Box>
            </Box>
        </Box>
    )
}

export default page
