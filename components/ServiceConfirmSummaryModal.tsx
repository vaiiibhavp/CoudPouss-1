import React from "react";
import {
    Dialog,
    DialogContent,
    Box,
    Typography,
    Button,
    Divider,
    Avatar,
} from "@mui/material";
import Image from "next/image";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

interface ServiceConfirmSummaryModalProps {
    open: boolean;
    onClose: () => void;
    onTrackService: () => void;

    // service info
    serviceTitle: string;
    serviceCategory: string;
    serviceImage?: string;
    serviceTypeLabel?: string;
    location: string;
    dateLabel: string;
    timeLabel: string;

    // professional info
    providerName: string;
    providerPhone?: string;
    providerAvatar?: string;

    // payment info
    finalizedQuoteAmount: number;
    platformFeePercent?: number;
    taxes?: number;
    currencySymbol?: string;
}

export default function ServiceConfirmSummaryModal({
    open,
    onClose,
    onTrackService,
    serviceTitle,
    serviceCategory,
    serviceImage = "/image/service-image-1.png",
    serviceTypeLabel = "DIY Services",
    location,
    dateLabel,
    timeLabel,
    providerName,
    providerPhone = "",
    providerAvatar="/image/service-image-1.png",
    finalizedQuoteAmount,
    platformFeePercent = 10,
    taxes = 0,
    currencySymbol = "€",
}: ServiceConfirmSummaryModalProps) {
    const platformFeeAmount = (finalizedQuoteAmount * platformFeePercent) / 100;
    const total = finalizedQuoteAmount + platformFeeAmount + taxes;

    const formatAmount = (value: number) =>
        `${currencySymbol}${value.toFixed(1)}`;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    borderRadius: "24px",
                    p: "40px",
                    width: "986px",
                    maxWidth: "986px",
                    m: "auto",
                },
            }}
        >
            <DialogContent sx={{ p: 0 }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        gap: "32px",
                    }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Image
                            alt="checked-green"
                            width={58}
                            height={58}
                            src={"/icons/checked_green.png"}
                        />

                        <Typography
                            fontWeight={600}
                            sx={{
                                fontSize: "20px",
                                lineHeight: "28px",
                                color: "#0F232F",
                                mb: 0.5,
                            }}
                        >
                            Your service has been successfully confirmed with the expert.
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: "14px",
                                lineHeight: "22px",
                                color: "#4B4B4B",
                            }}
                        >
                            Here are the payment and service details.
                        </Typography>
                    </Box>

                    {/* Two-column content */}
                    <Box
                        sx={{
                            width: "100%",
                            display: "grid",
                            gridTemplateColumns: "1.4fr 1fr",
                            columnGap: "32px",
                        }}
                    >
                        {/* LEFT COLUMN */}
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            {/* Service card */}
                            <Box
                                sx={{
                                    borderRadius: "16px",
                                    border: "1px solid #E2E8F0",
                                    bgcolor: "#FFFFFF",
                                    p: 2.5,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                }}
                            >
                                <Box sx={{ display: "flex", gap: 2 }}>
                                    <Box
                                        sx={{
                                            width: 96,
                                            height: 96,
                                            borderRadius: 2,
                                            overflow: "hidden",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <Image
                                            src={serviceImage}
                                            alt={serviceTitle}
                                            width={96}
                                            height={96}
                                            style={{ objectFit: "cover" }}
                                        />
                                    </Box>

                                    <Box sx={{ textAlign: "left" }}>
                                        <Typography
                                            sx={{
                                                fontSize: "18px",
                                                fontWeight: 600,
                                                color: "#0F232F",
                                            }}
                                        >
                                            {serviceTitle}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: "14px",
                                                color: "#64748B",
                                                mt: 0.5,
                                            }}
                                        >
                                            {serviceCategory}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr",
                                        rowGap: 1,
                                        columnGap: 2,
                                        textAlign: "left",
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <BuildOutlinedIcon sx={{ fontSize: 18, color: "#64748B" }} />
                                        <Typography sx={{ fontSize: 13, color: "#475569" }}>
                                            {serviceTypeLabel}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <CalendarTodayOutlinedIcon
                                            sx={{ fontSize: 16, color: "#64748B" }}
                                        />
                                        <Typography sx={{ fontSize: 13, color: "#475569" }}>
                                            {dateLabel}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <LocationOnOutlinedIcon
                                            sx={{ fontSize: 18, color: "#64748B" }}
                                        />
                                        <Typography sx={{ fontSize: 13, color: "#475569" }}>
                                            {location}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <AccessTimeOutlinedIcon
                                            sx={{ fontSize: 18, color: "#64748B" }}
                                        />
                                        <Typography sx={{ fontSize: 13, color: "#475569" }}>
                                            {timeLabel}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            {/* Professional card */}
                            <Box
                                sx={{
                                    borderRadius: "16px",
                                    border: "1px solid #E2E8F0",
                                    bgcolor: "#FFFFFF",
                                    p: 2.5,
                                    textAlign: "left",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: 14,
                                        fontWeight: 600,
                                        color: "#0F232F",
                                        mb: 1.5,
                                    }}
                                >
                                    About professional
                                </Typography>

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: 2,
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                        <Avatar
                                            src={providerAvatar}
                                            alt={providerName}
                                            sx={{ width: 44, height: 44 }}
                                        />
                                        <Box>
                                            <Typography
                                                sx={{
                                                    fontSize: 14,
                                                    fontWeight: 600,
                                                    color: "#0F232F",
                                                }}
                                            >
                                                {providerName}
                                            </Typography>
                                            {providerPhone && (
                                                <Typography
                                                    sx={{ fontSize: 13, color: "#64748B", mt: 0.2 }}
                                                >
                                                    {providerPhone}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>

                                    <Button
                                        variant="outlined"
                                        sx={{
                                            borderRadius: "999px",
                                            textTransform: "none",
                                            fontSize: 13,
                                            px: 2.5,
                                            borderColor: "#CBD5E1",
                                            color: "#0F172A",
                                            "&:hover": {
                                                borderColor: "#94A3B8",
                                                bgcolor: "#F8FAFC",
                                            },
                                        }}
                                    >
                                        View profile
                                    </Button>
                                </Box>
                            </Box>
                        </Box>

                        {/* RIGHT COLUMN – payment breakdown + info message */}
                        <Box>
                            <Box
                                sx={{
                                    borderRadius: "16px",
                                    border: "1px solid #E2E8F0",
                                    bgcolor: "#FFFFFF",
                                    p: 2.5,
                                    textAlign: "left",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: "14px",
                                        color: "#1F2933",
                                    }}
                                >
                                    Final Payment Breakdown
                                </Typography>

                                <Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            mb: 1.5,
                                        }}
                                    >
                                        <Typography sx={{ fontSize: 14, color: "#424242" }}>
                                            Finalized Quote Amount
                                        </Typography>
                                        <Typography sx={{ fontSize: 14, color: "#111827" }}>
                                            {formatAmount(finalizedQuoteAmount)}
                                        </Typography>
                                    </Box>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            mb: 1.5,
                                        }}
                                    >
                                        <Typography sx={{ fontSize: 14, color: "#424242" }}>
                                            Platform Fee ({platformFeePercent}%)
                                        </Typography>
                                        <Typography sx={{ fontSize: 14, color: "#111827" }}>
                                            {formatAmount(platformFeeAmount)}
                                        </Typography>
                                    </Box>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            mb: 1.5,
                                        }}
                                    >
                                        <Typography sx={{ fontSize: 14, color: "#424242" }}>
                                            Taxes
                                        </Typography>
                                        <Typography sx={{ fontSize: 14, color: "#111827" }}>
                                            {formatAmount(taxes)}
                                        </Typography>
                                    </Box>

                                    <Divider
                                        sx={{
                                            my: 2,
                                            borderStyle: "dashed",
                                            borderColor: "#CBD5E1",
                                        }}
                                    />

                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: "16px",
                                                fontWeight: 600,
                                                color: "#0F232F",
                                            }}
                                        >
                                            Total
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: "18px",
                                                fontWeight: 700,
                                                color: "#2C6587",
                                            }}
                                        >
                                            {formatAmount(total)}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Info message INSIDE the right card (matches Figma) */}
                                <Box
                                    sx={{
                                        borderRadius: "12px",
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: 1,
                                        mt: 1,
                                    }}
                                >

                                    <Box   >
                                        <Box sx={{
                                            display: "flex ",
                                            gap: 1.5,
                                            mb: 1,
                                            alignItems: "center",
                                        }} >
                                            <WarningAmberOutlinedIcon
                                                sx={{ color: "#F59E0B", mt: 0.4, fontSize: 20 }}
                                            />
                                            <Typography
                                                sx={{
                                                    fontSize: 18,
                                                    fontWeight: 600,
                                                    mb: 0.3,
                                                }}
                                            >
                                                Information message:
                                            </Typography>

                                        </Box>
                                        <Typography
                                            sx={{
                                                fontSize: 12,
                                                lineHeight: "18px",
                                            }}
                                        >
                                            CoadiPro doesn’t guarantee the quality of services
                                            exchanged from this point onward. Our role is to connect
                                            you with professionals and securely store your
                                            transactions through escrow. All services and payments
                                            outside the platform are handled directly by the users.
                                            Once you provide the validation code to your provider, you
                                            must request an invoice or receipt from them for your
                                            payment.
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    {/* Bottom Track button */}
                    <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
                        <Button
                            variant="contained"
                            onClick={onTrackService}
                            sx={{
                                borderRadius: "12px",
                                textTransform: "none",
                                bgcolor: "primary.main",
                                color: "#FFFFFF",
                                fontWeight: 500,
                                px: 4,
                                "&:hover": {
                                    bgcolor: "primary.dark",
                                },
                            }}
                        >
                            Track service
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
