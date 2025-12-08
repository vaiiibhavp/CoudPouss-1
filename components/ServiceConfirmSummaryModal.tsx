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
                    borderRadius: "1.5rem",
                    p: "2.5rem",
                    width: "61.625rem",
                    maxWidth: "61.625rem",
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
                        gap: "2rem",
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
                            fontWeight={400}
                            sx={{
                                fontSize: "1.25rem",
                                lineHeight: "1.75rem",
                                color: "#0F232F",
                                mb: 0.5,
                                width: "31.6875rem",
                                textAlign: "center",
                            }}
                        >
                          Your service has been successfully confirmed with the expert. Here are the payment and service details. 
                        </Typography>
                    </Box>

                    {/* Two-column content */}
                    <Box
                        sx={{
                            width: "100%",
                            display: "grid",
                            gridTemplateColumns: "1.4fr 1fr",
                            columnGap: "2rem",
                        }}
                    >
                        {/* LEFT COLUMN */}
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            {/* Section 1: Service card with image and title */}
                            <Box
                                sx={{
                                    borderRadius: "1.25rem",
                                    border: "0.0625rem solid #E2E8F0",
                                    bgcolor: "#EAF0F3",
                                    p: "0.75rem",
                                    display: "flex",
                                    gap: "1rem",
                                }}
                            >
                                <Box
                                    sx={{
                                        width: "8.5625rem",
                                        height: "7.25rem",
                                        borderRadius: "0.75rem",
                                        overflow: "hidden",
                                        flexShrink: 0,
                                    }}
                                >
                                    <Image
                                        src={serviceImage}
                                        alt={serviceTitle}
                                        width={137}
                                        height={116}
                                        style={{ objectFit: "cover" }}
                                    />
                                </Box>

                                <Box sx={{ textAlign: "left", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                    <Typography
                                        fontWeight={600}
                                        sx={{
                                            fontSize: "1.5rem",
                                            lineHeight: "1.75rem",
                                            letterSpacing: "0%",
                                            color: "#2C6587",
                                        }}
                                    >
                                        {serviceTitle}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: "0.875rem",
                                            color: "#64748B",
                                            mt: 0.5,
                                        }}
                                    >
                                        {serviceCategory}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Section 2: Service details */}
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
                                    <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
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
                                            {serviceTypeLabel}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
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
                                            {dateLabel}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
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
                                            {location}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
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
                                            {timeLabel}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            {/* Section 3: Professional card */}
                            <Box
                                sx={{
                                    borderRadius: "1rem",
                                    border: "0.0625rem solid #E2E8F0",
                                    bgcolor: "#FFFFFF",
                                    p: 2.5,
                                    textAlign: "left",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: "0.875rem",
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
                                            sx={{ width: "3.5rem", height: "3.5rem" }}
                                        />
                                        <Box>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                                                <Typography
                                                    sx={{
                                                        fontSize: "1.25rem",
                                                        lineHeight: "1.5rem",
                                                        letterSpacing: "0%",
                                                        color: "#0F232F",
                                                    }}
                                                >
                                                    {providerName}
                                                </Typography>
                                                <Image
                                                    src="/icons/verify.png"
                                                    alt="Verified"
                                                    width={24}
                                                    height={24}
                                                />
                                            </Box>
                                            {providerPhone && (
                                                <Box sx={{ display: "flex", alignItems: "center", gap: "0.375rem", mt: 0.2 }}>
                                                    <Image
                                                        src="/icons/Phone.png"
                                                        alt="Phone"
                                                        width={20}
                                                        height={20}
                                                    />
                                                    <Typography
                                                        fontWeight={400}
                                                        sx={{
                                                            fontSize: "0.75rem",
                                                            lineHeight: "100%",
                                                            letterSpacing: "0%",
                                                            color: "#595959",
                                                        }}
                                                    >
                                                        {providerPhone}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>

                                    <Button
                                        variant="outlined"
                                        sx={{
                                            borderRadius: "0.5rem",
                                            textTransform: "none",
                                            fontSize: "0.8125rem",
                                            paddingTop: "0.625rem",
                                            paddingRight: "0.875rem",
                                            paddingBottom: "0.625rem",
                                            paddingLeft: "0.875rem",
                                            borderColor: "#214C65",
                                            color: "#214C65",
                                            "&:hover": {
                                                borderColor: "#214C65",
                                                bgcolor: "transparent",
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
                                    borderRadius: "0.75rem",
                                    border: "0.03125rem solid #E6E6E6",
                                    bgcolor: "#FFFFFF",
                                    paddingTop: "1.25rem",
                                    paddingRight: "1rem",
                                    paddingBottom: "1.25rem",
                                    paddingLeft: "1rem",
                                    textAlign: "left",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "1rem",
                                    "&:hover": {
                                        border: "0.03125rem solid #E6E6E6",
                                    },
                                }}
                            >
                                <Typography
                                    fontWeight={600}
                                    sx={{
                                        fontSize: "1rem",
                                        lineHeight: "1.125rem",
                                        letterSpacing: "0%",
                                        color: "#2C6587",
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
                                        <Typography
                                            fontWeight={500}
                                            sx={{
                                                fontSize: "0.875rem",
                                                lineHeight: "1rem",
                                                letterSpacing: "0%",
                                                color: "#595959",
                                            }}
                                        >
                                            Finalized Quote Amount
                                        </Typography>
                                        <Typography
                                            fontWeight={500}
                                            sx={{
                                                fontSize: "0.875rem",
                                                lineHeight: "1rem",
                                                letterSpacing: "0%",
                                                color: "#595959",
                                            }}
                                        >
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
                                        <Typography
                                            fontWeight={500}
                                            sx={{
                                                fontSize: "0.875rem",
                                                lineHeight: "1rem",
                                                letterSpacing: "0%",
                                                color: "#595959",
                                            }}
                                        >
                                            Platform Fee ({platformFeePercent}%)
                                        </Typography>
                                        <Typography
                                            fontWeight={500}
                                            sx={{
                                                fontSize: "0.875rem",
                                                lineHeight: "1rem",
                                                letterSpacing: "0%",
                                                color: "#595959",
                                            }}
                                        >
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
                                        <Typography
                                            fontWeight={500}
                                            sx={{
                                                fontSize: "0.875rem",
                                                lineHeight: "1rem",
                                                letterSpacing: "0%",
                                                color: "#595959",
                                            }}
                                        >
                                            Taxes
                                        </Typography>
                                        <Typography
                                            fontWeight={500}
                                            sx={{
                                                fontSize: "0.875rem",
                                                lineHeight: "1rem",
                                                letterSpacing: "0%",
                                                color: "#595959",
                                            }}
                                        >
                                            {formatAmount(taxes)}
                                        </Typography>
                                    </Box>

                                    <Divider
                                        sx={{
                                            my: 2,
                                            borderStyle: "dashed",
                                            borderWidth: "0.0625rem",
                                            borderColor: "#2C6587",
                                            borderImageSource: "none",
                                            "&::before, &::after": {
                                                borderStyle: "dashed",
                                                borderWidth: "0.0625rem",
                                            },
                                        }}
                                    />

                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Typography
                                            fontWeight={600}
                                            sx={{
                                                fontSize: "1.25rem",
                                                lineHeight: "1.5rem",
                                                letterSpacing: "0%",
                                                color: "#0F232F",
                                            }}
                                        >
                                            Total
                                        </Typography>
                                        <Typography
                                            fontWeight={500}
                                            sx={{
                                                fontSize: "1.25rem",
                                                lineHeight: "100%",
                                                letterSpacing: "0%",
                                                color: "#2C6587",
                                            }}
                                        >
                                            {formatAmount(total)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            {/* Information message - separate from payment breakdown */}
                            <Box
                                sx={{
                                    borderRadius: "0.75rem",
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: 1,
                                    mt: 2,
                                    textAlign: "left",
                                }}
                            >
                                <Box>
                                    <Box sx={{
                                        display: "flex",
                                        gap: 1.5,
                                        mb: 1,
                                        alignItems: "center",
                                    }}>
                                        <Image
                                            src="/icons/Warning.png"
                                            alt="Warning"
                                            width={20}
                                            height={20}
                                        />
                                        <Typography
                                            fontWeight={500}
                                            sx={{
                                                fontSize: "1.125rem",
                                                lineHeight: "1.25rem",
                                                letterSpacing: "0%",
                                                color: "#323232",
                                                mb: 0.3,
                                            }}
                                        >
                                            Information message:
                                        </Typography>
                                    </Box>
                                    <Typography
                                        fontWeight={400}
                                        sx={{
                                            fontSize: "0.75rem",
                                            lineHeight: "150%",
                                            letterSpacing: "0%",
                                            color: "#323232",
                                        }}
                                    >
                                        CoadiPro doesn't guarantee the quality of services
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

                    {/* Bottom Track button */}
                    <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
                        <Button
                            variant="contained"
                            onClick={onTrackService}
                            sx={{
                                borderRadius: "0.75rem",
                                textTransform: "none",
                                bgcolor: "#214C65",
                                paddingTop: "1.125rem",
                                paddingBottom: "1.125rem",
                                paddingLeft: "3.46875rem",
                                paddingRight: "3.46875rem",
                                color: "#FFFFFF",
                                fontWeight: 600,
                                fontSize: "1.1875rem",
                                lineHeight: "1.25rem",
                                letterSpacing: "1%",
                                "&:hover": {
                                    bgcolor: "#214C65",
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
