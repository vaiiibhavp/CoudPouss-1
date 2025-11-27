"use client";

import React from "react";
import { Box, Typography, Button, Card, Avatar, Rating } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
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

export default function ConfirmByElderSection({ data }: CompletedSectionProps) {
    const router = useRouter();

    // Mock data if not provided
    const completedData: CompletedData = data || {
        id: 1,
        title: "Gardening Service",
        image: "/image/main.png",
        date: "1 Aug, 2020",
        time: "3:00 pm",
        location: "6221 Washington Ave, Manchester, University Heights",
        clientName: "Basic Closer",
        clientAvatar: "/image/main.png",
        clientPhone: "+91 7222201100",
        finalizedQuoteAmount: "€499",
        securityCode: ["3", "2", "5", "6", "8", "9"],
        description:
            "Our shared consent is openly accessible over frontline, including our DPS and the US operating unit's office. We take our focus on listening for advice. This can be explained by your request. We are able to make sure that all of us are truly good and safe. Explain how we feel as well as our information you speak with our externally serviced.",
        jobPhotos: ["/image/main.png", "/image/main.png"],
        paymentBreakdown: {
            finalizedQuoteAmount: "€499",
            platformFee: "€74.85",
            taxes: "€12.0",
            total: "€340.00",
        },
        serviceTimeline: [
            { status: "Senior nearest placed", date: "Fri, 20 Jan 2020 - 3:00pm", completed: true },
            { status: "Quote Received", date: "Fri, 20 Jan 2020 - 3:00pm", completed: true },
            { status: "Quote Approved", date: "Fri, 20 Jan 2020 - 3:00pm", completed: true },
            { status: "Payment Processed", date: "Fri, 20 Jan 2020 - 3:00pm", completed: true },
            { status: "Service Confirmed with export", date: "Mon, 10 Jan 2020 - 3:00pm", completed: true },
            { status: "Export sold for service", date: "Expanded on 01 Jan 2020 - 3:00pm", completed: true },
            { status: "Service Started", date: "Expanded on 01 Jan 2020 - 3:00pm", completed: true },
            { status: "Service Completed", date: "Expanded on 01 Jan 2020 - 3:00pm", completed: true },
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
                    {/* Task Image Card */}
                    <TaskImageCard
                        image={completedData.image}
                        title={completedData.title}
                        date={completedData.date}
                        time={completedData.time}
                        serviceProvider="Exterior Clearing"
                        location={completedData.location}
                    />

                    {/* Service Description */}
                    <Card
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            mb: 3,
                            border: "1px solid #E5E7EB",
                            boxShadow: "none",
                        }}
                    >
                        <Typography
                            variant="h6"
                            fontWeight="600"
                            gutterBottom
                            sx={{ color: "#1F2937", mb: 2 }}
                        >
                            Service description
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ color: "#6B7280", lineHeight: 1.8, textAlign: "justify" }}
                        >
                            {completedData.description}
                        </Typography>
                    </Card>

                    {/* Job Photos */}
                    <Card
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            mb: 3,
                            border: "1px solid #E5E7EB",
                            boxShadow: "none",
                        }}
                    >
                        <Typography
                            variant="h6"
                            fontWeight="600"
                            gutterBottom
                            sx={{ color: "#1F2937", mb: 2 }}
                        >
                            Job photos
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2 }}>
                            {completedData.jobPhotos.map((photo, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        position: "relative",
                                        width: "100%",
                                        height: 180,
                                        borderRadius: 2,
                                        overflow: "hidden",
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
                    </Card>

                    {/* Short Videos Section - NEW */}
                    <Card
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            mb: 3,
                            border: "1px solid #E5E7EB",
                            boxShadow: "none",
                        }}
                    >
                        <Typography
                            variant="h6"
                            fontWeight="600"
                            gutterBottom
                            sx={{ color: "#1F2937", mb: 2 }}
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
                                        height: 180,
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
                    </Card>

                    {/* Supporting Documents Section - UPDATED */}
                    <Card
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            mb: 3,
                            border: "1px solid #E5E7EB",
                            boxShadow: "none",
                        }}
                    >
                        <Typography
                            variant="h6"
                            fontWeight="600"
                            gutterBottom
                            sx={{ color: "#1F2937", mb: 3 }}
                        >
                            Supporting documents
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            {/* First Document */}
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    p: 2,
                                    border: "1px solid #E5E7EB",
                                    borderRadius: 2,
                                    bgcolor: "#F9FAFB",
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <Box
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 1,
                                            bgcolor: "#E5E7EB",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Typography variant="body2" sx={{ color: "#6B7280", fontWeight: 600 }}>
                                            PDF
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" fontWeight="600" sx={{ color: "#1F2937" }}>
                                            View Document
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: "#6B7280" }}>
                                            Document description
                                        </Typography>
                                    </Box>
                                </Box>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        textTransform: "none",
                                        borderColor: "#E5E7EB",
                                        color: "#374151",
                                        fontWeight: 600,
                                        borderRadius: 1,
                                    }}
                                >
                                    View
                                </Button>
                            </Box>

                            {/* Second Document */}
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    p: 2,
                                    border: "1px solid #E5E7EB",
                                    borderRadius: 2,
                                    bgcolor: "#F9FAFB",
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <Box
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 1,
                                            bgcolor: "#E5E7EB",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Typography variant="body2" sx={{ color: "#6B7280", fontWeight: 600 }}>
                                            PDF
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" fontWeight="600" sx={{ color: "#1F2937" }}>
                                            View Document
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: "#6B7280" }}>
                                            Document description
                                        </Typography>
                                    </Box>
                                </Box>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        textTransform: "none",
                                        borderColor: "#E5E7EB",
                                        color: "#374151",
                                        fontWeight: 600,
                                        borderRadius: 1,
                                    }}
                                >
                                    View
                                </Button>
                            </Box>
                        </Box>
                    </Card>

                    {/* Client Review - REMOVED as not present in the image */}
                </Box>

                {/* Right Column */}
                <Box>
                    {/* Finalized Quote Amount */}
                    <Card
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            mb: 3,
                            border: "1px solid #E5E7EB",
                            boxShadow: "none",
                        }}
                    >
                        <Typography
                            variant="body2"
                            fontWeight="600"
                            gutterBottom
                            sx={{ color: "#1F2937", mb: 2 }}
                        >
                            Finalized Quote Amount
                        </Typography>
                        <Typography
                            variant="h4"
                            fontWeight="700"
                            sx={{ color: "#2F6B8E", mb: 3 }}
                        >
                            {completedData.finalizedQuoteAmount}
                        </Typography>
                    </Card>

                    {/* Security Code */}
                    <Card
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            mb: 3,
                            border: "1px solid #E5E7EB",
                            boxShadow: "none",
                        }}
                    >
                        <Typography
                            variant="body2"
                            fontWeight="600"
                            gutterBottom
                            sx={{ color: "#1F2937", mb: 2 }}
                        >
                            Security Code
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                            {completedData.securityCode.map((digit, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        border: "none",
                                        borderRadius: 2,
                                        bgcolor: "#F3F4F6",
                                    }}
                                >
                                    <Typography
                                        variant="h5"
                                        fontWeight="500"
                                        sx={{ color: "#1F2937" }}
                                    >
                                        {digit}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                        <Typography variant="caption" sx={{ color: "#6B7280" }}>
                            Note: Find a $499 with pages to meet the date.
                        </Typography>
                    </Card>

                    {/* Personalized Short Message Section - NEW */}
                    <Card
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            mb: 3,
                            border: "1px solid #E5E7EB",
                            boxShadow: "none",
                        }}
                    >
                        <Typography
                            variant="h6"
                            fontWeight="600"
                            gutterBottom
                            sx={{ color: "#1F2937", mb: 2 }}
                        >
                            Personalized short message
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ color: "#6B7280", lineHeight: 1.8, textAlign: "justify" }}
                        >
                            {completedData.description}
                        </Typography>
                    </Card>

                    {/* About Professional Section - NEW */}
                    <Card
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            mb: 3,
                            border: "1px solid #E5E7EB",
                            boxShadow: "none",
                        }}
                    >
                        <Typography
                            variant="h6"
                            fontWeight="600"
                            gutterBottom
                            sx={{ color: "#1F2937", mb: 2 }}
                        >
                            About professional
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Avatar
                                src={completedData.clientAvatar}
                                alt={completedData.clientName}
                                sx={{ width: 56, height: 56 }}
                            />
                            <Box>
                                <Typography variant="body1" fontWeight="600" sx={{ mb: 0.5 }}>
                                    {completedData.clientName}
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#6B7280" }}>
                                    Professional
                                </Typography>
                            </Box>
                        </Box>
                    </Card>

                    {/* Address Card */}
                    <Card
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            mb: 3,
                            border: "1px solid #E5E7EB",
                            boxShadow: "none",
                        }}
                    >
                        <Typography
                            variant="h6"
                            fontWeight="600"
                            gutterBottom
                            sx={{ color: "#1F2937", mb: 2 }}
                        >
                            Address
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                            <LocationOnIcon
                                sx={{ fontSize: "1.2rem", color: "#6B7280", mt: 0.2 }}
                            />
                            <Typography
                                variant="body2"
                                sx={{ color: "#374151", lineHeight: 1.6 }}
                            >
                                {completedData.location}
                            </Typography>
                        </Box>
                    </Card>

                    {/* Service Status Card */}
                    <Card
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            border: "1px solid #E5E7EB",
                            boxShadow: "none",
                        }}
                    >
                        <Typography
                            variant="h6"
                            fontWeight="600"
                            gutterBottom
                            sx={{ color: "#1F2937", mb: 3 }}
                        >
                            Service Status
                        </Typography>

                        {/* Timeline */}
                        {completedData.serviceTimeline.map((item, index) => (
                            <Box key={index} sx={{ mb: 3, position: "relative" }}>
                                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                                    <Box
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: "50%",
                                            bgcolor: item.completed ? "#10B981" : "#4B5563",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                        }}
                                    >
                                        {item.completed ? (
                                            <CheckCircleIcon
                                                sx={{ fontSize: "1.1rem", color: "white" }}
                                            />
                                        ) : (
                                            <Typography
                                                variant="body2"
                                                fontWeight="600"
                                                sx={{ color: "white" }}
                                            >
                                                {index + 1}
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
                                        <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
                                            {item.date}
                                        </Typography>
                                    </Box>
                                </Box>
                                {index < completedData.serviceTimeline.length - 1 && (
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            left: 13.5,
                                            top: 36,
                                            width: "0.5%",
                                            height: 40,
                                            bgcolor: "#E5E7EB",
                                        }}
                                    />
                                )}
                            </Box>
                        ))}
                    </Card>

                    {/* Information Message */}
                    <Box
                        sx={{
                            mt: 4,
                            p: 2.5,
                            borderRadius: 2,
                            bgcolor: "#FFFBEB",
                            border: "1px solid #FEF3C7",
                        }}
                    >
                        <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                            <Box
                                sx={{
                                    width: 20,
                                    height: 20,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                    mt: 0.2,
                                }}
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                                        fill="#F59E0B"
                                    />
                                </svg>
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" fontWeight="600" sx={{ mb: 1, color: "#92400E" }}>
                                    Information message
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ lineHeight: 1.6, fontSize: "0.8rem", color: "#92400E" }}
                                >
                                    Guiding access to queries to display or remote recognition via your client. You can use your client credentials in order to help you understand your content. Verifying the legal process of processing your queries from the query server. Your client credentials have no specific value or any potential impact.
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}